from typing import Optional
from pydantic import BaseModel, EmailStr

class LeadCaptureRequest(BaseModel):
    """Schema for capturing a lead/user during checkout."""
    name: str
    phone: str
    email: Optional[EmailStr] = None
    vehicle_id: str
    message: Optional[str] = None
    
class LeadCaptureResponse(BaseModel):
    """Response after capturing lead."""
    message: str
    user_id: str
    is_new_user: bool
    whatsapp_link: str
