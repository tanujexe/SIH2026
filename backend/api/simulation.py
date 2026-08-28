from fastapi import APIRouter, HTTPException, status
from backend.models.schemas import SimulationRequest, SimulationResponse, ComparisonResponse
from backend.physics.thermal_solver import run_transient_thermal_simulation
from backend.ansys.verification import run_ansys_verification_workflow
from backend.weather.leh import generate_leh_weather_profile

router = APIRouter(prefix="/api", tags=["Thermal Simulation"])

@router.post("/simulate", response_model=SimulationResponse)
def simulate_shelter(req: SimulationRequest):
    """
    Runs a 24-hour transient thermal simulation for configured shelter.
    Returns timestep temperature series, heat loss breakdown, energy requirements, and diesel/CO2 footprint.
    """
    try:
        # Validate window area does not exceed wall area
        total_wall_area = 2.0 * (req.length * req.height) + 2.0 * (req.width * req.height)
        if req.window_area > (total_wall_area * 0.5):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Window area ({req.window_area}m²) cannot exceed 50% of wall area ({total_wall_area:.1f}m²)"
            )
            
        res = run_transient_thermal_simulation(req.model_dump())
        return res
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compare")
def compare_shelters(req: SimulationRequest):
    """
    Compares the user's selected shelter configuration against the Baseline Steel Shelter.
    Computes exact Liters of Diesel saved/day, CO2 reduction/day, and fuel savings %.
    """
    try:
        # 1. Run Baseline Steel Simulation
        baseline_req = req.model_dump()
        baseline_req["material"] = "baseline_steel"
        baseline_res = run_transient_thermal_simulation(baseline_req)
        
        # 2. Run Selected Design Simulation
        selected_res = run_transient_thermal_simulation(req.model_dump())
        
        b_diesel = baseline_res["impact"]["diesel_litres_per_day"]
        s_diesel = selected_res["impact"]["diesel_litres_per_day"]
        
        b_co2 = baseline_res["impact"]["co2_kg_per_day"]
        s_co2 = selected_res["impact"]["co2_kg_per_day"]
        
        savings_diesel = max(0.0, b_diesel - s_diesel)
        savings_co2 = max(0.0, b_co2 - s_co2)
        savings_pct = (savings_diesel / max(0.001, b_diesel)) * 100.0 if b_diesel > 0 else 0.0
        
        # Compute savings % into impact
        selected_res["impact"]["fuel_savings_percent"] = round(savings_pct, 1)
        selected_res["impact"]["co2_reduction_percent"] = round(savings_pct, 1)
        
        return {
            "baseline": baseline_res,
            "selected": selected_res,
            "savings_diesel_litres_day": round(savings_diesel, 2),
            "savings_co2_kg_day": round(savings_co2, 2),
            "savings_percent": round(savings_pct, 1),
            "monthly_diesel_saved_litres": round(savings_diesel * 30.0, 1),
            "monthly_cost_saved_usd": round(savings_diesel * 30.0 * 1.25, 1)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/validate-ansys")
def validate_with_ansys(req: SimulationRequest):
    """
    Generates PyANSYS script & FEA mesh validation results comparing Rapid Engine vs ANSYS.
    """
    try:
        rapid_res = run_transient_thermal_simulation(req.model_dump())
        ansys_res = run_ansys_verification_workflow(
            config=rapid_res["shelter_config"],
            material=rapid_res["material_info"],
            rapid_results=rapid_res
        )
        return ansys_res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/weather/leh")
def get_leh_weather():
    """
    Returns 24-hour winter weather profile for Leh, Ladakh.
    """
    return generate_leh_weather_profile(time_step_minutes=15)
