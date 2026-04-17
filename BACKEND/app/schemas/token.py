from pydantic import BaseModel

class Token(BaseModel):
    """
    Schema for the token response returned to the client after a successful login.
    Standard OAuth2 expects 'access_token' and 'token_type'.
    """
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    """
    Schema for validating the JWT payload once decoded. 
    'sub' represents the subject (in our case, the user ID).
    """
    sub: str | None = None
