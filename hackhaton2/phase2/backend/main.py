from fastapi import FastAPI
import os
from jose import jwt
from src.database import get_session, init_db # Import get_session and init_db
from src.middleware.error_handler import ErrorHandlerMiddleware # Import ErrorHandlerMiddleware
from src.api import auth # Import the auth router
from src.api import tasks # Import the tasks router
import logging
from dotenv import load_dotenv

load_dotenv()

# Check for required environment variables
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

SECRET_KEY = os.environ.get("BETTER_AUTH_SECRET")
if not SECRET_KEY:
    raise ValueError("BETTER_AUTH_SECRET environment variable is not set")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("backend.log"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(ErrorHandlerMiddleware) # Add the error handling middleware

# Configuration for JWT
ALGORITHM = "HS256"

def create_jwt_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

app.include_router(auth.router, prefix="/api") # Include the auth router
app.include_router(tasks.router, prefix="/api") # Include the tasks router

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up the application.")
    init_db()

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down the application.")

@app.get("/")
async def root():
    logger.info("Root endpoint accessed.")
    return {"message": "Todo Full-Stack API is running!"}