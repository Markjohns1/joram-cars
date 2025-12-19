"""
Vehicle Schemas

Pydantic models for vehicle API validation.
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum


class CurrencyType(str, Enum):
    KSH = "KSH"
    USD = "USD"
    GBP = "GBP"
    JPY = "JPY"


class BodyType(str, Enum):
    SUV = "SUV"
    Sedan = "Sedan"
    Hatchback = "Hatchback"
    Pickup = "Pickup"
    Convertible = "Convertible"
    Van = "Van"
    Wagon = "Wagon"
    Coupe = "Coupe"


class TransmissionType(str, Enum):
    Automatic = "Automatic"
    Manual = "Manual"


class FuelType(str, Enum):
    Petrol = "Petrol"
    Diesel = "Diesel"
    Hybrid = "Hybrid"
    Electric = "Electric"


class ConditionType(str, Enum):
    Excellent = "Excellent"
    Good = "Good"
    Fair = "Fair"


class AvailabilityStatus(str, Enum):
    available = "available"
    direct_import = "direct_import"
    sold = "sold"
    reserved = "reserved"


# ============ Image Schemas ============

class VehicleImageBase(BaseModel):
    """Base image schema."""
    image_url: str
    is_primary: bool = False
    display_order: int = 0


class VehicleImageCreate(VehicleImageBase):
    """Schema for creating an image."""
    pass


class VehicleImageResponse(VehicleImageBase):
    """Schema for image response."""
    id: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True


# ============ Vehicle Schemas ============

class VehicleBase(BaseModel):
    """Base vehicle schema with common fields."""
    make: str = Field(..., min_length=1, max_length=100)
    model: str = Field(..., min_length=1, max_length=100)
    year: int = Field(..., ge=1900, le=2030)
    trim: Optional[str] = Field(None, max_length=50)
    price: float = Field(..., gt=0)
    currency: CurrencyType = CurrencyType.KSH
    
    mileage: Optional[int] = Field(None, ge=0)
    body_type: Optional[BodyType] = None
    transmission: Optional[TransmissionType] = None
    fuel_type: Optional[FuelType] = None
    condition: Optional[ConditionType] = ConditionType.Good
    color: Optional[str] = Field(None, max_length=50)
    engine_capacity: Optional[str] = Field(None, max_length=20)
    
    availability_status: AvailabilityStatus = AvailabilityStatus.available
    location: Optional[str] = "Kenya"
    
    description: Optional[str] = None
    features: Optional[List[str]] = []
    is_featured: bool = False


class VehicleCreate(VehicleBase):
    """Schema for creating a vehicle."""
    pass


class VehicleUpdate(BaseModel):
    """Schema for updating a vehicle. All fields optional."""
    make: Optional[str] = Field(None, min_length=1, max_length=100)
    model: Optional[str] = Field(None, min_length=1, max_length=100)
    year: Optional[int] = Field(None, ge=1900, le=2030)
    trim: Optional[str] = Field(None, max_length=50)
    price: Optional[float] = Field(None, gt=0)
    currency: Optional[CurrencyType] = None
    
    mileage: Optional[int] = Field(None, ge=0)
    body_type: Optional[BodyType] = None
    transmission: Optional[TransmissionType] = None
    fuel_type: Optional[FuelType] = None
    condition: Optional[ConditionType] = None
    color: Optional[str] = Field(None, max_length=50)
    engine_capacity: Optional[str] = Field(None, max_length=20)
    
    availability_status: Optional[AvailabilityStatus] = None
    location: Optional[str] = None
    
    description: Optional[str] = None
    features: Optional[List[str]] = None
    is_featured: Optional[bool] = None


class VehicleResponse(VehicleBase):
    """Schema for vehicle response."""
    id: str
    views_count: int
    created_at: datetime
    updated_at: datetime
    images: List[VehicleImageResponse] = []
    primary_image: Optional[str] = None
    title: str
    
    class Config:
        from_attributes = True


class VehicleListResponse(BaseModel):
    """Schema for paginated vehicle list."""
    items: List[VehicleResponse]
    total: int
    page: int
    limit: int
    pages: int


# ============ Filter Schemas ============

class VehicleFilters(BaseModel):
    """Query parameters for filtering vehicles."""
    make: Optional[str] = None
    model: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_year: Optional[int] = None
    max_year: Optional[int] = None
    body_type: Optional[BodyType] = None
    transmission: Optional[TransmissionType] = None
    fuel_type: Optional[FuelType] = None
    availability_status: Optional[AvailabilityStatus] = None
    location: Optional[str] = None
    is_featured: Optional[bool] = None
