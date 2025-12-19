"""
Vehicle Model

Represents vehicles in the dealership inventory.
"""

from sqlalchemy import (
    Column, String, Integer, Float, Boolean, 
    Text, DateTime, Enum as SQLEnum, JSON
)
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class Vehicle(Base, TimestampMixin):
    """Vehicle model for car listings."""
    
    __tablename__ = "vehicles"
    
    # Primary key
    id = Column(String(36), primary_key=True, default=generate_uuid)
    
    # Basic info
    make = Column(String(100), nullable=False, index=True)
    model = Column(String(100), nullable=False, index=True)
    year = Column(Integer, nullable=False, index=True)
    trim = Column(String(50), nullable=True, index=True) # e.g. "TX-L", "V8"
    
    # Pricing
    price = Column(Float, nullable=False, index=True)
    currency = Column(
        SQLEnum("KSH", "USD", "GBP", "JPY", name="currency_type"),
        default="KSH",
        nullable=False
    )
    
    # Specifications
    mileage = Column(Integer, nullable=True)
    body_type = Column(
        SQLEnum("SUV", "Sedan", "Hatchback", "Pickup", "Convertible", "Van", "Wagon", "Coupe", name="body_type"),
        nullable=True,
        index=True
    )
    transmission = Column(
        SQLEnum("Automatic", "Manual", name="transmission_type"),
        nullable=True,
        index=True
    )
    fuel_type = Column(
        SQLEnum("Petrol", "Diesel", "Hybrid", "Electric", name="fuel_type"),
        nullable=True,
        index=True
    )
    condition = Column(
        SQLEnum("Excellent", "Good", "Fair", name="condition_type"),
        default="Good",
        nullable=True
    )
    color = Column(String(50), nullable=True)
    engine_capacity = Column(String(20), nullable=True)  # e.g., "1500cc"
    
    # Status
    availability_status = Column(
        SQLEnum("available", "direct_import", "sold", "reserved", name="availability_status"),
        default="available",
        nullable=False,
        index=True
    )
    location = Column(String(100), default="Kenya", nullable=True)
    
    # Details
    description = Column(Text, nullable=True)
    features = Column(JSON, default=list)  # Array of feature strings
    
    # Display
    is_featured = Column(Boolean, default=False, index=True)
    views_count = Column(Integer, default=0)
    
    # Relationships
    images = relationship(
        "VehicleImage",
        back_populates="vehicle",
        cascade="all, delete-orphan",
        order_by="VehicleImage.display_order"
    )
    enquiries = relationship(
        "Enquiry",
        back_populates="vehicle",
        cascade="all, delete-orphan"
    )
    
    def __repr__(self):
        return f"<Vehicle {self.year} {self.make} {self.model}>"
    
    @property
    def primary_image(self):
        """Get the primary image URL."""
        for img in self.images:
            if img.is_primary:
                return img.image_url
        return self.images[0].image_url if self.images else None
    
    @property
    def title(self):
        """Get a formatted title for the vehicle."""
        return f"{self.year} {self.make} {self.model}"
