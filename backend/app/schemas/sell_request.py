"""
Sell Request Schemas

Pydantic models for sell request API validation.
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr
from enum import Enum


class ServiceType(str, Enum):
    sell_on_behalf = "sell_on_behalf"
    direct_purchase = "direct_purchase"


class SellRequestStatus(str, Enum):
    pending = "pending"
    reviewing = "reviewing"
    valued = "valued"
    accepted = "accepted"
    rejected = "rejected"


class SellRequestImageResponse(BaseModel):
    """Schema for sell request image response."""
    id: str
    image_url: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True


class SellRequestBase(BaseModel):
    """Base sell request schema."""
    customer_name: str = Field(..., min_length=2, max_length=100)
    customer_email: EmailStr
    customer_phone: str = Field(..., min_length=10, max_length=20)
    
    vehicle_make: str = Field(..., min_length=1, max_length=100)
    vehicle_model: str = Field(..., min_length=1, max_length=100)
    vehicle_year: int = Field(..., ge=1900, le=2030)
    
    mileage: Optional[int] = Field(None, ge=0)
    condition: Optional[str] = Field(None, max_length=50)
    asking_price: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
    
    service_type: ServiceType = ServiceType.sell_on_behalf


class SellRequestCreate(SellRequestBase):
    """Schema for creating a sell request."""
    pass


class SellRequestUpdateStatus(BaseModel):
    """Schema for updating sell request status."""
    status: SellRequestStatus


class SellRequestValuation(BaseModel):
    """Schema for adding valuation."""
    valuation_amount: float = Field(..., gt=0)


class SellRequestResponse(SellRequestBase):
    """Schema for sell request response."""
    id: str
    status: SellRequestStatus
    valuation_amount: Optional[float]
    created_at: datetime
    updated_at: datetime
    images: List[SellRequestImageResponse] = []
    
    class Config:
        from_attributes = True


class SellRequestListResponse(BaseModel):
    """Schema for paginated sell request list."""
    items: List[SellRequestResponse]
    total: int
    page: int
    limit: int
