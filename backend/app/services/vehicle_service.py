"""
Vehicle Service

Business logic for vehicle operations.
"""

from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, asc

from app.models import Vehicle, VehicleImage
from app.schemas import VehicleCreate, VehicleUpdate


class VehicleService:
    """Service class for vehicle operations."""
    
    @staticmethod
    def get_vehicles(
        db: Session,
        page: int = 1,
        limit: int = 12,
        make: Optional[str] = None,
        model: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        min_year: Optional[int] = None,
        max_year: Optional[int] = None,
        body_type: Optional[str] = None,
        transmission: Optional[str] = None,
        fuel_type: Optional[str] = None,
        availability_status: Optional[str] = None,
        location: Optional[str] = None,
        is_featured: Optional[bool] = None,
        search: Optional[str] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> Tuple[List[Vehicle], int]:
        """
        Get vehicles with filtering, pagination, and sorting.
        
        Returns tuple of (vehicles, total_count).
        """
        query = db.query(Vehicle)
        
        # Apply filters
        if make:
            query = query.filter(Vehicle.make.ilike(f"%{make}%"))
        if model:
            query = query.filter(Vehicle.model.ilike(f"%{model}%"))
        if min_price is not None:
            query = query.filter(Vehicle.price >= min_price)
        if max_price is not None:
            query = query.filter(Vehicle.price <= max_price)
        if min_year is not None:
            query = query.filter(Vehicle.year >= min_year)
        if max_year is not None:
            query = query.filter(Vehicle.year <= max_year)
        if body_type:
            query = query.filter(Vehicle.body_type == body_type)
        if transmission:
            query = query.filter(Vehicle.transmission == transmission)
        if fuel_type:
            query = query.filter(Vehicle.fuel_type == fuel_type)
        if availability_status:
            query = query.filter(Vehicle.availability_status == availability_status)
        if location:
            query = query.filter(Vehicle.location.ilike(f"%{location}%"))
        if is_featured is not None:
            query = query.filter(Vehicle.is_featured == is_featured)
        
        # Search across make, model, description
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Vehicle.make.ilike(search_term),
                    Vehicle.model.ilike(search_term),
                    Vehicle.description.ilike(search_term)
                )
            )
        
        # Get total count before pagination
        total = query.count()
        
        # Apply sorting
        sort_column = getattr(Vehicle, sort_by, Vehicle.created_at)
        if sort_order == "asc":
            query = query.order_by(asc(sort_column))
        else:
            query = query.order_by(desc(sort_column))
        
        # Apply pagination
        offset = (page - 1) * limit
        vehicles = query.offset(offset).limit(limit).all()
        
        return vehicles, total
    
    @staticmethod
    def get_vehicle_by_id(db: Session, vehicle_id: str) -> Optional[Vehicle]:
        """Get a single vehicle by ID."""
        return db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    
    @staticmethod
    def get_featured_vehicles(db: Session, limit: int = 8) -> List[Vehicle]:
        """Get featured vehicles."""
        return db.query(Vehicle).filter(
            Vehicle.is_featured == True,
            Vehicle.availability_status.in_(["available", "direct_import"])
        ).order_by(desc(Vehicle.created_at)).limit(limit).all()
    
    @staticmethod
    def get_recent_vehicles(db: Session, limit: int = 8) -> List[Vehicle]:
        """Get recently added vehicles."""
        return db.query(Vehicle).filter(
            Vehicle.availability_status.in_(["available", "direct_import"])
        ).order_by(desc(Vehicle.created_at)).limit(limit).all()
    
    @staticmethod
    def create_vehicle(db: Session, data: VehicleCreate) -> Vehicle:
        """Create a new vehicle."""
        vehicle = Vehicle(**data.model_dump())
        db.add(vehicle)
        db.commit()
        db.refresh(vehicle)
        return vehicle
    
    @staticmethod
    def update_vehicle(
        db: Session,
        vehicle: Vehicle,
        data: VehicleUpdate
    ) -> Vehicle:
        """Update an existing vehicle."""
        update_data = data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(vehicle, field, value)
        
        db.commit()
        db.refresh(vehicle)
        return vehicle
    
    @staticmethod
    def delete_vehicle(db: Session, vehicle: Vehicle) -> None:
        """Delete a vehicle and its images."""
        db.delete(vehicle)
        db.commit()
    
    @staticmethod
    def increment_views(db: Session, vehicle: Vehicle) -> None:
        """Increment the view count for a vehicle."""
        vehicle.views_count += 1
        db.commit()
    
    @staticmethod
    def toggle_featured(db: Session, vehicle: Vehicle) -> Vehicle:
        """Toggle the featured status of a vehicle."""
        vehicle.is_featured = not vehicle.is_featured
        db.commit()
        db.refresh(vehicle)
        return vehicle
    
    @staticmethod
    def add_image(
        db: Session,
        vehicle_id: str,
        image_url: str,
        is_primary: bool = False,
        display_order: int = 0
    ) -> VehicleImage:
        """Add an image to a vehicle."""
        # If this is primary, unset other primary images
        if is_primary:
            db.query(VehicleImage).filter(
                VehicleImage.vehicle_id == vehicle_id,
                VehicleImage.is_primary == True
            ).update({"is_primary": False})
        
        image = VehicleImage(
            vehicle_id=vehicle_id,
            image_url=image_url,
            is_primary=is_primary,
            display_order=display_order
        )
        db.add(image)
        db.commit()
        db.refresh(image)
        return image
    
    @staticmethod
    def delete_image(db: Session, image_id: str) -> bool:
        """Delete a vehicle image."""
        image = db.query(VehicleImage).filter(VehicleImage.id == image_id).first()
        if image:
            db.delete(image)
            db.commit()
            return True
        return False
    
    @staticmethod
    def get_makes(db: Session) -> List[str]:
        """Get list of unique vehicle makes."""
        makes = db.query(Vehicle.make).distinct().order_by(Vehicle.make).all()
        return [m[0] for m in makes]
    
    @staticmethod
    def get_models_by_make(db: Session, make: str) -> List[str]:
        """Get list of models for a specific make."""
        models = db.query(Vehicle.model).filter(
            Vehicle.make.ilike(f"%{make}%")
        ).distinct().order_by(Vehicle.model).all()
        return [m[0] for m in models]
