from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from app.db.mongodb import mongodb
from app.models.fake_orders_model import FakeOrdersModel
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Pydantic models for request/response
class StatusUpdateRequest(BaseModel):
    status: str
    message_text: Optional[str] = None

class FlagUpdateRequest(BaseModel):
    flag_count: int
    suspicious: bool = True
    message_text: Optional[str] = None

class MessageRequest(BaseModel):
    message_text: str
    sender: Optional[str] = "user"

class CreateOrderRequest(BaseModel):
    order_id: str
    customer: str
    phone: str
    address: str
    amount: float
    status: str = "new"
    suspicious: bool = False
    flag_count: int = 0
    order_history: List[str] = []
    verification_required: bool = False

def get_fake_orders_model() -> FakeOrdersModel:
    """Get fake orders model instance"""
    return FakeOrdersModel(mongodb.get_database())

@router.get("/", response_model=List[Dict[str, Any]])
async def get_fake_orders(status: Optional[str] = Query(None, description="Filter by status: all, new, checking, requires_verification, partial_payment_requested, flagged, blacklisted, processing, completed, canceled")):
    """
    Get all fake order detection records with optional status filter
    """
    try:
        model = get_fake_orders_model()
        orders = model.get_all_orders(status_filter=status)
        return orders
    except Exception as e:
        logger.error(f"Error getting fake order detection records: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{order_id}", response_model=Dict[str, Any])
async def get_fake_order(order_id: str):
    """
    Get a specific fake order detection record by order ID
    """
    try:
        model = get_fake_orders_model()
        order = model.get_order_by_id(order_id)
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return order
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting fake order detection record {order_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{order_id}/status")
async def update_order_status(order_id: str, request: StatusUpdateRequest):
    """
    Update fake order status and optionally add a message
    """
    try:
        # Validate status
        valid_statuses = ["new", "checking", "requires_verification", "partial_payment_requested", "flagged", "blacklisted", "processing", "completed", "canceled"]
        if request.status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
        
        model = get_fake_orders_model()
        
        # Check if order exists
        existing_order = model.get_order_by_id(order_id)
        if not existing_order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Update the order
        success = model.update_order_status(order_id, request.status, request.message_text)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update order status")
        
        # Return updated order
        updated_order = model.get_order_by_id(order_id)
        return updated_order
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating fake order detection record {order_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{order_id}/flag")
async def update_order_flag(order_id: str, request: FlagUpdateRequest):
    """
    Update order flag count and suspicious status
    """
    try:
        model = get_fake_orders_model()
        
        # Check if order exists
        existing_order = model.get_order_by_id(order_id)
        if not existing_order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Update flag count
        success = model.update_order_flag_count(order_id, request.flag_count, request.suspicious)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update order flag count")
        
        # Add message if provided
        if request.message_text:
            model.add_message(order_id, request.message_text, "system")
        
        # Return updated order
        updated_order = model.get_order_by_id(order_id)
        return updated_order
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating flag count for fake order detection record {order_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/{order_id}/messages")
async def add_message(order_id: str, request: MessageRequest):
    """
    Add a message to a fake order detection record
    """
    try:
        model = get_fake_orders_model()
        
        # Check if order exists
        existing_order = model.get_order_by_id(order_id)
        if not existing_order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Add the message
        success = model.add_message(order_id, request.message_text, request.sender)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to add message")
        
        # Return updated order
        updated_order = model.get_order_by_id(order_id)
        return updated_order
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding message to fake order detection record {order_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/stats/summary")
async def get_fake_order_stats():
    """
    Get fake order detection statistics summary
    """
    try:
        model = get_fake_orders_model()
        stats = model.get_stats()
        return stats
    except Exception as e:
        logger.error(f"Error getting fake order detection stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/", response_model=Dict[str, Any])
async def create_fake_order(request: CreateOrderRequest):
    """
    Create a new fake order detection record
    """
    try:
        model = get_fake_orders_model()
        
        # Check if order already exists
        existing_order = model.get_order_by_id(request.order_id)
        if existing_order:
            raise HTTPException(status_code=400, detail="Order with this ID already exists")
        
        # Validate amount
        if request.amount < 0:
            raise HTTPException(status_code=400, detail="Amount must be greater than or equal to 0")
        
        # Create the order
        order_data = request.dict()
        model.create_order(order_data)
        
        # Return created order
        created_order = model.get_order_by_id(request.order_id)
        return created_order
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating fake order detection record: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/{order_id}")
async def delete_fake_order(order_id: str):
    """
    Delete a fake order detection record
    """
    try:
        model = get_fake_orders_model()
        
        # Check if order exists
        existing_order = model.get_order_by_id(order_id)
        if not existing_order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Delete the order
        success = model.delete_order(order_id)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete order")
        
        return {"message": f"Order {order_id} deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting fake order detection record {order_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error") 