from app.database import engine, Base
from app.models import User, Document

Base.metadata.create_all(bind=engine)

print("Database tables created successfully.")