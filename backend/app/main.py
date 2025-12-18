"""
Joram Cars API

FastAPI application entry point.
"""

from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import get_settings
from app.core.database import init_db, SessionLocal
from app.api.endpoints import (
    vehicles_router,
    enquiries_router,
    sell_requests_router,
    brands_router,
    auth_router,
    admin_router,
    public_router
)

settings = get_settings()


def create_default_admin():
    """Create default admin user if not exists."""
    from app.models import User
    from app.core.security import get_password_hash
    
    db = SessionLocal()
    try:
        # Check if admin exists
        admin = db.query(User).filter(User.email == settings.admin_email).first()
        if not admin:
            admin = User(
                username="admin",
                email=settings.admin_email,
                hashed_password=get_password_hash(settings.admin_password),
                full_name="System Administrator",
                role="admin",
                is_active=True
            )
            db.add(admin)
            db.commit()
            print(f"✅ Default admin created: {settings.admin_email}")
    finally:
        db.close()


def seed_brands():
    """Seed initial car brands."""
    from app.models import Brand
    
    brands_data = [
        {"name": "Toyota", "display_order": 1},
        {"name": "Nissan", "display_order": 2},
        {"name": "Honda", "display_order": 3},
        {"name": "Mazda", "display_order": 4},
        {"name": "Subaru", "display_order": 5},
        {"name": "Mercedes-Benz", "display_order": 6},
        {"name": "BMW", "display_order": 7},
        {"name": "Audi", "display_order": 8},
        {"name": "Volkswagen", "display_order": 9},
        {"name": "Land Rover", "display_order": 10},
        {"name": "Mitsubishi", "display_order": 11},
        {"name": "Suzuki", "display_order": 12},
        {"name": "Isuzu", "display_order": 13},
        {"name": "Ford", "display_order": 14},
        {"name": "Hyundai", "display_order": 15},
        {"name": "Kia", "display_order": 16},
    ]
    
    db = SessionLocal()
    try:
        existing_count = db.query(Brand).count()
        if existing_count == 0:
            for brand_data in brands_data:
                brand = Brand(**brand_data, is_active=True)
                db.add(brand)
            db.commit()
            print(f"✅ Seeded {len(brands_data)} brands")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    print("🚗 Starting Joram Cars API...")
    
    # Create uploads directory
    Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
    Path(settings.upload_dir + "/vehicles").mkdir(parents=True, exist_ok=True)
    Path(settings.upload_dir + "/sell-requests").mkdir(parents=True, exist_ok=True)
    Path(settings.upload_dir + "/brands").mkdir(parents=True, exist_ok=True)
    
    # Initialize database
    init_db()
    print("✅ Database initialized")
    
    # Create default admin
    create_default_admin()
    
    # Seed brands
    seed_brands()
    
    print("🚀 Joram Cars API ready!")
    print(f"📖 Docs: http://localhost:8000/docs")
    
    yield
    
    # Shutdown
    print("👋 Shutting down Joram Cars API")


# Create FastAPI app
app = FastAPI(
    title="Joram Cars API",
    description="Kenya's Premier Used Car Marketplace",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)

# Static files for uploads
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

# Register routers
app.include_router(vehicles_router, prefix="/api")
app.include_router(enquiries_router, prefix="/api")
app.include_router(sell_requests_router, prefix="/api")
app.include_router(brands_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(public_router, prefix="/api")


@app.get("/", tags=["Root"])
def root():
    """Root endpoint."""
    return {
        "name": "Joram Cars API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
