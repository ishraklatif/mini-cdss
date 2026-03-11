from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.api.v1.endpoints import patients, observations, medications, alerts, risk_score

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title       = settings.APP_NAME,
    version     = settings.APP_VERSION,
    description = "CDSS Backend API — FHIR R4 compliant clinical decision support",
    docs_url    = "/docs",
    redoc_url   = "/redoc",
)

# CORS — allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins     = settings.cors_origins_list,
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# Routers
app.include_router(patients.router,    prefix="/api/v1/patients",  tags=["Patients"])
app.include_router(observations.router,prefix="/api/v1/patients",  tags=["Observations"])
app.include_router(medications.router, prefix="/api/v1/patients",  tags=["Medications"])
app.include_router(alerts.router,      prefix="/api/v1/patients",  tags=["Alerts"])
app.include_router(risk_score.router,  prefix="/api/v1/patients",  tags=["Risk Score"])

@app.get("/")
def root():
    return {
        "app":     settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status":  "running",
        "docs":    "/docs",
        "fhir":    settings.FHIR_SERVER_URL,
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

