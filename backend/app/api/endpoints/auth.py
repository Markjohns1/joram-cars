"""
Authentication API Endpoints

Login and token management for admin users.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services import AuthService
from app.schemas import LoginRequest, TokenResponse, MessageResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Authenticate admin user and get access token.
    
    Returns JWT token for accessing protected endpoints.
    """
    user = AuthService.authenticate_user(db, data.email, data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return AuthService.create_token(user)


@router.post("/logout", response_model=MessageResponse)
def logout():
    """
    Logout (client-side token removal).
    
    JWT tokens are stateless, so logout is handled client-side
    by removing the stored token.
    """
    return MessageResponse(message="Logged out successfully")
