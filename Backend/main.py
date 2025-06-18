import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.db.mongodb import mongodb
from app.models.order_model import OrderModel
from app.models.delivery_model import DeliveryModel
from app.models.high_risk_areas_model import HighRiskAreasModel
from app.models.fake_orders_model import FakeOrdersModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="CoD App API",
    description="Cash on Delivery Application API",
    version="1.0.0"
)

# CORS configuration - Fix for preflight requests
app.add_middleware(
    CORSMiddleware,
    
    allow_origins=["*"],  # Replace "*" with your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.on_event("startup")
def startup_event():
    """Initialize database connection and test data"""
    try:
        # Connect to MongoDB
        mongodb.connect_to_mongodb()
        logger.info("Connected to MongoDB")
        
        # Initialize test data for orders
        order_model = OrderModel(mongodb.get_database())
        order_model.initialize_test_data()
        logger.info("Order test data initialized")
        
        # Initialize test data for deliveries
        delivery_model = DeliveryModel(mongodb.get_database())
        delivery_model.initialize_test_data()
        logger.info("Delivery test data initialized")
        
        # Initialize test data for high risk areas
        high_risk_areas_model = HighRiskAreasModel(mongodb.get_database())
        high_risk_areas_model.initialize_test_data()
        logger.info("High risk areas test data initialized")
        
        # Initialize test data for fake orders
        fake_orders_model = FakeOrdersModel(mongodb.get_database())
        fake_orders_model.initialize_test_data()
        logger.info("Fake orders test data initialized")
        
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")
        raise

@app.on_event("shutdown")
def shutdown_event():
    """Close database connection"""
    try:
        mongodb.close_mongodb_connection()
        logger.info("Disconnected from MongoDB")
    except Exception as e:
        logger.error(f"Error during shutdown: {str(e)}")

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "CoD App API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True) 