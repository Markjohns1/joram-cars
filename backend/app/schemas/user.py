"""
User & Auth Schemas

Pydantic models for authentication and user management.
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr
from enum import Enum


class UserRole(str, Enum):
    admin = "admin"
    staff = "staff"


class UserBase(BaseModel):
    """Base user schema."""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=100)
    role: UserRole = UserRole.staff


class UserCreate(UserBase):
    """Schema for creating a user."""
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    """Schema for updating a user."""
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=100)
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    """Schema for user response."""
    id: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime]
    
    class Config:
        from_attributes = True


# ============ Auth Schemas ============

class LoginRequest(BaseModel):
    """Schema for login request."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Schema for token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    """Schema for decoded token data."""
    user_id: str
    email: str
    role: str
