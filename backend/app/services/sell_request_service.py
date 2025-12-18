"""
Sell Request Service

Business logic for sell request operations.
"""

from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models import SellRequest, SellRequestImage
from app.schemas import SellRequestCreate


class SellRequestService:
    """Service class for sell request operations."""
    
    @staticmethod
    def get_sell_requests(
        db: Session,
        page: int = 1,
        limit: int = 20,
        status: Optional[str] = None
    ) -> Tuple[List[SellRequest], int]:
        """
        Get sell requests with filtering and pagination.
        
        Returns tuple of (sell_requests, total_count).
        """
        query = db.query(SellRequest)
        
        if status:
            query = query.filter(SellRequest.status == status)
        
        total = query.count()
        
        offset = (page - 1) * limit
        requests = query.order_by(desc(SellRequest.created_at)).offset(offset).limit(limit).all()
        
        return requests, total
    
    @staticmethod
    def get_sell_request_by_id(db: Session, request_id: str) -> Optional[SellRequest]:
        """Get a single sell request by ID."""
        return db.query(SellRequest).filter(SellRequest.id == request_id).first()
    
    @staticmethod
    def create_sell_request(db: Session, data: SellRequestCreate) -> SellRequest:
        """Create a new sell request."""
        sell_request = SellRequest(**data.model_dump())
        db.add(sell_request)
        db.commit()
        db.refresh(sell_request)
        return sell_request
    
    @staticmethod
    def update_status(
        db: Session,
        sell_request: SellRequest,
        status: str
    ) -> SellRequest:
        """Update sell request status."""
        sell_request.status = status
        db.commit()
        db.refresh(sell_request)
        return sell_request
    
    @staticmethod
    def add_valuation(
        db: Session,
        sell_request: SellRequest,
        amount: float
    ) -> SellRequest:
        """Add valuation to a sell request."""
        sell_request.valuation_amount = amount
        sell_request.status = "valued"
        db.commit()
        db.refresh(sell_request)
        return sell_request
    
    @staticmethod
    def delete_sell_request(db: Session, sell_request: SellRequest) -> None:
        """Delete a sell request."""
        db.delete(sell_request)
        db.commit()
    
    @staticmethod
    def add_image(
        db: Session,
        request_id: str,
        image_url: str
    ) -> SellRequestImage:
        """Add an image to a sell request."""
        image = SellRequestImage(
            sell_request_id=request_id,
            image_url=image_url
        )
        db.add(image)
        db.commit()
        db.refresh(image)
        return image
    
    @staticmethod
    def get_pending_count(db: Session) -> int:
        """Get count of pending sell requests."""
        return db.query(SellRequest).filter(SellRequest.status == "pending").count()
