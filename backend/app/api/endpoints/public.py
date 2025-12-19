"""
Public Stats & Newsletter Endpoints

Public utility endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db
from app.models import Vehicle, Brand, NewsletterSubscriber
from app.schemas import PublicStats, NewsletterSubscribe, MessageResponse

router = APIRouter(tags=["Public"])


@router.get("/sitemap.xml")
def get_sitemap(db: Session = Depends(get_db)):
    """Generate a dynamic XML sitemap."""
    base_url = "https://joramcars.co.ke" # Should ideally come from settings
    
    # Static pages
    static_pages = ["", "/vehicles", "/about", "/contact", "/sell"]
    
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # Add static pages
    for page in static_pages:
        xml_content += f"  <url>\n    <loc>{base_url}{page}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n"
    
    # Add dynamic vehicle pages
    vehicles = db.query(Vehicle).filter(
        Vehicle.availability_status.in_(["available", "direct_import"])
    ).all()
    
    for vehicle in vehicles:
        xml_content += f"  <url>\n    <loc>{base_url}/vehicles/{vehicle.id}</loc>\n    <lastmod>{vehicle.updated_at.date()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n"
        
    xml_content += "</urlset>"
    
    return Response(content=xml_content, media_type="application/xml")


@router.get("/stats/public", response_model=PublicStats)
def get_public_stats(db: Session = Depends(get_db)):
    """Get public statistics for homepage."""
    total_vehicles = db.query(Vehicle).count()
    vehicles_available = db.query(Vehicle).filter(
        Vehicle.availability_status.in_(["available", "direct_import"])
    ).count()
    vehicles_sold = db.query(Vehicle).filter(
        Vehicle.availability_status == "sold"
    ).count()
    total_brands = db.query(Brand).filter(Brand.is_active == True).count()
    
    return PublicStats(
        total_vehicles=total_vehicles,
        total_brands=total_brands,
        vehicles_available=vehicles_available,
        vehicles_sold=vehicles_sold
    )


@router.post("/newsletter/subscribe", response_model=MessageResponse)
def subscribe_newsletter(
    data: NewsletterSubscribe,
    db: Session = Depends(get_db)
):
    """Subscribe to newsletter."""
    # Check if already subscribed
    existing = db.query(NewsletterSubscriber).filter(
        NewsletterSubscriber.email == data.email
    ).first()
    
    if existing:
        if existing.is_active:
            return MessageResponse(message="You are already subscribed!")
        else:
            # Reactivate subscription
            existing.is_active = True
            db.commit()
            return MessageResponse(message="Your subscription has been reactivated!")
    
    # Create new subscription
    subscriber = NewsletterSubscriber(email=data.email)
    db.add(subscriber)
    db.commit()
    
    return MessageResponse(message="Thank you for subscribing!")
