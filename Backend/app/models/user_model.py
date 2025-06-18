from datetime import datetime, UTC
from typing import Optional, Dict, Any
from bson import ObjectId
import logging
from pymongo.database import Database
from pymongo import ASCENDING

logger = logging.getLogger(__name__)

class UserModel:
    def __init__(self, db: Database):
        self.collection = db["users"]
        self._ensure_indexes()

    def _ensure_indexes(self):
        """Ensure all required indexes exist."""
        try:
            # Create unique index on email
            self.collection.create_index([("email", ASCENDING)], unique=True)
            logger.info("Created unique index on email field")
            
            # List all indexes
            indexes = self.collection.list_indexes()
            logger.info("Collection indexes:")
            for index in indexes:
                logger.info(f"Index: {index['name']}, Fields: {index['key']}")
        except Exception as e:
            logger.error(f"Failed to create indexes: {str(e)}")
            raise

    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            # Add timestamps
            user_data["created_at"] = datetime.now(UTC)
            user_data["updated_at"] = datetime.now(UTC)
            
            # Insert user
            result = self.collection.insert_one(user_data)
            user_data["_id"] = result.inserted_id
            logger.info(f"Created user with email: {user_data['email']}")
            return user_data
        except Exception as e:
            logger.error(f"Failed to create user: {str(e)}")
            raise

    def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        try:
            user = self.collection.find_one({"email": email})
            if user:
                logger.info(f"Found user with email: {email}")
            else:
                logger.info(f"No user found with email: {email}")
            return user
        except Exception as e:
            logger.error(f"Failed to get user by email: {str(e)}")
            return None

    def get_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        try:
            user = self.collection.find_one({"_id": ObjectId(user_id)})
            if user:
                logger.info(f"Found user with ID: {user_id}")
            else:
                logger.info(f"No user found with ID: {user_id}")
            return user
        except Exception as e:
            logger.error(f"Failed to get user by ID: {str(e)}")
            return None

    def update_user(self, user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        try:
            update_data["updated_at"] = datetime.now(UTC)
            result = self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            if result.modified_count:
                logger.info(f"Updated user with ID: {user_id}")
                return self.get_by_id(user_id)
            logger.info(f"No changes made to user with ID: {user_id}")
            return None
        except Exception as e:
            logger.error(f"Failed to update user: {str(e)}")
            return None

    def delete(self, user_id: str) -> bool:
        try:
            result = self.collection.delete_one({"_id": ObjectId(user_id)})
            if result.deleted_count:
                logger.info(f"Deleted user with ID: {user_id}")
            else:
                logger.info(f"No user found to delete with ID: {user_id}")
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Failed to delete user: {str(e)}")
            return False

    def list_users(self, skip: int = 0, limit: int = 100) -> list:
        try:
            cursor = self.collection.find().skip(skip).limit(limit)
            users = list(cursor)
            logger.info(f"Retrieved {len(users)} users")
            return users
        except Exception as e:
            logger.error(f"Failed to list users: {str(e)}")
            return []

    def initialize_test_data(self) -> None:
        """Initialize the database with test users."""
        test_users = [
            {
                "email": "admin@codverify.com",
                "password": "admin123",  # In a real app, this should be hashed
                "name": "Admin User",
                "role": "admin"
            },
            {
                "email": "user@codverify.com",
                "password": "user123",  # In a real app, this should be hashed
                "name": "Test User",
                "role": "user"
            }
        ]
        
        for user_data in test_users:
            existing_user = self.get_by_email(user_data["email"])
            if not existing_user:
                try:
                    self.create_user(user_data)
                    logger.info(f"Created test user: {user_data['email']}")
                except Exception as e:
                    logger.error(f"Failed to create test user {user_data['email']}: {str(e)}")
            else:
                logger.info(f"Test user already exists: {user_data['email']}")
        
        # Log all users in the database
        all_users = self.list_users()
        logger.info(f"Total users in database: {len(all_users)}")
        for user in all_users:
            logger.info(f"User: {user['email']} (Role: {user['role']})") 