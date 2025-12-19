"""
Common Schemas

Shared Pydantic models used across the API.
"""

from typing import Optional
from pydantic import BaseModel, EmailStr


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
    success: bool = True


class NewsletterSubscribe(BaseModel):
    """Schema for newsletter subscription."""
    email: EmailStr


class PublicStats(BaseModel):
    """Schema for public statistics."""
    total_vehicles: int
    total_brands: int
    vehicles_available: int
    vehicles_sold: int


class DashboardStats(BaseModel):
    """Schema for admin dashboard statistics."""
    total_vehicles: int
    total_enquiries: int
    total_sell_requests: int
    new_enquiries: int
    pending_sell_requests: int
    vehicles_available: int
    vehicles_sold: int
    featured_vehicles: int
    total_views: int
