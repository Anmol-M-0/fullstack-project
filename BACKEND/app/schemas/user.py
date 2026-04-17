from pydantic import BaseModel, EmailStr, ConfigDict

class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    is_superuser: bool
    
    # Allows Pydantic to read from SQLAlchemy ORM objects
    model_config = ConfigDict(from_attributes=True)
