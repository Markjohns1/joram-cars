"""
Image Service

Business logic for image upload and processing.
"""

import os
import uuid
import shutil
from pathlib import Path
from typing import Optional, Tuple
from PIL import Image
from fastapi import UploadFile, HTTPException, status

from app.core.config import get_settings

settings = get_settings()


class ImageService:
    """Service class for image operations."""
    
    ALLOWED_EXTENSIONS = settings.allowed_extensions_list
    MAX_FILE_SIZE = settings.max_file_size
    UPLOAD_DIR = settings.upload_dir
    
    # Image sizes for optimization
    THUMBNAIL_SIZE = (300, 200)
    MEDIUM_SIZE = (800, 600)
    LARGE_SIZE = (1200, 900)
    
    @classmethod
    def _ensure_upload_dir(cls) -> None:
        """Ensure upload directory exists."""
        Path(cls.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    
    @classmethod
    def _validate_file(cls, file: UploadFile) -> None:
        """Validate uploaded file."""
        # Check file extension
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No filename provided"
            )
        
        ext = file.filename.split(".")[-1].lower()
        if ext not in cls.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type not allowed. Allowed: {', '.join(cls.ALLOWED_EXTENSIONS)}"
            )
        
        # Check file size
        file.file.seek(0, 2)  # Seek to end
        size = file.file.tell()
        file.file.seek(0)  # Reset to beginning
        
        if size > cls.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File too large. Maximum size: {cls.MAX_FILE_SIZE / 1024 / 1024}MB"
            )
    
    @classmethod
    def _generate_filename(cls, original_filename: str) -> str:
        """Generate a unique filename."""
        ext = original_filename.split(".")[-1].lower()
        return f"{uuid.uuid4()}.{ext}"
    
    @classmethod
    def save_image(
        cls,
        file: UploadFile,
        subfolder: str = "vehicles"
    ) -> str:
        """
        Save an uploaded image.
        
        Returns the relative path to the saved image.
        """
        cls._ensure_upload_dir()
        cls._validate_file(file)
        
        # Create subfolder
        folder_path = Path(cls.UPLOAD_DIR) / subfolder
        folder_path.mkdir(parents=True, exist_ok=True)
        
        # Generate unique filename
        filename = cls._generate_filename(file.filename or "image.jpg")
        file_path = folder_path / filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Optimize image
        cls._optimize_image(str(file_path))
        
        # Return relative path for URL
        return f"/{cls.UPLOAD_DIR}/{subfolder}/{filename}"
    
    @classmethod
    def _optimize_image(cls, file_path: str) -> None:
        """Optimize an image for web delivery."""
        try:
            with Image.open(file_path) as img:
                # Convert to RGB if necessary
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                
                # Resize if too large
                if img.size[0] > cls.LARGE_SIZE[0] or img.size[1] > cls.LARGE_SIZE[1]:
                    img.thumbnail(cls.LARGE_SIZE, Image.Resampling.LANCZOS)
                
                # Save with optimization
                img.save(
                    file_path,
                    optimize=True,
                    quality=85
                )
        except Exception as e:
            # If optimization fails, keep original
            print(f"Image optimization failed: {e}")
    
    @classmethod
    def delete_image(cls, image_url: str) -> bool:
        """Delete an image file."""
        try:
            # Convert URL path to file path
            if image_url.startswith("/"):
                image_url = image_url[1:]
            
            file_path = Path(image_url)
            
            if file_path.exists():
                file_path.unlink()
                return True
            return False
        except Exception:
            return False
    
    @classmethod
    def get_image_url(cls, filename: str, subfolder: str = "vehicles") -> str:
        """Get the URL for an image."""
        return f"/{cls.UPLOAD_DIR}/{subfolder}/{filename}"
