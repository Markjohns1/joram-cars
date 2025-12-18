"""
Enquiry Schemas

Pydantic models for enquiry API validation.
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr
from enum import Enum


class EnquiryType(str, Enum):
    purchase = "purchase"
    test_drive = "test_drive"
    finance = "finance"
    general = "general"


class EnquiryStatus(str, Enum):
    new = "new"
    contacted = "contacted"
    qualified = "qualified"
    closed = "closed"


class EnquiryBase(BaseModel):
    """Base enquiry schema."""
    customer_name: str = Field(..., min_length=2, max_length=100)
    customer_email: EmailStr
    customer_phone: str = Field(..., min_length=10, max_length=20)
    message: Optional[str] = None
    enquiry_type: EnquiryType = EnquiryType.purchase


class EnquiryCreate(EnquiryBase):
    """Schema for creating an enquiry."""
    vehicle_id: Optional[str] = None


class EnquiryUpdateStatus(BaseModel):
    """Schema for updating enquiry status."""
    status: EnquiryStatus


class EnquiryResponse(EnquiryBase):
    """Schema for enquiry response."""
    id: str
    vehicle_id: Optional[str]
    status: EnquiryStatus
    created_at: datetime
    responded_at: Optional[datetime]
    
    # Include vehicle info if available
    vehicle_title: Optional[str] = None
    
    class Config:
        from_attributes = True


class EnquiryListResponse(BaseModel):
    """Schema for paginated enquiry list."""
    items: list[EnquiryResponse]
    total: int
    page: int
    limit: int
