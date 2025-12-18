"""
Auth Service

Business logic for authentication operations.
"""

from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Session

from app.models import User
from app.core.security import verify_password, get_password_hash, create_access_token
from app.schemas import UserCreate, TokenResponse, UserResponse


class AuthService:
    """Service class for authentication operations."""
    
    @staticmethod
    def authenticate_user(
        db: Session,
        email: str,
        password: str
    ) -> Optional[User]:
        """
        Authenticate a user by email and password.
        
        Returns user if valid, None otherwise.
        """
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            return None
        
        if not verify_password(password, user.hashed_password):
            return None
        
        if not user.is_active:
            return None
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.commit()
        
        return user
    
    @staticmethod
    def create_token(user: User) -> TokenResponse:
        """Create an access token for a user."""
        token_data = {
            "user_id": user.id,
            "email": user.email,
            "role": user.role
        }
        
        access_token = create_access_token(token_data)
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )
    
    @staticmethod
    def create_user(db: Session, data: UserCreate) -> User:
        """Create a new user."""
        hashed_password = get_password_hash(data.password)
        
        user = User(
            username=data.username,
            email=data.email,
            hashed_password=hashed_password,
            full_name=data.full_name,
            role=data.role
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get a user by email."""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[User]:
        """Get a user by username."""
        return db.query(User).filter(User.username == username).first()
    
    @staticmethod
    def user_exists(db: Session, email: str, username: str) -> bool:
        """Check if a user with given email or username exists."""
        return db.query(User).filter(
            (User.email == email) | (User.username == username)
        ).first() is not None
