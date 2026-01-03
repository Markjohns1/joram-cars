"""
Sell Requests API Endpoints

Public endpoints for submitting sell requests.
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services import SellRequestService, ImageService
from app.schemas import SellRequestCreate, SellRequestResponse, MessageResponse

router = APIRouter(prefix="/sell-requests", tags=["Sell Requests"])


from app.services.lead_service import LeadService
from app.schemas.lead import LeadCaptureRequest

@router.post("", response_model=SellRequestResponse, status_code=status.HTTP_201_CREATED)
def create_sell_request(
    data: SellRequestCreate,
    db: Session = Depends(get_db)
):
    """
    Submit a request to sell your car.
    
    After submission, you can upload images using the upload-image endpoint.
    Also automatically captures the user as a strategic lead.
    """
    # 1. Create the Sell Request
    sell_request = SellRequestService.create_sell_request(db, data)
    
    # 2. Automation: Sync with Lead Capture system
    try:
        LeadService.capture_lead(db, LeadCaptureRequest(
            name=data.customer_name,
            email=data.customer_email,
            phone=data.customer_phone,
            message=f"Wants to SELL: {data.vehicle_year} {data.vehicle_make} {data.vehicle_model}. Asking: {data.asking_price}"
        ))
    except Exception as e:
        print(f"Strategic Lead Capture failed for sell request: {e}")
        
    return sell_request


@router.post("/{request_id}/upload-image", response_model=MessageResponse)
def upload_sell_request_image(
    request_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload an image for a sell request.
    
    Supports jpg, jpeg, png, webp formats. Max size 5MB.
    """
    # Verify sell request exists
    sell_request = SellRequestService.get_sell_request_by_id(db, request_id)
    if not sell_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sell request not found"
        )
    
    # Save image
    image_url = ImageService.save_image(file, subfolder="sell-requests")
    
    # Add to database
    SellRequestService.add_image(db, request_id, image_url)
    
    return MessageResponse(message="Image uploaded successfully")
