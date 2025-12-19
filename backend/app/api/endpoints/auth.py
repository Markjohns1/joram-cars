"""
Authentication API Endpoints

Login and token management for admin users.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services import AuthService
from app.schemas import LoginRequest, TokenResponse, MessageResponse, UserProfileUpdate, UserResponse
from app.api.deps import get_current_user
from app.models import User
from app.core.security import get_password_hash

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


@router.put("/profile", response_model=UserResponse)
def update_profile(
    data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile (self-service).
    Allows changing password if provided.
    """
    # Verify email uniqueness if changing
    if data.email and data.email != current_user.email:
        if AuthService.get_user_by_email(db, data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
            
    # Verify username uniqueness if changing
    if data.username and data.username != current_user.username:
        if AuthService.get_user_by_username(db, data.username):
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already in use"
            )

    # Update fields
    if data.full_name:
        current_user.full_name = data.full_name
    if data.email:
        current_user.email = data.email
    if data.username:
        current_user.username = data.username
    
    # Update password if provided
    if data.password:
        current_user.hashed_password = get_password_hash(data.password)
        
    db.commit()
    db.refresh(current_user)
    
    return current_user
