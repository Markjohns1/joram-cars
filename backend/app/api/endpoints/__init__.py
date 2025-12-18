"""
API Endpoints Package

Export all routers for registration in main app.
"""

from app.api.endpoints.vehicles import router as vehicles_router
from app.api.endpoints.enquiries import router as enquiries_router
from app.api.endpoints.sell_requests import router as sell_requests_router
from app.api.endpoints.brands import router as brands_router
from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.admin import router as admin_router
from app.api.endpoints.public import router as public_router

__all__ = [
    "vehicles_router",
    "enquiries_router",
    "sell_requests_router",
    "brands_router",
    "auth_router",
    "admin_router",
    "public_router",
]
