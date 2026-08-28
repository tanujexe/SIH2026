from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class SimulationRequest(BaseModel):
    location: str = Field("leh", description="Location weather profile identifier")
    length: float = Field(6.0, gt=0, le=50, description="Shelter length in meters")
    width: float = Field(3.0, gt=0, le=50, description="Shelter width in meters")
    height: float = Field(2.5, gt=0, le=10, description="Shelter height in meters")
    window_area: float = Field(2.0, ge=0, le=20, description="South-facing window area in m^2")
    material: str = Field("insulated", description="Material preset ID (baseline_steel, insulated, passive_pcm)")
    occupants: int = Field(2, ge=0, le=50, description="Number of human occupants")
    target_temperature: float = Field(18.0, ge=5.0, le=30.0, description="Desired indoor target temperature °C")
    ach: float = Field(0.5, ge=0.0, le=5.0, description="Air changes per hour (infiltration)")

class TimeStepResult(BaseModel):
    step: int
    hour: float
    time_str: str
    ambient_temperature: float
    indoor_temperature_unheated: float
    indoor_temperature_heated: float
    solar_gain_watts: float
    heat_loss_watts: float
    heating_power_watts: float
    pcm_state_of_charge_percent: float

class HeatLossBreakdown(BaseModel):
    roof: float
    walls: float
    floor: float
    glazing: float
    infiltration: float
    total_kwh: float
    roof_percent: float
    walls_percent: float
    floor_percent: float
    glazing_percent: float
    infiltration_percent: float

class EnergyMetrics(BaseModel):
    solar_gain_kwh: float
    total_heat_loss_kwh: float
    heating_required_kwh: float
    pcm_energy_stored_kwh: float

class ImpactMetrics(BaseModel):
    min_indoor_temp_unheated: float
    max_indoor_temp_unheated: float
    diesel_litres_per_day: float
    co2_kg_per_day: float
    daily_cost_usd: float
    fuel_savings_percent: Optional[float] = 0.0
    co2_reduction_percent: Optional[float] = 0.0

class SimulationResponse(BaseModel):
    shelter_config: Dict[str, Any]
    material_info: Dict[str, Any]
    timesteps: List[TimeStepResult]
    heat_loss: HeatLossBreakdown
    energy: EnergyMetrics
    impact: ImpactMetrics

class ComparisonResponse(BaseModel):
    baseline: SimulationResponse
    selected: SimulationResponse
    savings_diesel_litres_day: float
    savings_co2_kg_day: float
    savings_percent: float
    payback_days_estimate: float
