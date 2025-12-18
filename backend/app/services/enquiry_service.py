"""
Enquiry Service

Business logic for enquiry operations.
"""

from typing import List, Optional, Tuple
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models import Enquiry, Vehicle
from app.schemas import EnquiryCreate


class EnquiryService:
    """Service class for enquiry operations."""
    
    @staticmethod
    def get_enquiries(
        db: Session,
        page: int = 1,
        limit: int = 20,
        status: Optional[str] = None,
        enquiry_type: Optional[str] = None
    ) -> Tuple[List[Enquiry], int]:
        """
        Get enquiries with filtering and pagination.
        
        Returns tuple of (enquiries, total_count).
        """
        query = db.query(Enquiry)
        
        if status:
            query = query.filter(Enquiry.status == status)
        if enquiry_type:
            query = query.filter(Enquiry.enquiry_type == enquiry_type)
        
        total = query.count()
        
        offset = (page - 1) * limit
        enquiries = query.order_by(desc(Enquiry.created_at)).offset(offset).limit(limit).all()
        
        return enquiries, total
    
    @staticmethod
    def get_enquiry_by_id(db: Session, enquiry_id: str) -> Optional[Enquiry]:
        """Get a single enquiry by ID."""
        return db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    
    @staticmethod
    def create_enquiry(db: Session, data: EnquiryCreate) -> Enquiry:
        """Create a new enquiry."""
        enquiry = Enquiry(**data.model_dump())
        db.add(enquiry)
        db.commit()
        db.refresh(enquiry)
        return enquiry
    
    @staticmethod
    def update_status(
        db: Session,
        enquiry: Enquiry,
        status: str
    ) -> Enquiry:
        """Update enquiry status."""
        enquiry.status = status
        
        if status in ["contacted", "qualified", "closed"]:
            enquiry.responded_at = datetime.utcnow()
        
        db.commit()
        db.refresh(enquiry)
        return enquiry
    
    @staticmethod
    def delete_enquiry(db: Session, enquiry: Enquiry) -> None:
        """Delete an enquiry."""
        db.delete(enquiry)
        db.commit()
    
    @staticmethod
    def get_new_enquiries_count(db: Session) -> int:
        """Get count of new enquiries."""
        return db.query(Enquiry).filter(Enquiry.status == "new").count()
    
    @staticmethod
    def get_recent_enquiries(db: Session, limit: int = 5) -> List[Enquiry]:
        """Get recent enquiries for dashboard."""
        return db.query(Enquiry).order_by(
            desc(Enquiry.created_at)
        ).limit(limit).all()
