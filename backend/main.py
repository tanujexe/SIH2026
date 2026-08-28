from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.simulation import router as simulation_router

app = FastAPI(
    title="Thermal Shelter Simulation & Optimization API",
    description="Backend physics solver and ANSYS validation engine for extreme-cold military shelter design (Leh, Ladakh).",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows local dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(simulation_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "DRDO Thermal Shelter Simulation & Optimization Platform",
        "location": "Leh, Ladakh",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
