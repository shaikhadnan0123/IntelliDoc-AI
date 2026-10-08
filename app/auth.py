import os
from dotenv import load_dotenv

from datetime import datetime, timedelta, timezone

from argon2 import PasswordHasher
from jose import JWTError, jwt
load_dotenv()

# ===============================
# PASSWORD HASHING
# ===============================

password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(
    password: str,
    password_hash: str
) -> bool:

    try:
        return password_hasher.verify(
            password_hash,
            password
        )
    except Exception:
        return False


# ===============================
# JWT
# ===============================

SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY is not configured")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def create_access_token(
    user_id: int,
    email: str,
    role: str
) -> str:

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "email": email,
        "role": role,
        "exp": expire
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def decode_access_token(token: str) -> dict:

    try:
        return jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

    except JWTError:
        raise ValueError("Invalid or expired token")