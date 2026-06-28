import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    APP_NAME = os.getenv("APP_NAME", "FORTNITE_SPIRITS")
    APP_ENV = os.getenv("APP_ENV", "development")
    BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
    DATABASE_URL = os.getenv("DATABASE_URL")
    
settings = Settings()