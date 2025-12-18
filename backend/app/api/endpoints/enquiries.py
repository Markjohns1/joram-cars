"""
Enquiries API Endpoints

Public endpoint for submitting enquiries.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services import EnquiryService, VehicleService
from app.schemas import EnquiryCreate, EnquiryResponse, MessageResponse

router = APIRouter(prefix="/enquiries", tags=["Enquiries"])


@router.post("", response_model=EnquiryResponse, status_code=status.HTTP_201_CREATED)
def create_enquiry(
    data: EnquiryCreate,
    db: Session = Depends(get_db)
):
    """
    Submit an enquiry about a vehicle or general enquiry.
    
    If vehicle_id is provided, the enquiry will be linked to that vehicle.
    """
    # Validate vehicle exists if vehicle_id provided
    if data.vehicle_id:
        vehicle = VehicleService.get_vehicle_by_id(db, data.vehicle_id)
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found"
            )
    
    enquiry = EnquiryService.create_enquiry(db, data)
    
    return enquiry
