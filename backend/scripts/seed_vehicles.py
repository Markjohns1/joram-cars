"""
Seed Sample Vehicles

Run this script to add sample vehicles for testing.
Usage: python -m scripts.seed_vehicles
"""

import sys
sys.path.insert(0, '.')

from app.core.database import SessionLocal, init_db
from app.models import Vehicle, VehicleImage
from app.models.base import generate_uuid


def seed_vehicles():
    """Add sample vehicles to database."""
    
    vehicles_data = [
        {
            "make": "Toyota",
            "model": "Vitz",
            "year": 2018,
            "price": 850000,
            "currency": "KSH",
            "mileage": 45000,
            "body_type": "Hatchback",
            "transmission": "Automatic",
            "fuel_type": "Petrol",
            "condition": "Excellent",
            "color": "White",
            "engine_capacity": "1300cc",
            "availability_status": "available",
            "location": "Kenya",
            "description": "Well maintained Toyota Vitz with low mileage. Perfect for city driving. Single owner, full service history available.",
            "features": ["Air Conditioning", "Power Windows", "Central Locking", "ABS Brakes", "Airbags", "Alloy Wheels"],
            "is_featured": True
        },
        {
            "make": "Nissan",
            "model": "X-Trail",
            "year": 2017,
            "price": 2200000,
            "currency": "KSH",
            "mileage": 68000,
            "body_type": "SUV",
            "transmission": "Automatic",
            "fuel_type": "Petrol",
            "condition": "Good",
            "color": "Silver",
            "engine_capacity": "2000cc",
            "availability_status": "available",
            "location": "Kenya",
            "description": "Spacious family SUV with 7 seats. Well maintained with regular servicing. Excellent condition inside and out.",
            "features": ["Leather Seats", "Sunroof", "Cruise Control", "Reverse Camera", "Navigation", "4WD"],
            "is_featured": True
        },
        {
            "make": "Mercedes-Benz",
            "model": "C200",
            "year": 2019,
            "price": 4500000,
            "currency": "KSH",
            "mileage": 35000,
            "body_type": "Sedan",
            "transmission": "Automatic",
            "fuel_type": "Petrol",
            "condition": "Excellent",
            "color": "Black",
            "engine_capacity": "2000cc",
            "availability_status": "available",
            "location": "Kenya",
            "description": "Luxury sedan in pristine condition. AMG package with sport suspension. Low mileage, single owner.",
            "features": ["Leather Seats", "Sunroof", "Parking Sensors", "Keyless Entry", "LED Lights", "Memory Seats"],
            "is_featured": True
        },
        {
            "make": "Toyota",
            "model": "Land Cruiser Prado",
            "year": 2016,
            "price": 5800000,
            "currency": "KSH",
            "mileage": 92000,
            "body_type": "SUV",
            "transmission": "Automatic",
            "fuel_type": "Diesel",
            "condition": "Good",
            "color": "Pearl White",
            "engine_capacity": "2800cc",
            "availability_status": "available",
            "location": "Kenya",
            "description": "Powerful diesel Prado perfect for both city and off-road. Full leather interior, 7 seats.",
            "features": ["4WD", "Leather Seats", "Sunroof", "Roof Rails", "Cool Box", "Third Row Seats"],
            "is_featured": True
        },
        {
            "make": "Honda",
            "model": "Fit",
            "year": 2020,
            "price": 1250000,
            "currency": "KSH",
            "mileage": 28000,
            "body_type": "Hatchback",
            "transmission": "Automatic",
            "fuel_type": "Hybrid",
            "condition": "Excellent",
            "color": "Blue",
            "engine_capacity": "1500cc",
            "availability_status": "available",
            "location": "Kenya",
            "description": "Economical hybrid hatchback. Very low fuel consumption. Perfect for daily commute.",
            "features": ["Hybrid Engine", "Push Start", "Climate Control", "USB Ports", "Bluetooth"],
            "is_featured": True
        },
        {
            "make": "BMW",
            "model": "X5",
            "year": 2018,
            "price": 6200000,
            "currency": "KSH",
            "mileage": 55000,
            "body_type": "SUV",
            "transmission": "Automatic",
            "fuel_type": "Diesel",
            "condition": "Excellent",
            "color": "Space Gray",
            "engine_capacity": "3000cc",
            "availability_status": "direct_import",
            "location": "Japan",
            "description": "Luxury SUV with powerful diesel engine. Full options including panoramic sunroof. Direct import from Japan.",
            "features": ["Panoramic Sunroof", "Heated Seats", "HUD", "360 Camera", "Adaptive Cruise", "xDrive"],
            "is_featured": True
        },
        {
            "make": "Mazda",
            "model": "CX-5",
            "year": 2019,
            "price": 3200000,
            "currency": "KSH",
            "mileage": 42000,
            "body_type": "SUV",
            "transmission": "Automatic",
            "fuel_type": "Petrol",
            "condition": "Excellent",
            "color": "Soul Red",
            "engine_capacity": "2500cc",
            "availability_status": "available",
            "location": "Kenya",
            "description": "Stylish crossover SUV in signature Mazda red. Excellent fuel economy despite powerful engine.",
            "features": ["Leather Seats", "BOSE Audio", "Sunroof", "Lane Assist", "Blind Spot Monitor"],
            "is_featured": False
        },
        {
            "make": "Subaru",
            "model": "Forester",
            "year": 2017,
            "price": 2400000,
            "currency": "KSH",
            "mileage": 75000,
            "body_type": "SUV",
            "transmission": "Automatic",
            "fuel_type": "Petrol",
            "condition": "Good",
            "color": "Forest Green",
            "engine_capacity": "2000cc",
            "availability_status": "available",
            "location": "Kenya",
            "description": "Reliable AWD SUV perfect for Kenyan roads. EyeSight driver assist available.",
            "features": ["AWD", "EyeSight", "Power Tailgate", "Roof Rails", "X-Mode"],
            "is_featured": False
        },
        {
            "make": "Volkswagen",
            "model": "Tiguan",
            "year": 2020,
            "price": 3800000,
            "currency": "KSH",
            "mileage": 22000,
            "body_type": "SUV",
            "transmission": "Automatic",
            "fuel_type": "Petrol",
            "condition": "Excellent",
            "color": "Oryx White",
            "engine_capacity": "1400cc",
            "availability_status": "direct_import",
            "location": "Germany",
            "description": "German engineering at its finest. TSI turbocharged engine with DSG transmission. Low mileage.",
            "features": ["TSI Engine", "DSG Transmission", "Virtual Cockpit", "Adaptive Chassis", "Park Assist"],
            "is_featured": True
        },
        {
            "make": "Toyota",
            "model": "Hilux",
            "year": 2021,
            "price": 4800000,
            "currency": "KSH",
            "mileage": 18000,
            "body_type": "Pickup",
            "transmission": "Automatic",
            "fuel_type": "Diesel",
            "condition": "Excellent",
            "color": "Super White",
            "engine_capacity": "2800cc",
            "availability_status": "available",
            "location": "Kenya",
            "description": "Double cab diesel pickup. Perfect for work and family use. Toyota reliability guaranteed.",
            "features": ["4WD", "Diff Lock", "Leather Seats", "Tonneau Cover", "Running Boards"],
            "is_featured": True
        },
        {
            "make": "Audi",
            "model": "A4",
            "year": 2018,
            "price": 3600000,
            "currency": "KSH",
            "mileage": 48000,
            "body_type": "Sedan",
            "transmission": "Automatic",
            "fuel_type": "Petrol",
            "condition": "Excellent",
            "color": "Mythos Black",
            "engine_capacity": "2000cc",
            "availability_status": "available",
            "location": "Kenya",
            "description": "Premium executive sedan with quattro AWD. S-line package with sport seats and suspension.",
            "features": ["Quattro AWD", "S-Line", "Virtual Cockpit", "Bang & Olufsen", "Matrix LED"],
            "is_featured": False
        },
        {
            "make": "Hyundai",
            "model": "Tucson",
            "year": 2019,
            "price": 2800000,
            "currency": "KSH",
            "mileage": 38000,
            "body_type": "SUV",
            "transmission": "Automatic",
            "fuel_type": "Petrol",
            "condition": "Excellent",
            "color": "Phantom Black",
            "engine_capacity": "2000cc",
            "availability_status": "available",
            "location": "Kenya",
            "description": "Modern SUV with bold styling. Excellent value for money with comprehensive warranty.",
            "features": ["Panoramic Sunroof", "Smart Key", "Wireless Charging", "Apple CarPlay", "Android Auto"],
            "is_featured": False
        },
    ]
    
    db = SessionLocal()
    try:
        existing_count = db.query(Vehicle).count()
        if existing_count == 0:
            for vehicle_data in vehicles_data:
                vehicle = Vehicle(**vehicle_data)
                db.add(vehicle)
            db.commit()
            print(f"✅ Seeded {len(vehicles_data)} vehicles")
        else:
            print(f"ℹ️ Database already has {existing_count} vehicles, skipping seed")
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
    seed_vehicles()
