from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from app.db.mongodb import mongodb
from app.models.delivery_model import DeliveryModel
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

def get_delivery_model() -> DeliveryModel:
    """Get delivery model instance"""
    return DeliveryModel(mongodb.get_database())

@router.get("/", response_model=List[Dict[str, Any]])
async def get_deliveries(
    courier: Optional[str] = Query(None, description="Filter by courier: postex, leopard, all")
):
    """
    Get all deliveries, optionally filtered by courier
    """
    try:
        delivery_model = get_delivery_model()
        deliveries = delivery_model.get_all_deliveries(courier_filter=courier)
        return deliveries

    except Exception as e:
        logger.error(f"Error getting deliveries: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/stats/couriers")
async def get_courier_stats():
    """
    Get statistics for each courier service
    """
    try:
        delivery_model = get_delivery_model()
        stats = delivery_model.get_courier_stats()
        return stats

    except Exception as e:
        logger.error(f"Error getting courier stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/stats/cities")
async def get_city_stats():
    """
    Get city-wise courier performance statistics
    """
    try:
        delivery_model = get_delivery_model()
        city_stats = delivery_model.get_city_stats()
        return city_stats

    except Exception as e:
        logger.error(f"Error getting city stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/stats/summary")
async def get_delivery_summary():
    """
    Get overall delivery summary and counts
    """
    try:
        delivery_model = get_delivery_model()
        counts = delivery_model.get_delivery_counts()
        courier_stats = delivery_model.get_courier_stats()
        
        summary = {
            "total_orders": counts["total"],
            "postex_orders": counts["postex"],
            "leopard_orders": counts["leopard"],
            "courier_performance": courier_stats
        }
        
        return summary

    except Exception as e:
        logger.error(f"Error getting delivery summary: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{delivery_id}")
async def get_delivery(delivery_id: str):
    """
    Get a specific delivery by tracking ID
    """
    try:
        delivery_model = get_delivery_model()
        delivery = delivery_model.get_delivery_by_id(delivery_id)
        
        if not delivery:
            raise HTTPException(status_code=404, detail="Delivery not found")
        
        return delivery

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting delivery {delivery_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error") 