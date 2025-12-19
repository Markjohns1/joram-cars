"""
Admin API Endpoints

Protected endpoints for managing vehicles, enquiries, and sell requests.
"""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_user, get_current_admin
from app.models import User, Vehicle, Brand, NewsletterSubscriber
from app.services import VehicleService, EnquiryService, SellRequestService, AuthService, ImageService
from app.schemas import (
    # Vehicle
    VehicleCreate, VehicleUpdate, VehicleResponse, VehicleListResponse,
    VehicleImageResponse, 
    # Enquiry
    EnquiryResponse, EnquiryListResponse, EnquiryUpdateStatus,
    # Sell Request
    SellRequestResponse, SellRequestListResponse, SellRequestUpdateStatus, SellRequestValuation,
    # Brand
    BrandCreate, BrandUpdate, BrandResponse, BrandListResponse,
    # User
    UserCreate, UserUpdate, UserResponse,
    # Common
    MessageResponse, DashboardStats
)

router = APIRouter(prefix="/admin", tags=["Admin"])


# ============ Dashboard ============

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics for admin panel with Numerical Wisdom."""
    from datetime import datetime, timedelta
    from app.models import Enquiry, SellRequest, Vehicle
    from sqlalchemy import func
    
    # 1. Base Stats
    total_vehicles = db.query(Vehicle).count()
    vehicles_available = db.query(Vehicle).filter(Vehicle.availability_status == "available").count()
    vehicles_sold = db.query(Vehicle).filter(Vehicle.availability_status == "sold").count()
    featured_vehicles = db.query(Vehicle).filter(Vehicle.is_featured == True).count()
    
    new_enquiries = EnquiryService.get_new_enquiries_count(db)
    pending_sell_requests = SellRequestService.get_pending_count(db)
    
    total_enquiries = db.query(Enquiry).count()
    total_sell_requests = db.query(SellRequest).count()
    total_views = db.query(func.sum(Vehicle.views_count)).scalar() or 0
    
    # 2. Numerical Wisdom: Inventory Value
    total_inventory_value = db.query(func.sum(Vehicle.price)).filter(
        Vehicle.availability_status == "available"
    ).scalar() or 0
    
    # 3. Numerical Wisdom: Enquiries WoW Growth
    now = datetime.utcnow()
    this_week_start = now - timedelta(days=7)
    last_week_start = now - timedelta(days=14)
    
    this_week_enquiries = db.query(Enquiry).filter(Enquiry.created_at >= this_week_start).count()
    last_week_enquiries = db.query(Enquiry).filter(
        Enquiry.created_at >= last_week_start,
        Enquiry.created_at < this_week_start
    ).count()
    
    enquiries_wow = 0.0
    if last_week_enquiries > 0:
        enquiries_wow = ((this_week_enquiries - last_week_enquiries) / last_week_enquiries) * 100
    elif this_week_enquiries > 0:
        enquiries_wow = 100.0 # First week growth
        
    # 4. Numerical Wisdom: Conversion Rate (Visitor to Lead)
    conversion_rate = 0.0
    if total_views > 0:
        conversion_rate = (total_enquiries / total_views) * 100
        
    # 5. Numerical Wisdom: Inventory Velocity (Avg Days to Sell)
    # Using SQLite friendly calculation (difference in days)
    sold_vehicles = db.query(Vehicle).filter(Vehicle.availability_status == "sold").all()
    avg_days_to_sell = 0.0
    if sold_vehicles:
        total_days = sum([(v.updated_at - v.created_at).days for v in sold_vehicles])
        avg_days_to_sell = total_days / len(sold_vehicles)
    
    return DashboardStats(
        total_vehicles=total_vehicles,
        total_enquiries=total_enquiries,
        total_sell_requests=total_sell_requests,
        new_enquiries=new_enquiries,
        pending_sell_requests=pending_sell_requests,
        vehicles_available=vehicles_available,
        vehicles_sold=vehicles_sold,
        featured_vehicles=featured_vehicles,
        total_views=total_views,
        # Wisdom
        enquiries_wow=round(enquiries_wow, 1),
        conversion_rate=round(conversion_rate, 2),
        avg_days_to_sell=round(avg_days_to_sell, 1),
        total_inventory_value=total_inventory_value
    )


# ============ Vehicles ============

@router.get("/vehicles", response_model=VehicleListResponse)
def admin_list_vehicles(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    availability_status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all vehicles for admin management."""
    vehicles, total = VehicleService.get_vehicles(
        db=db,
        page=page,
        limit=limit,
        search=search,
        availability_status=availability_status
    )
    
    pages = (total + limit - 1) // limit
    
    return VehicleListResponse(
        items=vehicles,
        total=total,
        page=page,
        limit=limit,
        pages=pages
    )


@router.post("/vehicles", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle(
    data: VehicleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new vehicle listing."""
    vehicle = VehicleService.create_vehicle(db, data)
    return vehicle


@router.get("/vehicles/{vehicle_id}", response_model=VehicleResponse)
def admin_get_vehicle(
    vehicle_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get vehicle details for editing."""
    vehicle = VehicleService.get_vehicle_by_id(db, vehicle_id)
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    return vehicle


@router.put("/vehicles/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: str,
    data: VehicleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a vehicle listing."""
    vehicle = VehicleService.get_vehicle_by_id(db, vehicle_id)
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    updated = VehicleService.update_vehicle(db, vehicle, data)
    return updated


@router.delete("/vehicles/{vehicle_id}", response_model=MessageResponse)
def delete_vehicle(
    vehicle_id: str,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a vehicle listing (admin only)."""
    vehicle = VehicleService.get_vehicle_by_id(db, vehicle_id)
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    VehicleService.delete_vehicle(db, vehicle)
    return MessageResponse(message="Vehicle deleted successfully")


@router.patch("/vehicles/{vehicle_id}/feature", response_model=VehicleResponse)
def toggle_featured(
    vehicle_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggle featured status of a vehicle."""
    vehicle = VehicleService.get_vehicle_by_id(db, vehicle_id)
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    updated = VehicleService.toggle_featured(db, vehicle)
    return updated


@router.post("/vehicles/{vehicle_id}/upload-image", response_model=VehicleImageResponse)
def upload_vehicle_image(
    vehicle_id: str,
    is_primary: bool = Query(False),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload an image for a vehicle."""
    vehicle = VehicleService.get_vehicle_by_id(db, vehicle_id)
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    # Save image
    image_url = ImageService.save_image(file, subfolder="vehicles")
    
    # Get next display order
    display_order = len(vehicle.images)
    
    # Add to database
    image = VehicleService.add_image(
        db=db,
        vehicle_id=vehicle_id,
        image_url=image_url,
        is_primary=is_primary,
        display_order=display_order
    )
    
    return image


@router.delete("/vehicles/images/{image_id}", response_model=MessageResponse)
def delete_vehicle_image(
    image_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a vehicle image."""
    deleted = VehicleService.delete_image(db, image_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )
    return MessageResponse(message="Image deleted successfully")


# ============ Enquiries ============

@router.get("/enquiries", response_model=EnquiryListResponse)
def list_enquiries(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all enquiries."""
    enquiries, total = EnquiryService.get_enquiries(
        db=db,
        page=page,
        limit=limit,
        status=status
    )
    
    return EnquiryListResponse(
        items=enquiries,
        total=total,
        page=page,
        limit=limit
    )


@router.get("/enquiries/{enquiry_id}", response_model=EnquiryResponse)
def get_enquiry(
    enquiry_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get enquiry details."""
    enquiry = EnquiryService.get_enquiry_by_id(db, enquiry_id)
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found"
        )
    return enquiry


@router.patch("/enquiries/{enquiry_id}/status", response_model=EnquiryResponse)
def update_enquiry_status(
    enquiry_id: str,
    data: EnquiryUpdateStatus,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update enquiry status."""
    enquiry = EnquiryService.get_enquiry_by_id(db, enquiry_id)
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found"
        )
    
    updated = EnquiryService.update_status(db, enquiry, data.status.value)
    return updated


@router.delete("/enquiries/{enquiry_id}", response_model=MessageResponse)
def delete_enquiry(
    enquiry_id: str,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete an enquiry (admin only)."""
    enquiry = EnquiryService.get_enquiry_by_id(db, enquiry_id)
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found"
        )
    
    EnquiryService.delete_enquiry(db, enquiry)
    return MessageResponse(message="Enquiry deleted successfully")


# ============ Sell Requests ============

@router.get("/sell-requests", response_model=SellRequestListResponse)
def list_sell_requests(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all sell requests."""
    requests, total = SellRequestService.get_sell_requests(
        db=db,
        page=page,
        limit=limit,
        status=status
    )
    
    return SellRequestListResponse(
        items=requests,
        total=total,
        page=page,
        limit=limit
    )


@router.get("/sell-requests/{request_id}", response_model=SellRequestResponse)
def get_sell_request(
    request_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get sell request details."""
    sell_request = SellRequestService.get_sell_request_by_id(db, request_id)
    if not sell_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sell request not found"
        )
    return sell_request


@router.patch("/sell-requests/{request_id}/status", response_model=SellRequestResponse)
def update_sell_request_status(
    request_id: str,
    data: SellRequestUpdateStatus,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update sell request status."""
    sell_request = SellRequestService.get_sell_request_by_id(db, request_id)
    if not sell_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sell request not found"
        )
    
    updated = SellRequestService.update_status(db, sell_request, data.status.value)
    return updated


@router.patch("/sell-requests/{request_id}/valuation", response_model=SellRequestResponse)
def add_valuation(
    request_id: str,
    data: SellRequestValuation,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add valuation to a sell request."""
    sell_request = SellRequestService.get_sell_request_by_id(db, request_id)
    if not sell_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sell request not found"
        )
    
    updated = SellRequestService.add_valuation(db, sell_request, data.valuation_amount)
    return updated


# ============ Brands ============

@router.get("/brands", response_model=BrandListResponse)
def admin_list_brands(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all brands including inactive ones."""
    brands = db.query(Brand).order_by(Brand.display_order, Brand.name).all()
    return BrandListResponse(items=brands, total=len(brands))


@router.post("/brands", response_model=BrandResponse, status_code=status.HTTP_201_CREATED)
def create_brand(
    data: BrandCreate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new brand (admin only)."""
    # Check if brand exists
    existing = db.query(Brand).filter(Brand.name == data.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Brand already exists"
        )
    
    brand = Brand(**data.model_dump())
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return brand


@router.put("/brands/{brand_id}", response_model=BrandResponse)
def update_brand(
    brand_id: str,
    data: BrandUpdate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update a brand (admin only)."""
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found"
        )
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(brand, field, value)
    
    db.commit()
    db.refresh(brand)
    return brand


@router.delete("/brands/{brand_id}", response_model=MessageResponse)
def delete_brand(
    brand_id: str,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a brand (admin only)."""
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand not found"
        )
    
    db.delete(brand)
    db.commit()
    return MessageResponse(message="Brand deleted successfully")


# ============ Users ============

@router.get("/users", response_model=List[UserResponse])
def list_users(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """List all admin users (admin only)."""
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users


@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    data: UserCreate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new admin user (admin only)."""
    if AuthService.user_exists(db, data.email, data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exists"
        )
    
    # Enforce Max 2 Admins
    if data.role == "admin":
        admin_count = db.query(User).filter(User.role == "admin").count()
        if admin_count >= 2:
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Maximum number of admins (2) reached. You cannot create more admins."
            )
    
    user = AuthService.create_user(db, data)
    return user


@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: str,
    data: UserUpdate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update an admin user (admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user
