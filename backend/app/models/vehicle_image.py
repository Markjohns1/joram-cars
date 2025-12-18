"""
Vehicle Image Model

Stores images associated with vehicles.
"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base
from app.models.base import generate_uuid


class VehicleImage(Base):
    """Image model for vehicle photos."""
    
    __tablename__ = "vehicle_images"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    vehicle_id = Column(
        String(36),
        ForeignKey("vehicles.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    image_url = Column(String(500), nullable=False)
    is_primary = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationship
    vehicle = relationship("Vehicle", back_populates="images")
    
    def __repr__(self):
        return f"<VehicleImage {self.id} primary={self.is_primary}>"
