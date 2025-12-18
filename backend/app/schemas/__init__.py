"""
Schemas Package

Exports all Pydantic schemas for clean imports.
"""

from app.schemas.vehicle import (
    VehicleBase, VehicleCreate, VehicleUpdate, VehicleResponse,
    VehicleListResponse, VehicleFilters,
    VehicleImageBase, VehicleImageCreate, VehicleImageResponse,
    CurrencyType, BodyType, TransmissionType, FuelType, ConditionType, AvailabilityStatus
)
from app.schemas.enquiry import (
    EnquiryBase, EnquiryCreate, EnquiryUpdateStatus, EnquiryResponse,
    EnquiryListResponse, EnquiryType, EnquiryStatus
)
from app.schemas.sell_request import (
    SellRequestBase, SellRequestCreate, SellRequestUpdateStatus,
    SellRequestValuation, SellRequestResponse, SellRequestListResponse,
    SellRequestImageResponse, ServiceType, SellRequestStatus
)
from app.schemas.user import (
    UserBase, UserCreate, UserUpdate, UserResponse,
    LoginRequest, TokenResponse, TokenData, UserRole
)
from app.schemas.brand import (
    BrandBase, BrandCreate, BrandUpdate, BrandResponse, BrandListResponse
)
from app.schemas.common import (
    MessageResponse, NewsletterSubscribe, PublicStats, DashboardStats
)

__all__ = [
    # Vehicle
    "VehicleBase", "VehicleCreate", "VehicleUpdate", "VehicleResponse",
    "VehicleListResponse", "VehicleFilters",
    "VehicleImageBase", "VehicleImageCreate", "VehicleImageResponse",
    "CurrencyType", "BodyType", "TransmissionType", "FuelType", "ConditionType", "AvailabilityStatus",
    # Enquiry
    "EnquiryBase", "EnquiryCreate", "EnquiryUpdateStatus", "EnquiryResponse",
    "EnquiryListResponse", "EnquiryType", "EnquiryStatus",
    # Sell Request
    "SellRequestBase", "SellRequestCreate", "SellRequestUpdateStatus",
    "SellRequestValuation", "SellRequestResponse", "SellRequestListResponse",
    "SellRequestImageResponse", "ServiceType", "SellRequestStatus",
    # User
    "UserBase", "UserCreate", "UserUpdate", "UserResponse",
    "LoginRequest", "TokenResponse", "TokenData", "UserRole",
    # Brand
    "BrandBase", "BrandCreate", "BrandUpdate", "BrandResponse", "BrandListResponse",
    # Common
    "MessageResponse", "NewsletterSubscribe", "PublicStats", "DashboardStats",
]
