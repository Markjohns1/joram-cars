"""
Vehicles API Endpoints

Public endpoints for browsing and viewing vehicles.
"""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services import VehicleService
from app.schemas import (
    VehicleResponse, VehicleListResponse,
    BodyType, TransmissionType, FuelType, AvailabilityStatus
)

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


@router.get("", response_model=VehicleListResponse)
def list_vehicles(
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50),
    make: Optional[str] = None,
    model: Optional[str] = None,
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    min_year: Optional[int] = Query(None, ge=1900),
    max_year: Optional[int] = Query(None, le=2030),
    body_type: Optional[BodyType] = None,
    transmission: Optional[TransmissionType] = None,
    fuel_type: Optional[FuelType] = None,
    availability_status: Optional[AvailabilityStatus] = None,
    location: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = Query("created_at", regex="^(created_at|price|year|mileage)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    """
    List all vehicles with filtering, pagination, and sorting.
    
    Supports filtering by make, model, price range, year range,
    body type, transmission, fuel type, availability, and location.
    """
    vehicles, total = VehicleService.get_vehicles(
        db=db,
        page=page,
        limit=limit,
        make=make,
        model=model,
        min_price=min_price,
        max_price=max_price,
        min_year=min_year,
        max_year=max_year,
        body_type=body_type.value if body_type else None,
        transmission=transmission.value if transmission else None,
        fuel_type=fuel_type.value if fuel_type else None,
        availability_status=availability_status.value if availability_status else None,
        location=location,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order
    )
    
    pages = (total + limit - 1) // limit
    
    return VehicleListResponse(
        items=vehicles,
        total=total,
        page=page,
        limit=limit,
        pages=pages
    )


@router.get("/featured", response_model=List[VehicleResponse])
def get_featured_vehicles(
    limit: int = Query(8, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Get featured vehicles for homepage display."""
    return VehicleService.get_featured_vehicles(db, limit)


@router.get("/recent", response_model=List[VehicleResponse])
def get_recent_vehicles(
    limit: int = Query(8, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Get recently added vehicles."""
    return VehicleService.get_recent_vehicles(db, limit)


@router.get("/makes", response_model=List[str])
def get_vehicle_makes(db: Session = Depends(get_db)):
    """Get list of all vehicle makes."""
    return VehicleService.get_makes(db)


@router.get("/models/{make}", response_model=List[str])
def get_vehicle_models(
    make: str,
    db: Session = Depends(get_db)
):
    """Get list of models for a specific make."""
    return VehicleService.get_models_by_make(db, make)


@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(
    vehicle_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a single vehicle by ID.
    
    Also increments the view count.
    """
    vehicle = VehicleService.get_vehicle_by_id(db, vehicle_id)
    
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    # Increment view count
    VehicleService.increment_views(db, vehicle)
    
    return vehicle
