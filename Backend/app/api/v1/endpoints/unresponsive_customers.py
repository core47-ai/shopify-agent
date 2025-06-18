from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from app.db.mongodb import mongodb
from app.models.order_model import OrderModel
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

def get_order_model() -> OrderModel:
    """Get order model instance"""
    return OrderModel(mongodb.get_database())

@router.get("/", response_model=List[Dict[str, Any]])
async def get_unresponsive_customers(
    status_filter: Optional[str] = Query(None, description="Filter by status: waiting, reminder_sent, no_response, tagged, manual_followup")
):
    """
    Get unresponsive customers based on order status and timing
    """
    try:
        order_model = get_order_model()
        
        # Get orders that indicate unresponsive customers
        # These are orders with "pending" or "unconfirmed" status
        unresponsive_query = {
            "$or": [
                {"status": "pending"},
                {"status": "unconfirmed"}
            ]
        }
        
        orders = list(order_model.collection.find(unresponsive_query).sort("created_date", -1))
        
        unresponsive_customers = []
        
        for order in orders:
            # Determine customer status based on order details and timing
            customer_status = determine_customer_status(order)
            
            # Apply status filter if provided
            if status_filter and customer_status != status_filter:
                continue
            
            # Format customer data for unresponsive customers view
            customer_data = {
                "_id": str(order["_id"]),
                "id": f"CUST-{order['order_id'].split('-')[-1]}",
                "customer_id": order["order_id"],
                "name": order["customer_name"],
                "email": order["customer_email"],
                "phone": order["customer_phone"],
                "address": order["customer_address"],
                "order_number": order["order_id"],
                "order_date": order["created_date"].strftime("%Y-%m-%d"),
                "order_total": order["total_price"],
                "status": customer_status,
                "last_contact": get_last_contact_time(order),
                "flow_stage": determine_flow_stage(order),
                "actions": generate_customer_timeline(order),
                "days_since_order": (datetime.now() - order["created_date"]).days
            }
            
            unresponsive_customers.append(customer_data)
        
        return unresponsive_customers

    except Exception as e:
        logger.error(f"Error getting unresponsive customers: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/reminders", response_model=List[Dict[str, Any]])
async def get_reminder_history():
    """
    Get history of all reminders sent to customers
    """
    try:
        order_model = get_order_model()
        
        # Find all orders that have reminder entries in confirmation_history
        pipeline = [
            {
                "$match": {
                    "confirmation_history": {
                        "$elemMatch": {
                            "$or": [
                                {"type": "Reminder Sent"},
                                {"type": {"$regex": "reminder", "$options": "i"}},
                                {"content": {"$regex": "reminder", "$options": "i"}}
                            ]
                        }
                    }
                }
            },
            {"$sort": {"created_date": -1}}
        ]
        
        orders = list(order_model.collection.aggregate(pipeline))
        reminder_history = []
        
        for order in orders:
            # Extract reminder entries from confirmation history
            for entry in order.get("confirmation_history", []):
                if (entry.get("type") == "Reminder Sent" or 
                    "reminder" in entry.get("type", "").lower() or 
                    "reminder" in entry.get("content", "").lower()):
                    
                    reminder_data = {
                        "_id": str(order["_id"]),
                        "order_id": order["order_id"],
                        "customer_name": order["customer_name"],
                        "customer_email": order["customer_email"],
                        "customer_phone": order["customer_phone"],
                        "reminder_type": entry.get("type", "Reminder"),
                        "reminder_content": entry.get("content", ""),
                        "sent_date": entry["timestamp"].strftime("%Y-%m-%d") if isinstance(entry.get("timestamp"), datetime) else entry.get("timestamp", "Unknown"),
                        "sent_time": entry["timestamp"].strftime("%I:%M %p") if isinstance(entry.get("timestamp"), datetime) else "",
                        "status": entry.get("status", "sent"),
                        "order_total": order["total_price"],
                        "days_since_reminder": (datetime.now() - entry["timestamp"]).days if isinstance(entry.get("timestamp"), datetime) else 0
                    }
                    reminder_history.append(reminder_data)
        
        # Sort by reminder date (most recent first)
        reminder_history.sort(key=lambda x: x["sent_date"], reverse=True)
        return reminder_history

    except Exception as e:
        logger.error(f"Error getting reminder history: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/resolved", response_model=List[Dict[str, Any]])
async def get_resolved_customers():
    """
    Get customers who have been marked as resolved
    """
    try:
        order_model = get_order_model()
        
        # Find orders that have "Marked as Resolved" entries or were resolved through actions
        pipeline = [
            {
                "$match": {
                    "$or": [
                        {"status": "confirmed"},
                        {
                            "confirmation_history": {
                                "$elemMatch": {
                                    "$or": [
                                        {"type": "Marked as Resolved"},
                                        {"content": {"$regex": "marked as resolved", "$options": "i"}}
                                    ]
                                }
                            }
                        }
                    ]
                }
            },
            {"$sort": {"created_date": -1}}
        ]
        
        orders = list(order_model.collection.aggregate(pipeline))
        resolved_customers = []
        
        for order in orders:
            # Find the resolution entry
            resolution_entry = None
            for entry in order.get("confirmation_history", []):
                if (entry.get("type") == "Marked as Resolved" or 
                    "marked as resolved" in entry.get("content", "").lower()):
                    resolution_entry = entry
                    break
            
            # If no explicit resolution entry found but status is confirmed, 
            # check if it was originally unresponsive
            if not resolution_entry and order["status"] == "confirmed":
                # Check if there were any reminder or call attempts
                had_issues = any(
                    "reminder" in entry.get("content", "").lower() or 
                    "call" in entry.get("content", "").lower() or
                    entry.get("type") in ["Reminder Sent", "Customer Called"]
                    for entry in order.get("confirmation_history", [])
                )
                if had_issues:
                    # Find the confirmation entry
                    for entry in reversed(order.get("confirmation_history", [])):
                        if entry.get("type") == "Response" and "yes" in entry.get("content", "").lower():
                            resolution_entry = entry
                            break
            
            if resolution_entry or order["status"] == "confirmed":
                resolved_data = {
                    "_id": str(order["_id"]),
                    "order_id": order["order_id"],
                    "customer_name": order["customer_name"],
                    "customer_email": order["customer_email"],
                    "customer_phone": order["customer_phone"],
                    "customer_address": order["customer_address"],
                    "order_total": order["total_price"],
                    "order_date": order["created_date"].strftime("%Y-%m-%d"),
                    "resolved_date": resolution_entry["timestamp"].strftime("%Y-%m-%d") if resolution_entry and isinstance(resolution_entry.get("timestamp"), datetime) else order["created_date"].strftime("%Y-%m-%d"),
                    "resolved_time": resolution_entry["timestamp"].strftime("%I:%M %p") if resolution_entry and isinstance(resolution_entry.get("timestamp"), datetime) else "",
                    "resolution_method": resolution_entry.get("type", "Customer Confirmed") if resolution_entry else "Customer Confirmed",
                    "resolution_note": resolution_entry.get("content", "") if resolution_entry else "Customer confirmed order",
                    "days_to_resolve": (resolution_entry["timestamp"] - order["created_date"]).days if resolution_entry and isinstance(resolution_entry.get("timestamp"), datetime) else 0,
                    "status": "resolved"
                }
                resolved_customers.append(resolved_data)
        
        # Sort by resolution date (most recent first)
        resolved_customers.sort(key=lambda x: x["resolved_date"], reverse=True)
        return resolved_customers

    except Exception as e:
        logger.error(f"Error getting resolved customers: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{customer_id}/action")
async def update_customer_action(
    customer_id: str, 
    action: str,
    note: Optional[str] = None
):
    """
    Update customer action (Send Reminder, Call Customer, Mark as Resolved)
    """
    try:
        valid_actions = ["send_reminder", "call_customer", "mark_resolved"]
        if action not in valid_actions:
            raise HTTPException(status_code=400, detail=f"Invalid action. Must be one of: {valid_actions}")
        
        order_model = get_order_model()
        
        # Find the order by customer ID (extract order_id from customer_id)
        order_id_suffix = customer_id.replace("CUST-", "")
        order_query = {"order_id": {"$regex": f".*{order_id_suffix}$"}}
        order = order_model.collection.find_one(order_query)
        
        if not order:
            raise HTTPException(status_code=404, detail="Customer order not found")
        
        # Create action entry for confirmation history
        action_entry = {
            "type": get_action_display_name(action),
            "content": note or get_default_action_message(action),
            "timestamp": datetime.now(),
            "status": "completed" if action == "mark_resolved" else "sent"
        }
        
        # Update order with new action
        update_result = order_model.collection.update_one(
            {"_id": order["_id"]},
            {
                "$push": {
                    "confirmation_history": action_entry
                },
                "$set": {
                    "status": "confirmed" if action == "mark_resolved" else order["status"]
                }
            }
        )
        
        if update_result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to update customer action")
        
        return {"message": f"Action '{action}' updated successfully", "customer_id": customer_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating customer action {customer_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/stats/summary")
async def get_unresponsive_stats():
    """
    Get statistics for unresponsive customers
    """
    try:
        order_model = get_order_model()
        
        # Get unresponsive orders
        unresponsive_query = {
            "$or": [
                {"status": "pending"},
                {"status": "unconfirmed"}
            ]
        }
        
        orders = list(order_model.collection.find(unresponsive_query))
        
        stats = {
            "waiting": 0,
            "reminder_sent": 0, 
            "no_response": 0,
            "tagged": 0,
            "manual_followup": 0,
            "total": len(orders)
        }
        
        for order in orders:
            customer_status = determine_customer_status(order)
            if customer_status in stats:
                stats[customer_status] += 1
        
        return stats
        
    except Exception as e:
        logger.error(f"Error getting unresponsive stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/stats/reminders")
async def get_reminder_stats():
    """
    Get statistics for reminder history
    """
    try:
        order_model = get_order_model()
        
        # Count reminders sent in different time periods
        now = datetime.now()
        today = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        pipeline = [
            {
                "$match": {
                    "confirmation_history": {
                        "$elemMatch": {
                            "$or": [
                                {"type": "Reminder Sent"},
                                {"content": {"$regex": "reminder", "$options": "i"}}
                            ]
                        }
                    }
                }
            }
        ]
        
        orders = list(order_model.collection.aggregate(pipeline))
        
        stats = {
            "total_reminders": 0,
            "today": 0,
            "this_week": 0,
            "this_month": 0
        }
        
        for order in orders:
            for entry in order.get("confirmation_history", []):
                if (entry.get("type") == "Reminder Sent" or 
                    "reminder" in entry.get("content", "").lower()):
                    
                    stats["total_reminders"] += 1
                    
                    if isinstance(entry.get("timestamp"), datetime):
                        entry_date = entry["timestamp"]
                        if entry_date >= today:
                            stats["today"] += 1
                        if entry_date >= week_ago:
                            stats["this_week"] += 1
                        if entry_date >= month_ago:
                            stats["this_month"] += 1
        
        return stats
        
    except Exception as e:
        logger.error(f"Error getting reminder stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/stats/resolved")
async def get_resolved_stats():
    """
    Get statistics for resolved customers
    """
    try:
        order_model = get_order_model()
        
        # Count resolved customers in different time periods
        now = datetime.now()
        today = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        pipeline = [
            {
                "$match": {
                    "$or": [
                        {"status": "confirmed"},
                        {
                            "confirmation_history": {
                                "$elemMatch": {
                                    "type": "Marked as Resolved"
                                }
                            }
                        }
                    ]
                }
            }
        ]
        
        orders = list(order_model.collection.aggregate(pipeline))
        
        stats = {
            "total_resolved": len(orders),
            "today": 0,
            "this_week": 0,
            "this_month": 0
        }
        
        for order in orders:
            # Find resolution date
            resolution_date = None
            for entry in order.get("confirmation_history", []):
                if entry.get("type") == "Marked as Resolved":
                    resolution_date = entry.get("timestamp")
                    break
            
            if not resolution_date and order["status"] == "confirmed":
                # Use the latest confirmation timestamp
                for entry in reversed(order.get("confirmation_history", [])):
                    if entry.get("type") == "Response":
                        resolution_date = entry.get("timestamp")
                        break
            
            if isinstance(resolution_date, datetime):
                if resolution_date >= today:
                    stats["today"] += 1
                if resolution_date >= week_ago:
                    stats["this_week"] += 1
                if resolution_date >= month_ago:
                    stats["this_month"] += 1
        
        return stats
        
    except Exception as e:
        logger.error(f"Error getting resolved stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

def determine_customer_status(order: Dict[str, Any]) -> str:
    """Determine customer status based on order data and timing"""
    days_since_order = (datetime.now() - order["created_date"]).days
    confirmation_history = order.get("confirmation_history", [])
    
    # Check if any reminders were sent
    reminder_sent = any(
        entry.get("type") == "Reminder Sent" or "reminder" in entry.get("content", "").lower() 
        for entry in confirmation_history
    )
    
    # Check if customer was called
    call_attempted = any(
        entry.get("type") == "Customer Called" or "call" in entry.get("content", "").lower()
        for entry in confirmation_history
    )
    
    if order["status"] == "unconfirmed":
        if call_attempted:
            return "manual_followup"
        elif days_since_order >= 2:
            return "tagged"
        else:
            return "no_response"
    elif order["status"] == "pending":
        if days_since_order >= 3:
            return "manual_followup"
        elif days_since_order >= 2:
            return "tagged"
        elif days_since_order >= 1 or reminder_sent:
            return "reminder_sent"
        else:
            return "waiting"
    
    return "waiting"

def determine_flow_stage(order: Dict[str, Any]) -> str:
    """Determine the current flow stage for the customer"""
    status = determine_customer_status(order)
    
    flow_mapping = {
        "waiting": "confirmation",
        "reminder_sent": "reminder", 
        "no_response": "no_response",
        "tagged": "call_tagged",
        "manual_followup": "manual_followup"
    }
    
    return flow_mapping.get(status, "confirmation")

def get_last_contact_time(order: Dict[str, Any]) -> str:
    """Get the last contact timestamp"""
    confirmation_history = order.get("confirmation_history", [])
    
    if confirmation_history:
        # Get the most recent contact
        last_entry = max(confirmation_history, key=lambda x: x.get("timestamp", datetime.min))
        if isinstance(last_entry.get("timestamp"), datetime):
            return last_entry["timestamp"].strftime("%Y-%m-%d %I:%M %p")
        else:
            return last_entry.get("timestamp", "Unknown")
    
    return order["created_date"].strftime("%Y-%m-%d %I:%M %p")

def generate_customer_timeline(order: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate timeline actions for the customer"""
    timeline = [
        {
            "type": "Order Placed",
            "timestamp": order["created_date"].strftime("%Y-%m-%d %I:%M %p"),
            "status": "completed"
        }
    ]
    
    # Add confirmation history
    for entry in order.get("confirmation_history", []):
        timeline_entry = {
            "type": entry.get("type", "Unknown Action"),
            "timestamp": entry["timestamp"].strftime("%Y-%m-%d %I:%M %p") if isinstance(entry.get("timestamp"), datetime) else entry.get("timestamp", "Unknown"),
            "status": entry.get("status", "completed")
        }
        
        if entry.get("content"):
            timeline_entry["note"] = entry["content"]
        
        timeline.append(timeline_entry)
    
    return timeline

def get_action_display_name(action: str) -> str:
    """Get display name for action"""
    action_names = {
        "send_reminder": "Reminder Sent",
        "call_customer": "Customer Called", 
        "mark_resolved": "Marked as Resolved"
    }
    return action_names.get(action, action)

def get_default_action_message(action: str) -> str:
    """Get default message for action"""
    action_messages = {
        "send_reminder": "Follow-up reminder sent to customer",
        "call_customer": "Customer contacted via phone call",
        "mark_resolved": "Customer issue marked as resolved"
    }
    return action_messages.get(action, "Action completed") 