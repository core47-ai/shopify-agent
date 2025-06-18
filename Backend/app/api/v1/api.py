from fastapi import APIRouter
from app.api.v1.endpoints import auth, orders, unresponsive_customers, deliveries, high_risk_areas, fake_orders

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(unresponsive_customers.router, prefix="/unresponsive-customers", tags=["unresponsive-customers"])
api_router.include_router(deliveries.router, prefix="/deliveries", tags=["deliveries"])
api_router.include_router(high_risk_areas.router, prefix="/high-risk-areas", tags=["high-risk-areas"])
api_router.include_router(fake_orders.router, prefix="/fake-orders", tags=["fake-orders"]) 