from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.core import security
from app.models.user import User
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserRead
from app.crud.user import get_user_by_email, create_user

router = APIRouter()

@router.post("/login/access-token", response_model=Token)
async def login_access_token(
    db: AsyncSession = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> dict:
    """
    AUTHENTICATION FLOW - STEP 2 (Credential Verification & Token Generation)
    1. Receives standard form-urlencoded parameters (username, password).
    2. Queries Database for the user by email (username).
    3. Compares incoming plaintext password against hashed password using bcrypt.
    4. Issues a signed JWT with expiration and type "bearer".
    """
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()

    # Verify if user exists and bcrypt hashed passwords match
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Inactive user account"
        )

    # Issue access token
    return {
        "access_token": security.create_access_token(user.id),
        "token_type": "bearer"
    }

@router.post("/register", response_model=UserRead)
async def register_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(deps.get_db),
):
    """
    AUTHENTICATION FLOW - STEP 1 (User Registration)
    1. Checks if username (email) already exists in database.
    2. Hashes user password with bcrypt in the service layer.
    3. Persists record to DB.
    """
    user = await get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system",
        )
    # create_user will handle hashing in app/crud/user.py
    user = await create_user(db, user_in)
    return user
