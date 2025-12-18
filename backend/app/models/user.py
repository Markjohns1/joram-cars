"""
User Model

Admin users for the dashboard.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Enum as SQLEnum
from datetime import datetime

from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class User(Base, TimestampMixin):
    """Admin user model."""
    
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    
    role = Column(
        SQLEnum("admin", "staff", name="user_role"),
        default="staff",
        nullable=False
    )
    
    is_active = Column(Boolean, default=True, nullable=False)
    last_login = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<User {self.username}>"
