"""
Brand Model

Car brands with logos for display.
"""

from sqlalchemy import Column, String, Integer, Boolean

from app.core.database import Base
from app.models.base import generate_uuid


class Brand(Base):
    """Car brand model."""
    
    __tablename__ = "brands"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    
    name = Column(String(100), unique=True, nullable=False, index=True)
    logo_url = Column(String(500), nullable=True)
    
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True, nullable=False)
    
    def __repr__(self):
        return f"<Brand {self.name}>"
