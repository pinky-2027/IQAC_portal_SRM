from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import user

# This creates all tables defined in your models
Base.metadata.create_all(bind=engine)

app = FastAPI(title="IQAC Portal API")

# Configure CORS for the React frontend (running on Vite's default port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "FastAPI is running"}
