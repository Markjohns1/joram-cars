"""
Enquiry Model

Customer enquiries about vehicles.
"""

from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base
from app.models.base import generate_uuid


class Enquiry(Base):
    """Customer enquiry model."""
    
    __tablename__ = "enquiries"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    
    # Related vehicle (optional - could be general enquiry)
    vehicle_id = Column(
        String(36),
        ForeignKey("vehicles.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    
    # Customer info
    customer_name = Column(String(100), nullable=False)
    customer_email = Column(String(255), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    
    # Enquiry details
    message = Column(Text, nullable=True)
    enquiry_type = Column(
        SQLEnum("purchase", "test_drive", "finance", "general", name="enquiry_type"),
        default="purchase",
        nullable=False
    )
    
    # Status tracking
    status = Column(
        SQLEnum("new", "contacted", "qualified", "closed", name="enquiry_status"),
        default="new",
        nullable=False,
        index=True
    )
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    responded_at = Column(DateTime, nullable=True)
    
    # Relationship
    vehicle = relationship("Vehicle", back_populates="enquiries")
    
    def __repr__(self):
        return f"<Enquiry {self.id} from {self.customer_name}>"
