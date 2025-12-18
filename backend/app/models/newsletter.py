"""
Newsletter Subscriber Model

Email subscribers for newsletter.
"""

from sqlalchemy import Column, String, Boolean, DateTime
from datetime import datetime

from app.core.database import Base
from app.models.base import generate_uuid


class NewsletterSubscriber(Base):
    """Newsletter subscriber model."""
    
    __tablename__ = "newsletter_subscribers"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    
    email = Column(String(255), unique=True, nullable=False, index=True)
    subscribed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    def __repr__(self):
        return f"<NewsletterSubscriber {self.email}>"
