from pymongo.database import Database
from bson import ObjectId
from datetime import datetime
from typing import List, Dict, Optional, Any
import logging

logger = logging.getLogger(__name__)

class FakeOrdersModel:
    def __init__(self, database: Database):
        self.db = database
        self.collection = self.db.fake_orders

    def initialize_test_data(self):
        """Initialize test data for fake order detection"""
        try:
            # Clear existing data to refresh with new structure
            logger.info("Clearing existing fake orders data to refresh with new structure")
            self.collection.delete_many({})

            # Test data for fake order detection matching the frontend structure
            test_orders = [
                {
                    "order_id": "ORD-2001",
                    "customer": "Alex Rodriguez",
                    "phone": "+1 (555) 111-2222",
                    "address": "123 Maple St, Chicago, IL",
                    "amount": 359.99,
                    "date": datetime(2023, 5, 21),
                    "status": "new",
                    "suspicious": False,
                    "flag_count": 0,
                    "order_history": ["First-time customer"],
                    "verification_required": False,
                    "messages": [
                        {
                            "id": "msg1",
                            "text": "New order received. Ready for verification.",
                            "sender": "system",
                            "timestamp": "2023-05-21 09:30 AM"
                        }
                    ],
                    "expanded": False
                },
                {
                    "order_id": "ORD-2002",
                    "customer": "Daniel Johnson",
                    "phone": "+1 (555) 333-4444",
                    "address": "456 Pine Ave, Chicago, IL",
                    "amount": 1299.99,
                    "date": datetime(2023, 5, 21),
                    "status": "checking",
                    "suspicious": True,
                    "flag_count": 1,
                    "order_history": ["Previous canceled order", "Address mismatch detected"],
                    "verification_required": True,
                    "messages": [
                        {
                            "id": "msg1",
                            "text": "New order received. Ready for verification.",
                            "sender": "system",
                            "timestamp": "2023-05-21 10:15 AM"
                        },
                        {
                            "id": "msg2",
                            "text": "Address doesn't match previous orders. Flagged for review.",
                            "sender": "system",
                            "timestamp": "2023-05-21 10:16 AM"
                        }
                    ],
                    "expanded": False
                },
                {
                    "order_id": "ORD-2003",
                    "customer": "Rebecca Smith",
                    "phone": "+1 (555) 555-6666",
                    "address": "789 Oak Blvd, Chicago, IL",
                    "amount": 499.99,
                    "date": datetime(2023, 5, 20),
                    "status": "requires_verification",
                    "suspicious": True,
                    "flag_count": 2,
                    "order_history": ["Multiple recent orders", "Payment method changes"],
                    "verification_required": True,
                    "messages": [
                        {
                            "id": "msg1",
                            "text": "New order received. Ready for verification.",
                            "sender": "system",
                            "timestamp": "2023-05-20 14:30 PM"
                        },
                        {
                            "id": "msg2",
                            "text": "Multiple recent orders from this customer with different payment methods.",
                            "sender": "system",
                            "timestamp": "2023-05-20 14:31 PM"
                        },
                        {
                            "id": "msg3",
                            "text": "Phone verification required.",
                            "sender": "system",
                            "timestamp": "2023-05-20 14:32 PM"
                        }
                    ],
                    "expanded": False
                },
                {
                    "order_id": "ORD-2004",
                    "customer": "Michael Wilson",
                    "phone": "+1 (555) 777-8888",
                    "address": "101 Cedar Dr, Chicago, IL",
                    "amount": 2150.00,
                    "date": datetime(2023, 5, 20),
                    "status": "partial_payment_requested",
                    "suspicious": True,
                    "flag_count": 3,
                    "order_history": ["Previous returns", "High-value orders"],
                    "verification_required": True,
                    "messages": [
                        {
                            "id": "msg1",
                            "text": "New order received. Ready for verification.",
                            "sender": "system",
                            "timestamp": "2023-05-20 11:30 AM"
                        },
                        {
                            "id": "msg2",
                            "text": "High-value order flagged for verification.",
                            "sender": "system",
                            "timestamp": "2023-05-20 11:32 AM"
                        },
                        {
                            "id": "msg3",
                            "text": "Phone verification completed successfully.",
                            "sender": "user",
                            "timestamp": "2023-05-20 13:15 PM"
                        },
                        {
                            "id": "msg4",
                            "text": "Requesting partial advance payment due to order value.",
                            "sender": "user",
                            "timestamp": "2023-05-20 13:20 PM"
                        }
                    ],
                    "expanded": False
                },
                {
                    "order_id": "ORD-2005",
                    "customer": "Jennifer Brown",
                    "phone": "+1 (555) 999-0000",
                    "address": "202 Birch Ln, Chicago, IL",
                    "amount": 799.99,
                    "date": datetime(2023, 5, 19),
                    "status": "flagged",
                    "suspicious": True,
                    "flag_count": 4,
                    "order_history": ["Multiple canceled orders", "Payment issues", "Address changes"],
                    "verification_required": True,
                    "messages": [
                        {
                            "id": "msg1",
                            "text": "New order received. Ready for verification.",
                            "sender": "system",
                            "timestamp": "2023-05-19 16:30 PM"
                        },
                        {
                            "id": "msg2",
                            "text": "Customer has multiple canceled orders in history.",
                            "sender": "system",
                            "timestamp": "2023-05-19 16:31 PM"
                        },
                        {
                            "id": "msg3",
                            "text": "Phone verification attempted - no answer.",
                            "sender": "user",
                            "timestamp": "2023-05-19 17:45 PM"
                        },
                        {
                            "id": "msg4",
                            "text": "Partial payment requested.",
                            "sender": "user",
                            "timestamp": "2023-05-20 10:15 AM"
                        },
                        {
                            "id": "msg5",
                            "text": "Customer has been flagged multiple times.",
                            "sender": "system",
                            "timestamp": "2023-05-20 10:16 AM"
                        }
                    ],
                    "expanded": False
                },
                {
                    "order_id": "ORD-2006",
                    "customer": "Christopher Davis",
                    "phone": "+1 (555) 123-9876",
                    "address": "303 Aspen Way, Chicago, IL",
                    "amount": 1599.99,
                    "date": datetime(2023, 5, 19),
                    "status": "blacklisted",
                    "suspicious": True,
                    "flag_count": 5,
                    "order_history": ["Fraudulent activity detected", "Chargebacks", "Multiple address changes"],
                    "verification_required": True,
                    "messages": [
                        {
                            "id": "msg1",
                            "text": "New order received. Ready for verification.",
                            "sender": "system",
                            "timestamp": "2023-05-19 09:30 AM"
                        },
                        {
                            "id": "msg2",
                            "text": "Customer has previous fraudulent activity.",
                            "sender": "system",
                            "timestamp": "2023-05-19 09:31 AM"
                        },
                        {
                            "id": "msg3",
                            "text": "Phone verification failed.",
                            "sender": "user",
                            "timestamp": "2023-05-19 10:45 AM"
                        },
                        {
                            "id": "msg4",
                            "text": "Customer has been blacklisted due to multiple fraud indicators.",
                            "sender": "system",
                            "timestamp": "2023-05-19 11:00 AM"
                        }
                    ],
                    "expanded": False
                }
            ]

            result = self.collection.insert_many(test_orders)
            logger.info(f"Inserted {len(result.inserted_ids)} test fake order detection records")

        except Exception as e:
            logger.error(f"Error initializing fake orders test data: {str(e)}")
            raise

    def get_all_orders(self, status_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all fake order detection records, optionally filtered by status"""
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
                
                # Convert snake_case to camelCase for frontend compatibility
                if "flag_count" in order:
                    order["flagCount"] = order["flag_count"]
                if "order_history" in order:
                    order["orderHistory"] = order["order_history"]
                if "verification_required" in order:
                    order["verificationRequired"] = order["verification_required"]

            return orders

        except Exception as e:
            logger.error(f"Error getting fake order detection records: {str(e)}")
            raise

    def get_order_by_id(self, order_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific fake order detection record by order_id"""
        try:
            order = self.collection.find_one({"order_id": order_id})
            if order:
                order["_id"] = str(order["_id"])
                if "date" in order and isinstance(order["date"], datetime):
                    order["date"] = order["date"].strftime("%Y-%m-%d")
                order["id"] = order["order_id"]
                
                # Convert snake_case to camelCase for frontend compatibility
                if "flag_count" in order:
                    order["flagCount"] = order["flag_count"]
                if "order_history" in order:
                    order["orderHistory"] = order["order_history"]
                if "verification_required" in order:
                    order["verificationRequired"] = order["verification_required"]
                
            return order

        except Exception as e:
            logger.error(f"Error getting fake order detection record {order_id}: {str(e)}")
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
            logger.error(f"Error updating fake order detection record {order_id}: {str(e)}")
            raise

    def update_order_flag_count(self, order_id: str, flag_count: int, suspicious: bool = True) -> bool:
        """Update order flag count and suspicious status"""
        try:
            update_data = {
                "flag_count": flag_count,
                "suspicious": suspicious,
                "updated_at": datetime.utcnow()
            }

            result = self.collection.update_one(
                {"order_id": order_id},
                {"$set": update_data}
            )

            return result.modified_count > 0

        except Exception as e:
            logger.error(f"Error updating flag count for fake order detection record {order_id}: {str(e)}")
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
            logger.error(f"Error adding message to fake order detection record {order_id}: {str(e)}")
            raise

    def get_stats(self) -> Dict[str, int]:
        """Get statistics for fake order detection"""
        try:
            pipeline = [
                {"$group": {
                    "_id": "$status",
                    "count": {"$sum": 1}
                }}
            ]
            
            status_counts = {item["_id"]: item["count"] for item in self.collection.aggregate(pipeline)}
            
            total_orders = sum(status_counts.values())
            suspicious_count = len(list(self.collection.find({"suspicious": True})))
            
            return {
                "total": total_orders,
                "new": status_counts.get("new", 0),
                "checking": status_counts.get("checking", 0),
                "requires_verification": status_counts.get("requires_verification", 0),
                "partial_payment_requested": status_counts.get("partial_payment_requested", 0),
                "flagged": status_counts.get("flagged", 0),
                "blacklisted": status_counts.get("blacklisted", 0),
                "processing": status_counts.get("processing", 0),
                "completed": status_counts.get("completed", 0),
                "canceled": status_counts.get("canceled", 0),
                "suspicious": suspicious_count
            }

        except Exception as e:
            logger.error(f"Error getting fake order detection stats: {str(e)}")
            raise

    def create_order(self, order_data: Dict[str, Any]) -> str:
        """Create a new fake order detection record"""
        try:
            order_data["created_at"] = datetime.utcnow()
            order_data["updated_at"] = datetime.utcnow()
            order_data["date"] = datetime.utcnow()
            order_data["messages"] = order_data.get("messages", [])
            order_data["expanded"] = False
            
            result = self.collection.insert_one(order_data)
            return str(result.inserted_id)

        except Exception as e:
            logger.error(f"Error creating fake order detection record: {str(e)}")
            raise

    def delete_order(self, order_id: str) -> bool:
        """Delete a fake order detection record"""
        try:
            result = self.collection.delete_one({"order_id": order_id})
            return result.deleted_count > 0

        except Exception as e:
            logger.error(f"Error deleting fake order detection record {order_id}: {str(e)}")
            raise 