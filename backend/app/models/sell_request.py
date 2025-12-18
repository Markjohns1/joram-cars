"""
Sell Request Model

Requests from customers wanting to sell their cars.
"""

from sqlalchemy import Column, String, Integer, Float, Text, DateTime, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class SellRequest(Base, TimestampMixin):
    """Sell your car request model."""
    
    __tablename__ = "sell_requests"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    
    # Customer info
    customer_name = Column(String(100), nullable=False)
    customer_email = Column(String(255), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    
    # Vehicle info
    vehicle_make = Column(String(100), nullable=False)
    vehicle_model = Column(String(100), nullable=False)
    vehicle_year = Column(Integer, nullable=False)
    mileage = Column(Integer, nullable=True)
    condition = Column(String(50), nullable=True)
    
    # Pricing
    asking_price = Column(Float, nullable=True)
    description = Column(Text, nullable=True)
    
    # Service type
    service_type = Column(
        SQLEnum("sell_on_behalf", "direct_purchase", name="service_type"),
        default="sell_on_behalf",
        nullable=False
    )
    
    # Status
    status = Column(
        SQLEnum("pending", "reviewing", "valued", "accepted", "rejected", name="sell_request_status"),
        default="pending",
        nullable=False,
        index=True
    )
    
    # Valuation
    valuation_amount = Column(Float, nullable=True)
    
    # Relationships
    images = relationship(
        "SellRequestImage",
        back_populates="sell_request",
        cascade="all, delete-orphan"
    )
    
    def __repr__(self):
        return f"<SellRequest {self.vehicle_year} {self.vehicle_make} {self.vehicle_model}>"


class SellRequestImage(Base):
    """Images for sell requests."""
    
    __tablename__ = "sell_request_images"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    sell_request_id = Column(
        String(36),
        ForeignKey("sell_requests.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    image_url = Column(String(500), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationship
    sell_request = relationship("SellRequest", back_populates="images")
    
    def __repr__(self):
        return f"<SellRequestImage {self.id}>"
