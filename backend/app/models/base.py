"""
Base Model Mixin

Common fields and functionality for all models.
"""

import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime
from sqlalchemy.dialects.sqlite import TEXT


def generate_uuid() -> str:
    """Generate a new UUID string."""
    return str(uuid.uuid4())


class TimestampMixin:
    """Mixin that adds created_at and updated_at timestamps."""
    
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )
