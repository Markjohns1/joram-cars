"""
Seed Minimal Vehicles
Wipes existing vehicles and adds exactly 3 high-quality examples for the user demo.
"""

import sys
import os

# Add the parent directory to sys.path to resolve imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal
from app.models import Vehicle, VehicleImage
from sqlalchemy import text

def seed_minimal():
    db = SessionLocal()
    try:
        # 1. Wipe existing vehicles
        print("🧹 Wiping existing vehicles...")
        # Delete images first due to FK constraint
        db.query(VehicleImage).delete()
        db.query(Vehicle).delete()
        db.commit()
        
        # 2. Add 3 High-Quality Examples
        print("🌱 Seeding 3 premium vehicles...")
        
        vehicles = [
            {
                "make": "Toyota",
                "model": "Land Cruiser Prado",
                "year": 2020,
                "price": 6500000,
                "currency": "KSH",
                "mileage": 12000,
                "body_type": "SUV",
                "transmission": "Automatic",
                "fuel_type": "Diesel",
                "condition": "Excellent", # Adjusted to match Enum
                "color": "Pearl White",
                "engine_capacity": "2800cc",
                "availability_status": "available",
                "location": "Mombasa",
                "description": "Immaculate condition. TX-L Package with Sunroof and Leather interior.",
                "is_featured": True,
                "primary_image": "https://images.unsplash.com/photo-1594235372071-c971fe79a912?auto=format&fit=crop&q=80" # Better HQ image
            },
            {
                "make": "Mercedes-Benz",
                "model": "C200",
                "year": 2017,
                "price": 3800000,
                "currency": "KSH",
                "mileage": 45000,
                "body_type": "Sedan",
                "transmission": "Automatic",
                "fuel_type": "Petrol",
                "condition": "Excellent",
                "color": "Obsidian Black",
                "engine_capacity": "2000cc",
                "availability_status": "available",
                "location": "Nairobi",
                "description": "AMG Line. Heads up display, Burmester Audio, Panoramic Roof.",
                "is_featured": True,
                "primary_image": "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80"
            },
            {
                "make": "Volkswagen",
                "model": "Tiguan",
                "year": 2018,
                "price": 3200000,
                "currency": "KSH",
                "mileage": 32000,
                "body_type": "SUV",
                "transmission": "Automatic",
                "fuel_type": "Petrol",
                "condition": "Excellent",
                "color": "Silver",
                "engine_capacity": "1400cc",
                "availability_status": "available",
                "location": "Nairobi",
                "description": "R-Line Highline. Virtual cockpit, massive spec.",
                "is_featured": True,
                "primary_image": "https://images.unsplash.com/photo-1549488344-c76d65c3dc44?auto=format&fit=crop&q=80" 
            }
        ]
        
        for v_data in vehicles:
            # Pop image url
            img_url = v_data.pop('primary_image')
            
            # Create vehicle
            vehicle = Vehicle(**v_data)
            db.add(vehicle)
            db.flush() # Flush to get ID
            
            # Create Main Image
            image = VehicleImage(
                vehicle_id=vehicle.id,
                image_url=img_url,
                is_primary=True,
                display_order=1
            )
            db.add(image)
        
        db.commit()
        print("✅ Successfully seeded 3 vehicles.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_minimal()
