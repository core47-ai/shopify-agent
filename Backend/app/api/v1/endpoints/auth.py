from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from app.models.user_model import UserModel
from app.middleware.auth import auth_handler
from app.db.mongodb import mongodb
import logging
from typing import Optional
from passlib.context import CryptContext

logger = logging.getLogger(__name__)

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: Optional[str] = "user"  # Default role is "user"

class LoginResponse(BaseModel):
    token: str
    user_id: str
    email: str
    name: str

class SignupResponse(BaseModel):
    user_id: str
    email: str
    name: str
    role: str

@router.post("/signup", response_model=SignupResponse)
def signup(request: SignupRequest):
    try:
        logger.info(f"Signup attempt for email: {request.email}")
        user_model = UserModel(mongodb.get_database())
        
        # Check if user already exists
        existing_user = user_model.get_by_email(request.email)
        if existing_user:
            logger.warning(f"Signup failed: User already exists with email {request.email}")
            raise HTTPException(
                status_code=400,
                detail="User with this email already exists"
            )
        
        # Create new user with hashed password
        user_data = {
            "email": request.email,
            "password": pwd_context.hash(request.password),  # Hash the password
            "name": request.name,
            "role": request.role
        }
        
        new_user = user_model.create_user(user_data)
        logger.info(f"Successfully created user: {request.email}")
        
        return {
            "user_id": str(new_user["_id"]),
            "email": new_user["email"],
            "name": new_user["name"],
            "role": new_user["role"]
        }
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during signup: {str(e)}"
        )

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    try:
        logger.info(f"Login attempt for email: {request.email}")
        user_model = UserModel(mongodb.get_database())
        user = user_model.get_by_email(request.email)
        
        if not user:
            logger.warning(f"Login failed: User not found with email {request.email}")
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )
        
        # Verify hashed password
        if not pwd_context.verify(request.password, user["password"]):
            logger.warning(f"Login failed: Invalid password for email {request.email}")
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )
        
        token = auth_handler.encode_token(str(user["_id"]))
        logger.info(f"Login successful for user: {request.email}")
        
        return {
            "token": token,
            "user_id": str(user["_id"]),
            "email": user["email"],
            "name": user.get("name", "")
        }
    except HTTPException as he:
        # Re-raise HTTP exceptions as they are already properly formatted
        raise he
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred during login. Please try again later."
        )

@router.get("/verify")
def verify_token(user_id: str = Depends(auth_handler.auth_wrapper)):
    try:
        logger.info(f"Verifying token for user_id: {user_id}")
        user_model = UserModel(mongodb.get_database())
        user = user_model.get_by_id(user_id)
        
        if not user:
            logger.warning(f"Token verification failed: User not found with ID {user_id}")
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        
        logger.info(f"Token verification successful for user: {user['email']}")
        return {
            "user_id": str(user["_id"]),
            "email": user["email"],
            "name": user.get("name", ""),
            "role": user.get("role", "user")
        }
    except Exception as e:
        logger.error(f"Token verification error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during token verification: {str(e)}"
        ) 