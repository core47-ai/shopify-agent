from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from app.db.mongodb import mongodb
from app.models.high_risk_areas_model import HighRiskAreasModel
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Pydantic models for request/response
class StatusUpdateRequest(BaseModel):
    status: str
    message_text: Optional[str] = None

class MessageRequest(BaseModel):
    message_text: str
    sender: Optional[str] = "user"

class CreateOrderRequest(BaseModel):
    order_id: str
    customer: str
    area: str
    address: str
    risk_rate: int
    risk_factors: List[str]
    status: str = "new"

def get_high_risk_areas_model() -> HighRiskAreasModel:
    """Get high risk areas model instance"""
    return HighRiskAreasModel(mongodb.get_database())

@router.get("/", response_model=List[Dict[str, Any]])
async def get_high_risk_area_orders(status: Optional[str] = Query(None, description="Filter by status: all, new, analyzing, high_risk, payment_requested, payment_received, processing, review, completed")):
    """
    Get all high risk area orders with optional status filter
    """
    try:
        model = get_high_risk_areas_model()
        orders = model.get_all_orders(status_filter=status)
        return orders
    except Exception as e:
        logger.error(f"Error getting high risk area orders: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{order_id}", response_model=Dict[str, Any])
async def get_high_risk_area_order(order_id: str):
    """
    Get a specific high risk area order by order ID
    """
    try:
        model = get_high_risk_areas_model()
        order = model.get_order_by_id(order_id)
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return order
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting high risk area order {order_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{order_id}/status")
async def update_order_status(order_id: str, request: StatusUpdateRequest):
    """
    Update high risk area order status and optionally add a message
    """
    try:
        # Validate status
        valid_statuses = ["new", "analyzing", "high_risk", "payment_requested", "payment_received", "processing", "review", "completed"]
        if request.status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
        
        model = get_high_risk_areas_model()
        
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
        logger.error(f"Error updating high risk area order {order_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/{order_id}/messages")
async def add_message(order_id: str, request: MessageRequest):
    """
    Add a message to a high risk area order
    """
    try:
        model = get_high_risk_areas_model()
        
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
        logger.error(f"Error adding message to high risk area order {order_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/stats/summary")
async def get_high_risk_area_stats():
    """
    Get high risk area statistics summary
    """
    try:
        model = get_high_risk_areas_model()
        stats = model.get_stats()
        return stats
    except Exception as e:
        logger.error(f"Error getting high risk area stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/", response_model=Dict[str, Any])
async def create_high_risk_area_order(request: CreateOrderRequest):
    """
    Create a new high risk area order
    """
    try:
        model = get_high_risk_areas_model()
        
        # Check if order already exists
        existing_order = model.get_order_by_id(request.order_id)
        if existing_order:
            raise HTTPException(status_code=400, detail="Order with this ID already exists")
        
        # Validate risk rate
        if request.risk_rate < 0 or request.risk_rate > 100:
            raise HTTPException(status_code=400, detail="Risk rate must be between 0 and 100")
        
        # Create the order
        order_data = request.dict()
        model.create_order(order_data)
        
        # Return created order
        created_order = model.get_order_by_id(request.order_id)
        return created_order
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating high risk area order: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/{order_id}")
async def delete_high_risk_area_order(order_id: str):
    """
    Delete a high risk area order
    """
    try:
        model = get_high_risk_areas_model()
        
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
        logger.error(f"Error deleting high risk area order {order_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error") 