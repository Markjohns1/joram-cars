"""
Brands API Endpoints

Public endpoints for fetching brands.
"""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import asc

from app.core.database import get_db
from app.models import Brand
from app.schemas import BrandResponse

router = APIRouter(prefix="/brands", tags=["Brands"])


@router.get("", response_model=List[BrandResponse])
def list_brands(db: Session = Depends(get_db)):
    """Get all active brands ordered by display order."""
    brands = db.query(Brand).filter(
        Brand.is_active == True
    ).order_by(asc(Brand.display_order), asc(Brand.name)).all()
    
    return brands
