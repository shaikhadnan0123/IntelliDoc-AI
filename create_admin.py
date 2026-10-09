
from getpass import getpass

from sqlalchemy import select

from app.auth import hash_password
from app.database import SessionLocal
from app.models import User


EMAIL = "admin@intellidoc.local"

db = SessionLocal()

try:
    admin = db.execute(
        select(User).where(User.email == EMAIL)
    ).scalar_one_or_none()

    if admin is None:
        print(f"Admin account not found: {EMAIL}")
    else:
        password = getpass("Enter new admin password: ")
        confirm_password = getpass("Confirm new admin password: ")

        if len(password) < 12:
            print("Password must be at least 12 characters.")
        elif password != confirm_password:
            print("Passwords do not match.")
        else:
            admin.password_hash = hash_password(password)
            admin.role = "admin"
            admin.is_active = True

            db.commit()
            print("Admin password reset successfully.")
            print("Email:", admin.email)

except Exception:
    db.rollback()
    raise

finally:
    db.close()