from sqlalchemy.orm import Session
from app.models import User
from app.schemas.lead import LeadCaptureRequest
from app.core.security import get_password_hash
from app.services.auth_service import AuthService
import uuid
import random
import string

class LeadService:
    @staticmethod
    def capture_lead(db: Session, data: LeadCaptureRequest) -> dict:
        """
        Capture a lead, implicitly creating a user if they don't exist.
        Returns dict with user_id and is_new_user status.
        """
        # 1. Check if user exists by Phone (Primary) or Email
        existing_user = db.query(User).filter(User.username == data.phone).first()
        if not existing_user and data.email:
             existing_user = db.query(User).filter(User.email == data.email).first()
        
        is_new_user = False
        user = existing_user
        
        if not user:
            # 2. Create new user implicitly
            is_new_user = True
            
            # Generate random password (they can reset it later)
            random_pwd = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
            
            user = User(
                username=data.phone, # Use phone as unique username
                email=data.email or f"{data.phone}@placeholder.com", # Fallback email if none provided
                hashed_password=get_password_hash(random_pwd),
                full_name=data.name,
                role="user",
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
        # 3. Log the "Enquiry" (Lead) - reused logic or new table?
        # For now, we assume the frontend sends the WhatsApp message directly.
        # Ideally, we should save this to an 'Enquiry' table linked to user.
        # We will reuse the EnquiryService for this in the endpoint.
        
        return {
            "user": user,
            "is_new_user": is_new_user
        }
