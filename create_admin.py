from getpass import getpass

from app.auth import hash_password
from app.database import SessionLocal
from app.models import User


db = SessionLocal()

try:
    email = input("Admin email: ").strip()
    password = getpass("Admin password: ")

    admin = User(
        email=email,
        password_hash=hash_password(password),
        role="admin",
        is_active=True
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    print("Admin created successfully")
    print("ID:", admin.id)
    print("Email:", admin.email)
    print("Role:", admin.role)

except Exception:
    db.rollback()
    raise

finally:
    db.close()