"""
Database Configuration Module

Handles database connection, session management, and base model.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import get_settings

settings = get_settings()

# Create database engine
# connect_args is needed only for SQLite to allow multi-threading
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {},
    echo=False  # Set to True for SQL debugging
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for all models
Base = declarative_base()


def get_db():
    """
    Database session dependency.
    
    Yields a database session and ensures it's closed after use.
    Usage: Depends(get_db) in route functions.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initialize database tables.
    
    Creates all tables defined in models if they don't exist.
    """
    Base.metadata.create_all(bind=engine)
