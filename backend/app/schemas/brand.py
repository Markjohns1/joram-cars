"""
Brand Schemas

Pydantic models for brand API validation.
"""

from typing import Optional, List
from pydantic import BaseModel, Field


class BrandBase(BaseModel):
    """Base brand schema."""
    name: str = Field(..., min_length=1, max_length=100)
    logo_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True


class BrandCreate(BrandBase):
    """Schema for creating a brand."""
    pass


class BrandUpdate(BaseModel):
    """Schema for updating a brand."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    logo_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class BrandResponse(BrandBase):
    """Schema for brand response."""
    id: str
    
    class Config:
        from_attributes = True


class BrandListResponse(BaseModel):
    """Schema for brand list."""
    items: List[BrandResponse]
    total: int
