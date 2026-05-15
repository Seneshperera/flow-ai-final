from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# For production, change this to your PostgreSQL URL
# Example: postgresql://user:password@localhost/flowpilot
SQLALCHEMY_DATABASE_URL = "sqlite:///./cloud_storage.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
