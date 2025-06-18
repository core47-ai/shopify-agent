from pymongo.database import Database
from bson import ObjectId
from datetime import datetime
from typing import List, Dict, Optional, Any
import logging

logger = logging.getLogger(__name__)

class OrderModel:
    def __init__(self, database: Database):
        self.db = database
        self.collection = self.db.orders

    def initialize_test_data(self):
        """Initialize test data for order confirmations"""
        try:
            # Clear existing data to refresh with new structure
            logger.info("Clearing existing orders data to refresh with new structure")
            self.collection.delete_many({})

            # Test data with order confirmation information matching the database structure
            test_orders = [
                {
                    "order_id": "ORD-615929564372",
                    "tracking_id": "TRK-9876543210",
                    "assigned_courier": "postex",
                    "customer_name": "Ahmed Khan",
                    "customer_address": "A316 Behind Rab medical center, Block 2 Gulshan-e-Iqbal, Karachi Pakistan",
                    "customer_email": "ahmed.khan@gmail.com",
                    "customer_phone": "+92300123456",
                    "total_price": 1999,
                    "status": "confirmed",
                    "created_date": datetime(2025, 5, 20, 10, 30),
                    "confirmation_history": [
                        {
                            "type": "WhatsApp Message",
                            "content": "Hello Ahmed, please confirm your order #ORD-615929564372 by replying YES.",
                            "timestamp": datetime(2025, 5, 20, 10, 30),
                            "status": "sent"
                        },
                        {
                            "type": "Response",
                            "content": "YES",
                            "timestamp": datetime(2025, 5, 20, 10, 45),
                            "status": "responded"
                        },
                        {
                            "type": "Tag",
                            "content": "Confirmed",
                            "timestamp": datetime(2025, 5, 20, 10, 46),
                        }
                    ]
                },
                {
                    "order_id": "ORD-615929564373",
                    "tracking_id": "TRK-8765432109",
                    "assigned_courier": "leopard",
                    "customer_name": "Fatima Ali",
                    "customer_address": "House 45, Street 12, DHA Phase 2, Lahore Pakistan",
                    "customer_email": "fatima.ali@gmail.com",
                    "customer_phone": "+92300234567",
                    "total_price": 2500,
                    "status": "pending",
                    "created_date": datetime(2025, 5, 20, 11, 15),
                    "confirmation_history": [
                        {
                            "type": "WhatsApp Message",
                            "content": "Hello Fatima, please confirm your order #ORD-615929564373 by replying YES.",
                            "timestamp": datetime(2025, 5, 20, 11, 15),
                            "status": "delivered"
                        }
                    ]
                },
                {
                    "order_id": "ORD-615929564374",
                    "tracking_id": "TRK-7654321098",
                    "assigned_courier": "postex",
                    "customer_name": "Mohammad Rashid",
                    "customer_address": "Flat 201, Building 5, Clifton Block 8, Karachi Pakistan",
                    "customer_email": "mohammad.rashid@gmail.com",
                    "customer_phone": "+92300345678",
                    "total_price": 1750,
                    "status": "unconfirmed",
                    "created_date": datetime(2025, 5, 20, 9, 20),
                    "confirmation_history": [
                        {
                            "type": "WhatsApp Message",
                            "content": "Hello Mohammad, please confirm your order #ORD-615929564374 by replying YES.",
                            "timestamp": datetime(2025, 5, 20, 9, 20),
                            "status": "read"
                        },
                        {
                            "type": "Response",
                            "content": "NO",
                            "timestamp": datetime(2025, 5, 20, 9, 30),
                            "status": "responded"
                        },
                        {
                            "type": "Tag",
                            "content": "Unconfirmed",
                            "timestamp": datetime(2025, 5, 20, 9, 31),
                        }
                    ]
                },
                {
                    "order_id": "ORD-615929564375",
                    "tracking_id": "TRK-6543210987",
                    "assigned_courier": "leopard",
                    "customer_name": "Ayesha Malik",
                    "customer_address": "Villa 12, Sector F-7, Islamabad Pakistan",
                    "customer_email": "ayesha.malik@gmail.com",
                    "customer_phone": "+92300456789",
                    "total_price": 3200,
                    "status": "confirmed",
                    "created_date": datetime(2025, 5, 20, 8, 45),
                    "confirmation_history": [
                        {
                            "type": "WhatsApp Message",
                            "content": "Hello Ayesha, please confirm your order #ORD-615929564375 by replying YES.",
                            "timestamp": datetime(2025, 5, 20, 8, 45),
                            "status": "sent"
                        },
                        {
                            "type": "Response",
                            "content": "YES, please deliver after 6pm",
                            "timestamp": datetime(2025, 5, 20, 9, 0),
                            "status": "responded"
                        },
                        {
                            "type": "Tag",
                            "content": "Confirmed",
                            "timestamp": datetime(2025, 5, 20, 9, 1),
                        }
                    ]
                },
                {
                    "order_id": "ORD-615929564376",
                    "tracking_id": "TRK-5432109876",
                    "assigned_courier": "postex",
                    "customer_name": "Hassan Ahmed",
                    "customer_address": "House 88, Block C, Johar Town, Lahore Pakistan",
                    "customer_email": "hassan.ahmed@gmail.com",
                    "customer_phone": "+92300567890",
                    "total_price": 1850,
                    "status": "pending",
                    "created_date": datetime(2025, 5, 20, 12, 5),
                    "confirmation_history": [
                        {
                            "type": "WhatsApp Message",
                            "content": "Hello Hassan, please confirm your order #ORD-615929564376 by replying YES.",
                            "timestamp": datetime(2025, 5, 20, 12, 5),
                            "status": "sent"
                        }
                    ]
                }
            ]

            result = self.collection.insert_many(test_orders)
            logger.info(f"Inserted {len(result.inserted_ids)} test orders")

        except Exception as e:
            logger.error(f"Error initializing test data: {str(e)}")
            raise

    def get_all_orders(self, status_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all orders, optionally filtered by status"""
        try:
            query = {}
            if status_filter and status_filter != "all":
                query["status"] = status_filter

            orders = list(self.collection.find(query).sort("created_date", -1))
            
            # Convert ObjectId to string and format dates
            for order in orders:
                order["_id"] = str(order["_id"])
                order["date"] = order["created_date"].strftime("%Y-%m-%d")
                order["customer"] = order["customer_name"]
                order["id"] = order["order_id"]
                order["tracking"] = order.get("tracking_id", "")
                
                # Format confirmation history timestamps
                if "confirmation_history" in order:
                    for entry in order["confirmation_history"]:
                        if "timestamp" in entry:
                            entry["timestamp"] = entry["timestamp"].strftime("%I:%M %p")
                
                # Add children field for frontend compatibility
                order["children"] = order.get("confirmation_history", [])

            return orders

        except Exception as e:
            logger.error(f"Error getting orders: {str(e)}")
            raise

    def get_order_by_id(self, order_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific order by order_id"""
        try:
            order = self.collection.find_one({"order_id": order_id})
            if order:
                order["_id"] = str(order["_id"])
                order["date"] = order["created_date"].strftime("%Y-%m-%d")
                order["customer"] = order["customer_name"]
                order["id"] = order["order_id"]
                order["tracking"] = order.get("tracking_id", "")
                
                # Format confirmation history timestamps
                if "confirmation_history" in order:
                    for entry in order["confirmation_history"]:
                        if "timestamp" in entry:
                            entry["timestamp"] = entry["timestamp"].strftime("%I:%M %p")
                
                order["children"] = order.get("confirmation_history", [])
            
            return order

        except Exception as e:
            logger.error(f"Error getting order {order_id}: {str(e)}")
            raise

    def update_order_status(self, order_id: str, status: str, response_content: str = None) -> bool:
        """Update order status and add response to confirmation history"""
        try:
            update_data = {"status": status}
            
            # Add response to confirmation history if provided
            if response_content:
                response_entry = {
                    "type": "Response",
                    "content": response_content,
                    "timestamp": datetime.now(),
                    "status": "responded"
                }
                
                tag_entry = {
                    "type": "Tag",
                    "content": status.capitalize(),
                    "timestamp": datetime.now(),
                }
                
                self.collection.update_one(
                    {"order_id": order_id},
                    {
                        "$set": update_data,
                        "$push": {
                            "confirmation_history": {
                                "$each": [response_entry, tag_entry]
                            }
                        }
                    }
                )
            else:
                self.collection.update_one(
                    {"order_id": order_id},
                    {"$set": update_data}
                )
            
            return True

        except Exception as e:
            logger.error(f"Error updating order {order_id}: {str(e)}")
            return False

    def get_order_stats(self) -> Dict[str, int]:
        """Get order statistics by status"""
        try:
            pipeline = [
                {
                    "$group": {
                        "_id": "$status",
                        "count": {"$sum": 1}
                    }
                }
            ]
            
            result = list(self.collection.aggregate(pipeline))
            stats = {"confirmed": 0, "pending": 0, "unconfirmed": 0, "total": 0}
            
            for item in result:
                stats[item["_id"]] = item["count"]
                stats["total"] += item["count"]
            
            return stats

        except Exception as e:
            logger.error(f"Error getting order stats: {str(e)}")
            return {"confirmed": 0, "pending": 0, "unconfirmed": 0, "total": 0} 