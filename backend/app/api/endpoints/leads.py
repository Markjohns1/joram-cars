from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.lead import LeadCaptureRequest, LeadCaptureResponse
from app.services.lead_service import LeadService
from app.services import EnquiryService
from app.schemas import EnquiryCreate

router = APIRouter(prefix="/leads", tags=["Leads"])

@router.post("/capture", response_model=LeadCaptureResponse)
def capture_lead(
    data: LeadCaptureRequest,
    db: Session = Depends(get_db)
):
    """
    Capture lead info during checkout/enquiry.
    Implicitly creates a user account if one doesn't exist.
    """
    # 1. Capture/Create User
    result = LeadService.capture_lead(db, data)
    user = result["user"]
    is_new = result["is_new_user"]
    
    # 2. Record the Enquiry (Internal Record)
    # We create an enquiry record linked to this user/vehicle
    try:
        enquiry_data = EnquiryCreate(
            customer_name=data.name,
            customer_email=data.email or "",
            customer_phone=data.phone,
            enquiry_type="purchase_request",
            message=data.message or f"Interested in vehicle {data.vehicle_id}"
        )
        # Note: If EnquiriesService supports linking to User ID, we should update it.
        # For now, basic enquiry logging.
        EnquiryService.create_enquiry(db, enquiry_data)
    except Exception as e:
        print(f"Failed to log enquiry: {e}") 
        # Non-blocking, we still return success to user
    
    # 3. Construct WhatsApp Link (Frontend can also do this, 
    # but backend can return a signed/tracked link if needed)
    # For now, we return success and let frontend handle redirection.
    
    return LeadCaptureResponse(
        message="Lead captured successfully",
        user_id=user.id,
        is_new_user=is_new,
        whatsapp_link="" # Frontend handles this
    )
