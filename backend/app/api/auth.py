from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import jwt
import datetime

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

# ── Config ────────────────────────────────────────────────────────────────────
SECRET_KEY = "swdesign-umbc-seng701-secret-key"
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24

# Hardcoded admin credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

security = HTTPBearer()


# ── Schemas ───────────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Helpers ───────────────────────────────────────────────────────────────────
def create_token(username: str) -> str:
    payload = {
        "sub": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=TOKEN_EXPIRE_HOURS),
        "iat": datetime.datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username != ADMIN_USERNAME:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ── Routes ────────────────────────────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    if body.username != ADMIN_USERNAME or body.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_token(body.username)
    return TokenResponse(access_token=token)


@router.get("/verify")
def verify(username: str = Depends(verify_token)):
    return {"valid": True, "username": username}
