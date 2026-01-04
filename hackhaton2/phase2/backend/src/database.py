
from sqlmodel import create_engine, Session
import os

engine = None

def init_db():
    global engine
    DATABASE_URL = os.environ.get("DATABASE_URL")
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is not set")
    engine = create_engine(DATABASE_URL, echo=True)

def get_engine():
    if engine is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    return engine

def get_session():
    with Session(get_engine()) as session:
        yield session
