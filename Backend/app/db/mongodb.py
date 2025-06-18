from pymongo import MongoClient
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MongoDB:
    client: MongoClient = None
    db = None

    def connect_to_mongodb(self):
        try:
            # Get MongoDB configuration from environment variables with defaults
            mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
            mongodb_db_name = os.getenv("MONGODB_DB_NAME", "cod_app")
            
            # Ensure the connection string is properly formatted
            connection_string = mongodb_url.strip()
            if not connection_string:
                connection_string = "mongodb://localhost:27017"
                
            logger.info(f"Connecting to MongoDB at {connection_string}")
            self.client = MongoClient(connection_string)
            
            # Verify the connection
            self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB server")
            
            # Get database
            self.db = self.client[mongodb_db_name]
            logger.info(f"Using database: {mongodb_db_name}")
            
            # Create collections if they don't exist
            self._ensure_collections()
            
            return True
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {str(e)}")
            # For development, we'll continue without MongoDB for now
            logger.warning("Continuing without MongoDB connection for development")
            return False

    def _ensure_collections(self):
        """Ensure all required collections exist."""
        if not self.db:
            return
            
        required_collections = ["users", "orders", "deliveries"]
        
        for collection_name in required_collections:
            if collection_name not in self.db.list_collection_names():
                self.db.create_collection(collection_name)
                logger.info(f"Created collection: {collection_name}")
        
        # List all collections after ensuring they exist
        collections = self.db.list_collection_names()
        logger.info(f"Available collections: {collections}")
        
        # Log collection stats
        for collection_name in collections:
            count = self.db[collection_name].count_documents({})
            logger.info(f"Collection '{collection_name}' has {count} documents")

    def close_mongodb_connection(self):
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed.")

    def get_database(self):
        if self.db is None:
            # For development, create an in-memory mock database
            logger.warning("Database not initialized. Using mock database for development.")
            from pymongo import MongoClient
            self.client = MongoClient("mongodb://localhost:27017")
            self.db = self.client["cod_app_dev"]
        return self.db

mongodb = MongoDB() 