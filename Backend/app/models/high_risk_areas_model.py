from pymongo.database import Database
from bson import ObjectId
from datetime import datetime
from typing import List, Dict, Optional, Any
import logging

logger = logging.getLogger(__name__)

class HighRiskAreasModel:
    def __init__(self, database: Database):
        self.db = database
        self.collection = self.db.high_risk_areas

    def initialize_test_data(self):
        """Initialize test data for high risk areas"""
        try:
            # Clear existing data to refresh with new structure
            logger.info("Clearing existing high risk areas data to refresh with new structure")
            self.collection.delete_many({})

            # Test data for high risk areas matching the frontend structure
            test_orders = [
                {
                    "order_id": "ORD-1001",
                    "customer": "John Smith",
                    "area": "Downtown East",
                    "address": "123 Main St, Downtown East",
                    "risk_rate": 87,
                    "risk_factors": ["High return rate", "Multiple failed deliveries"],
                    "status": "new",
                    "date": datetime(2025, 5, 20),
                    "messages": [],
                    "expanded": False
                },
                {
                    "order_id": "ORD-1002",
                    "customer": "Sarah Johnson",
                    "area": "Riverside South",
                    "address": "456 River Rd, Riverside South",
                    "risk_rate": 92,
                    "risk_factors": ["Address inconsistencies", "Payment issues"],
                    "status": "high_risk",
                    "date": datetime(2025, 5, 19),
                    "messages": [
                        {
                            "id": "msg-1",
                            "text": "Order flagged for high risk in Riverside South area",
                            "sender": "system",
                            "timestamp": "2025-05-19 14:35"
                        }
                    ],
                    "expanded": False
                },
                {
                    "order_id": "ORD-1003",
                    "customer": "Michael Brown",
                    "area": "Westside Heights",
                    "address": "789 Hill Ave, Westside Heights",
                    "risk_rate": 78,
                    "risk_factors": ["Previous fraudulent activity"],
                    "status": "payment_requested",
                    "date": datetime(2025, 5, 18),
                    "messages": [
                        {
                            "id": "msg-2",
                            "text": "Advance payment requested due to high risk area",
                            "sender": "system",
                            "timestamp": "2025-05-18 11:22"
                        }
                    ],
                    "expanded": False
                },
                {
                    "order_id": "ORD-1004",
                    "customer": "Emily Davis",
                    "area": "North Harbor",
                    "address": "101 Harbor View, North Harbor",
                    "risk_rate": 95,
                    "risk_factors": ["High return rate", "Address verification failed", "Delivery issues"],
                    "status": "analyzing",
                    "date": datetime(2025, 5, 21),
                    "messages": [],
                    "expanded": False
                },
                {
                    "order_id": "ORD-1005",
                    "customer": "Robert Wilson",
                    "area": "Southside District",
                    "address": "202 South St, Southside District",
                    "risk_rate": 89,
                    "risk_factors": ["Multiple cancellations", "Payment discrepancies"],
                    "status": "review",
                    "date": datetime(2025, 5, 17),
                    "messages": [
                        {
                            "id": "msg-3",
                            "text": "Flagged for manual review - high risk area with payment issues",
                            "sender": "system",
                            "timestamp": "2025-05-17 09:45"
                        }
                    ],
                    "expanded": False
                }
            ]

            result = self.collection.insert_many(test_orders)
            logger.info(f"Inserted {len(result.inserted_ids)} test high risk area orders")

        except Exception as e:
            logger.error(f"Error initializing high risk areas test data: {str(e)}")
            raise

    def get_all_orders(self, status_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all high risk area orders, optionally filtered by status"""
        try:
            query = {}
            if status_filter and status_filter != "all":
                query["status"] = status_filter

            orders = list(self.collection.find(query).sort("date", -1))
            
            # Convert ObjectId to string and format dates
            for order in orders:
                order["_id"] = str(order["_id"])
                if "date" in order and isinstance(order["date"], datetime):
                    order["date"] = order["date"].strftime("%Y-%m-%d")
                order["id"] = order["order_id"]

            return orders

        except Exception as e:
            logger.error(f"Error getting high risk area orders: {str(e)}")
            raise

    def get_order_by_id(self, order_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific high risk area order by order_id"""
        try:
            order = self.collection.find_one({"order_id": order_id})
            if order:
                order["_id"] = str(order["_id"])
                if "date" in order and isinstance(order["date"], datetime):
                    order["date"] = order["date"].strftime("%Y-%m-%d")
                order["id"] = order["order_id"]
                
            return order

        except Exception as e:
            logger.error(f"Error getting high risk area order {order_id}: {str(e)}")
            raise

    def update_order_status(self, order_id: str, status: str, message_text: str = None) -> bool:
        """Update order status and optionally add a message"""
        try:
            update_data = {
                "status": status,
                "updated_at": datetime.utcnow()
            }

            # If message provided, add it to messages array
            if message_text:
                new_message = {
                    "id": f"msg-{int(datetime.utcnow().timestamp())}",
                    "text": message_text,
                    "sender": "system",
                    "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M")
                }
                update_data["$push"] = {"messages": new_message}
                result = self.collection.update_one(
                    {"order_id": order_id},
                    {"$set": {"status": status, "updated_at": datetime.utcnow()}, "$push": {"messages": new_message}}
                )
            else:
                result = self.collection.update_one(
                    {"order_id": order_id},
                    {"$set": update_data}
                )

            return result.modified_count > 0

        except Exception as e:
            logger.error(f"Error updating high risk area order {order_id}: {str(e)}")
            raise

    def add_message(self, order_id: str, message_text: str, sender: str = "user") -> bool:
        """Add a message to an order"""
        try:
            new_message = {
                "id": f"msg-{int(datetime.utcnow().timestamp())}",
                "text": message_text,
                "sender": sender,
                "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M")
            }

            result = self.collection.update_one(
                {"order_id": order_id},
                {"$push": {"messages": new_message}, "$set": {"updated_at": datetime.utcnow()}}
            )

            return result.modified_count > 0

        except Exception as e:
            logger.error(f"Error adding message to high risk area order {order_id}: {str(e)}")
            raise

    def get_stats(self) -> Dict[str, int]:
        """Get statistics for high risk areas"""
        try:
            pipeline = [
                {"$group": {
                    "_id": "$status",
                    "count": {"$sum": 1}
                }}
            ]
            
            status_counts = {item["_id"]: item["count"] for item in self.collection.aggregate(pipeline)}
            
            total_orders = sum(status_counts.values())
            
            return {
                "total": total_orders,
                "new": status_counts.get("new", 0),
                "analyzing": status_counts.get("analyzing", 0),
                "high_risk": status_counts.get("high_risk", 0),
                "payment_requested": status_counts.get("payment_requested", 0),
                "payment_received": status_counts.get("payment_received", 0),
                "processing": status_counts.get("processing", 0),
                "review": status_counts.get("review", 0),
                "completed": status_counts.get("completed", 0)
            }

        except Exception as e:
            logger.error(f"Error getting high risk areas stats: {str(e)}")
            raise

    def create_order(self, order_data: Dict[str, Any]) -> str:
        """Create a new high risk area order"""
        try:
            order_data["created_at"] = datetime.utcnow()
            order_data["updated_at"] = datetime.utcnow()
            order_data["date"] = datetime.utcnow()
            order_data["messages"] = order_data.get("messages", [])
            order_data["expanded"] = False
            
            result = self.collection.insert_one(order_data)
            return str(result.inserted_id)

        except Exception as e:
            logger.error(f"Error creating high risk area order: {str(e)}")
            raise

    def delete_order(self, order_id: str) -> bool:
        """Delete a high risk area order"""
        try:
            result = self.collection.delete_one({"order_id": order_id})
            return result.deleted_count > 0

        except Exception as e:
            logger.error(f"Error deleting high risk area order {order_id}: {str(e)}")
            raise 