from backend.config import (
    DIESEL_ENERGY_DENSITY_KWH,
    HEATER_EFFICIENCY,
    DIESEL_EMISSION_FACTOR,
    DIESEL_COST_PER_LITER
)

def calculate_diesel_and_emissions(heating_required_kwh: float) -> dict:
    """
    Computes required diesel fuel in Liters, CO2 emissions in kg, and operating cost.
    
    Fuel (Liters) = Heating_Required (kWh) / (Diesel_Energy_Density (kWh/L) * Efficiency)
    CO2 (kg) = Fuel (Liters) * Emission_Factor (kg CO2 / L)
    Cost ($) = Fuel (Liters) * Diesel_Price ($/L)
    """
    if heating_required_kwh <= 0:
        return {
            "diesel_litres_per_day": 0.0,
            "co2_kg_per_day": 0.0,
            "daily_cost_usd": 0.0
        }
        
    effective_energy_per_liter = DIESEL_ENERGY_DENSITY_KWH * HEATER_EFFICIENCY # ~8.97 kWh/L
    diesel_litres = heating_required_kwh / effective_energy_per_liter
    co2_kg = diesel_litres * DIESEL_EMISSION_FACTOR
    cost_usd = diesel_litres * DIESEL_COST_PER_LITER
    
    return {
        "diesel_litres_per_day": round(diesel_litres, 2),
        "co2_kg_per_day": round(co2_kg, 2),
        "daily_cost_usd": round(cost_usd, 2)
    }
