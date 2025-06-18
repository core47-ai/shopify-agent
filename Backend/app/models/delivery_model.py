from pymongo.database import Database
from bson import ObjectId
from datetime import datetime
from typing import List, Dict, Optional, Any
import logging

logger = logging.getLogger(__name__)

class DeliveryModel:
    def __init__(self, database: Database):
        self.db = database
        self.collection = self.db.deliveries

    def initialize_test_data(self):
        """Initialize test data for courier deliveries"""
        try:
            # Clear existing data to refresh with new structure
            logger.info("Clearing existing deliveries data to refresh with new structure")
            self.collection.delete_many({})

            # Test data with courier delivery information
            test_deliveries = [
                {
                    "customer_name": "Huzaifa Paracha",
                    "customer_phone": "3361919915",
                    "customer_address": "House no 1-5 parachnar street kohat -25000-",
                    "tracking": "293350800016940",
                    "merchant": "Elyscents Pakistan",
                    "order_status": "Unbooked",
                    "no_of_items": 2,
                    "courier": "postex",
                    "created_date": datetime(2025, 5, 20, 10, 30),
                    "city": "Kohat",
                    "order_value": 2500
                },
                {
                    "customer_name": "Safeer Ahmad",
                    "customer_phone": "3037211788",
                    "customer_address": "Saffari garden back side model city. New Ghalla mandi bye pass",
                    "tracking": "243350800016941",
                    "merchant": "Elyscents Pakistan",
                    "order_status": "dispatched",
                    "no_of_items": 1,
                    "courier": "postex",
                    "created_date": datetime(2025, 5, 20, 11, 15),
                    "city": "Lahore",
                    "order_value": 1800
                },
                {
                    "customer_name": "Hazratumar Khan",
                    "customer_phone": "3080807397",
                    "customer_address": "house no 445 street 13 Ali block phase 8 bahria town Rawalpindi",
                    "tracking": "233350800016942",
                    "merchant": "Elyscents Pakistan",
                    "order_status": "On Route to Customer",
                    "no_of_items": 2,
                    "courier": "postex",
                    "created_date": datetime(2025, 5, 20, 9, 20),
                    "city": "Rawalpindi",
                    "order_value": 3200
                },
                {
                    "customer_name": "Rizwan Rizwan",
                    "customer_phone": "3069546721",
                    "customer_address": "DHA phase 4 block number bb street number 77",
                    "tracking": "273350800016943",
                    "merchant": "Elyscents Pakistan",
                    "order_status": "Delivered",
                    "no_of_items": 1,
                    "courier": "postex",
                    "created_date": datetime(2025, 5, 19, 8, 45),
                    "city": "Karachi",
                    "order_value": 1500
                },
                {
                    "customer_name": "Muhammad Naeem Rajput",
                    "customer_phone": "3463824477",
                    "customer_address": "House No 88 Nawab Colony Tando Allahyar -70010-",
                    "tracking": "243350800016944",
                    "merchant": "Elyscents Pakistan",
                    "order_status": "Returned",
                    "no_of_items": 1,
                    "courier": "postex",
                    "created_date": datetime(2025, 5, 18, 12, 5),
                    "city": "Tando Allahyar",
                    "order_value": 2200
                },
                {
                    "customer_name": "Munir Khan",
                    "customer_phone": "3083611136",
                    "customer_address": "House No 8-17/9 , Lane Khan Tama Khan, Balochi Street",
                    "tracking": "253350800016945",
                    "merchant": "Elyscents Pakistan",
                    "order_status": "On Route to the Warehouse",
                    "no_of_items": 1,
                    "courier": "postex",
                    "created_date": datetime(2025, 5, 19, 14, 30),
                    "city": "Quetta",
                    "order_value": 1900
                },
                {
                    "customer_name": "Muhammad Junaid",
                    "customer_phone": "3417741891",
                    "customer_address": "Meshkar Attar Perfume Gurunanakpura Road Near Badr Bakery",
                    "tracking": "203350800016946",
                    "merchant": "Elyscents Pakistan",
                    "order_status": "On Route to be Returned",
                    "no_of_items": 1,
                    "courier": "postex",
                    "created_date": datetime(2025, 5, 19, 16, 20),
                    "city": "Faisalabad",
                    "order_value": 1600
                },
                # Leopard deliveries
                {
                    "customer_name": "Ali Hassan",
                    "customer_phone": "3001234567",
                    "customer_address": "Block 15, Gulshan-e-Iqbal, Karachi",
                    "tracking": "LEO293350800016947",
                    "merchant": "Elyscents Pakistan",
                    "order_status": "Delivered",
                    "no_of_items": 3,
                    "courier": "leopard",
                    "created_date": datetime(2025, 5, 20, 10, 00),
                    "city": "Karachi",
                    "order_value": 4500
                },
                {
                    "customer_name": "Sara Ahmed",
                    "customer_phone": "3112345678",
                    "customer_address": "DHA Phase 5, Lahore",
                    "tracking": "LEO243350800016948",
                    "merchant": "Elyscents Pakistan",
                    "order_status": "dispatched",
                    "no_of_items": 1,
                    "courier": "leopard",
                    "created_date": datetime(2025, 5, 21, 9, 30),
                    "city": "Lahore",
                    "order_value": 2800
                },
                {
                    "customer_name": "Fahad Khan",
                    "customer_phone": "3213456789",
                    "customer_address": "F-7 Sector, Islamabad",
                    "tracking": "LEO233350800016949",
                    "merchant": "Elyscents Pakistan",
                    "order_status": "On Route to Customer",
                    "no_of_items": 2,
                    "courier": "leopard",
                    "created_date": datetime(2025, 5, 21, 11, 45),
                    "city": "Islamabad",
                    "order_value": 5200
                },
                {
                    "customer_name": "Ayesha Malik",
                    "customer_phone": "3324567890",
                    "customer_address": "Clifton Block 2, Karachi",
                    "tracking": "LEO273350800016950",
                    "merchant": "Elyscents Pakistan",
                    "order_status": "Unbooked",
                    "no_of_items": 4,
                    "courier": "leopard",
                    "created_date": datetime(2025, 5, 22, 8, 15),
                    "city": "Karachi",
                    "order_value": 7600
                },
                {
                    "customer_name": "Usman Ali",
                    "customer_phone": "3435678901",
                    "customer_address": "Model Town, Lahore",
                    "tracking": "LEO243350800016951",
                    "merchant": "Elyscents Pakistan",
                    "order_status": "Delivered",
                    "no_of_items": 1,
                    "courier": "leopard",
                    "created_date": datetime(2025, 5, 22, 14, 20),
                    "city": "Lahore",
                    "order_value": 1200
                },
                {
                    "customer_name": "Zara Sheikh",
                    "customer_phone": "3546789012",
                    "customer_address": "Bahria Town Phase 4, Rawalpindi",
                    "tracking": "LEO253350800016952",
                    "merchant": "Elyscents Pakistan",
                    "order_status": "Returned",
                    "no_of_items": 2,
                    "courier": "leopard",
                    "created_date": datetime(2025, 5, 21, 13, 10),
                    "city": "Rawalpindi",
                    "order_value": 3400
                },
                {
                    "customer_name": "Ahmed Raza",
                    "customer_phone": "3657890123",
                    "customer_address": "Satellite Town, Faisalabad",
                    "tracking": "LEO203350800016953",
                    "merchant": "Elyscents Pakistan",
                    "order_status": "On Route to the Warehouse",
                    "no_of_items": 1,
                    "courier": "leopard",
                    "created_date": datetime(2025, 5, 20, 15, 40),
                    "city": "Faisalabad",
                    "order_value": 2900
                }
            ]

            result = self.collection.insert_many(test_deliveries)
            logger.info(f"Inserted {len(result.inserted_ids)} test deliveries")

        except Exception as e:
            logger.error(f"Error initializing test data: {str(e)}")
            raise

    def get_all_deliveries(self, courier_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all deliveries, optionally filtered by courier"""
        try:
            query = {}
            if courier_filter and courier_filter != "all":
                query["courier"] = courier_filter

            deliveries = list(self.collection.find(query).sort("created_date", -1))
            
            # Convert ObjectId to string and format data for frontend
            for delivery in deliveries:
                delivery["_id"] = str(delivery["_id"])
                delivery["id"] = delivery["tracking"]
                delivery["customer"] = delivery["customer_name"]
                delivery["phone"] = delivery["customer_phone"]
                delivery["address"] = delivery["customer_address"]
                delivery["items"] = delivery["no_of_items"]
                delivery["value"] = f"Rs. {delivery['order_value']:,}"
                delivery["date"] = delivery["created_date"].strftime("%Y-%m-%d")
                delivery["status"] = delivery["order_status"].lower().replace(" ", "_")
                delivery["assignedCourier"] = delivery["courier"]

            return deliveries

        except Exception as e:
            logger.error(f"Error getting deliveries: {str(e)}")
            raise

    def get_delivery_by_id(self, delivery_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific delivery by tracking ID"""
        try:
            delivery = self.collection.find_one({"tracking": delivery_id})
            if delivery:
                delivery["_id"] = str(delivery["_id"])
                delivery["id"] = delivery["tracking"]
                delivery["customer"] = delivery["customer_name"]
                delivery["phone"] = delivery["customer_phone"]
                delivery["address"] = delivery["customer_address"]
                delivery["items"] = delivery["no_of_items"]
                delivery["value"] = f"Rs. {delivery['order_value']:,}"
                delivery["date"] = delivery["created_date"].strftime("%Y-%m-%d")
                delivery["status"] = delivery["order_status"].lower().replace(" ", "_")
                delivery["assignedCourier"] = delivery["courier"]
            
            return delivery

        except Exception as e:
            logger.error(f"Error getting delivery {delivery_id}: {str(e)}")
            raise

    def get_courier_stats(self) -> Dict[str, Any]:
        """Get statistics by courier"""
        try:
            pipeline = [
                {
                    "$group": {
                        "_id": "$courier",
                        "total_orders": {"$sum": 1},
                        "delivered": {
                            "$sum": {
                                "$cond": [{"$eq": ["$order_status", "Delivered"]}, 1, 0]
                            }
                        },
                        "avg_value": {"$avg": "$order_value"}
                    }
                }
            ]
            
            result = list(self.collection.aggregate(pipeline))
            stats = {}
            
            for item in result:
                courier = item["_id"]
                success_rate = (item["delivered"] / item["total_orders"]) * 100 if item["total_orders"] > 0 else 0
                stats[courier] = {
                    "courier": courier.capitalize(),
                    "successRate": round(success_rate, 1),
                    "totalOrders": item["total_orders"],
                    "avgValue": round(item["avg_value"], 0)
                }
            
            return stats

        except Exception as e:
            logger.error(f"Error getting courier stats: {str(e)}")
            return {}

    def get_city_stats(self) -> List[Dict[str, Any]]:
        """Get city-wise courier performance"""
        try:
            pipeline = [
                {
                    "$group": {
                        "_id": {
                            "city": "$city",
                            "courier": "$courier"
                        },
                        "total_orders": {"$sum": 1},
                        "delivered": {
                            "$sum": {
                                "$cond": [{"$eq": ["$order_status", "Delivered"]}, 1, 0]
                            }
                        }
                    }
                },
                {
                    "$group": {
                        "_id": "$_id.city",
                        "courier_stats": {
                            "$push": {
                                "courier": "$_id.courier",
                                "success_rate": {
                                    "$multiply": [
                                        {"$divide": ["$delivered", "$total_orders"]},
                                        100
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
            
            result = list(self.collection.aggregate(pipeline))
            city_stats = []
            
            for city_data in result:
                city = city_data["_id"]
                postex_rate = 0
                leopard_rate = 0
                
                for courier_stat in city_data["courier_stats"]:
                    if courier_stat["courier"] == "postex":
                        postex_rate = round(courier_stat["success_rate"], 1)
                    elif courier_stat["courier"] == "leopard":
                        leopard_rate = round(courier_stat["success_rate"], 1)
                
                city_stats.append({
                    "city": city,
                    "postexRate": postex_rate,
                    "leopardRate": leopard_rate
                })
            
            return city_stats

        except Exception as e:
            logger.error(f"Error getting city stats: {str(e)}")
            return []

    def get_delivery_counts(self) -> Dict[str, int]:
        """Get total delivery counts"""
        try:
            total_count = self.collection.count_documents({})
            postex_count = self.collection.count_documents({"courier": "postex"})
            leopard_count = self.collection.count_documents({"courier": "leopard"})
            
            return {
                "total": total_count,
                "postex": postex_count,
                "leopard": leopard_count
            }

        except Exception as e:
            logger.error(f"Error getting delivery counts: {str(e)}")
            return {"total": 0, "postex": 0, "leopard": 0} 