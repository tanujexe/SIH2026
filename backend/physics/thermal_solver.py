from typing import Dict, Any, List
from backend.weather.leh import generate_leh_weather_profile
from backend.models.materials import get_material_preset
from backend.physics.heat_loss import calculate_geometry, calculate_heat_loss_components
from backend.physics.solar_gain import calculate_solar_gain
from backend.physics.pcm import PCMModel
from backend.physics.energy import calculate_diesel_and_emissions
from backend.config import OCCUPANT_SENSIBLE_HEAT

def run_transient_thermal_simulation(req: Dict[str, Any]) -> Dict[str, Any]:
    """
    Core numerical solver for 24-hour transient thermal dynamics.
    Calculates indoor temperature, component heat loss breakdown,
    heating energy needed to maintain target setpoint, diesel fuel, and CO2 footprint.
    """
    location = req.get("location", "leh")
    length = float(req.get("length", 6.0))
    width = float(req.get("width", 3.0))
    height = float(req.get("height", 2.5))
    window_area = float(req.get("window_area", 2.0))
    material_id = req.get("material", "insulated")
    occupants = int(req.get("occupants", 2))
    target_temp = float(req.get("target_temperature", 18.0))
    ach = float(req.get("ach", 0.5))
    
    # 1. Load Material Properties & Geometry
    mat = get_material_preset(material_id)
    geom = calculate_geometry(length, width, height, window_area)
    
    # 2. Lumped Effective Thermal Capacitance (J/K)
    total_surface_area = geom["roof_area"] + geom["floor_area"] + geom["total_wall_area"]
    cap_per_m2 = mat.get("thermal_capacitance_per_m2", 45000.0)
    c_eff = max(100000.0, total_surface_area * cap_per_m2)
    
    # 3. Load Weather Profile (5-minute timesteps = 288 steps over 24h)
    time_step_min = 5
    delta_t_sec = time_step_min * 60.0
    weather_data = generate_leh_weather_profile(time_step_minutes=time_step_min)
    
    # Initialize state variables
    # Start indoor temp near average initial ambient + internal baseline boost
    initial_ambient = weather_data[0]["ambient_temperature"]
    t_in_unheated = initial_ambient + 3.0
    t_in_heated = target_temp
    
    pcm = PCMModel(mat)
    
    timesteps_results = []
    
    # Heat loss aggregators (Watt-seconds -> kWh)
    total_roof_ws = 0.0
    total_walls_ws = 0.0
    total_floor_ws = 0.0
    total_glazing_ws = 0.0
    total_infil_ws = 0.0
    
    total_solar_gain_ws = 0.0
    total_heating_required_ws = 0.0
    
    q_internal = occupants * OCCUPANT_SENSIBLE_HEAT  # Watts
    
    min_unheated = 100.0
    max_unheated = -100.0
    
    for step in weather_data:
        t_amb = step["ambient_temperature"]
        irr = step["solar_irradiance"]
        
        # --- A. Unheated Simulation Track ---
        # 1. Solar gain
        q_solar = calculate_solar_gain(irr, geom["window_area"], mat["window_shgc"])
        
        # 2. Heat Loss at current t_in_unheated
        hl_unheated = calculate_heat_loss_components(t_in_unheated, t_amb, geom, mat, ach)
        q_loss_unheated = hl_unheated["total_q_loss"]
        
        # 3. PCM Exchange
        q_net_raw = q_solar + q_internal - q_loss_unheated
        q_pcm, soc_percent = pcm.update(t_in_unheated, delta_t_sec, q_net_raw)
        
        # 4. Net differential energy balance
        q_net_unheated = q_solar + q_internal - q_loss_unheated - q_pcm
        dt_unheated = (q_net_unheated / c_eff) * delta_t_sec
        t_in_unheated += dt_unheated
        
        min_unheated = min(min_unheated, t_in_unheated)
        max_unheated = max(max_unheated, t_in_unheated)
        
        # --- B. Heated Simulation Track (Maintain Target Temp) ---
        # Heat loss at target temperature
        hl_heated = calculate_heat_loss_components(target_temp, t_amb, geom, mat, ach)
        q_loss_heated = hl_heated["total_q_loss"]
        
        # Heating power required (Watts)
        q_net_demand = q_loss_heated - (q_solar + q_internal)
        q_heating = max(0.0, q_net_demand)
        t_in_heated = target_temp if q_heating > 0 else (target_temp + max(0.0, -q_net_demand * 0.0001))
        
        # Accumulate component losses & energy
        total_roof_ws += hl_heated["q_roof"] * delta_t_sec
        total_walls_ws += hl_heated["q_walls"] * delta_t_sec
        total_floor_ws += hl_heated["q_floor"] * delta_t_sec
        total_glazing_ws += hl_heated["q_glazing"] * delta_t_sec
        total_infil_ws += hl_heated["q_infil"] * delta_t_sec
        
        total_solar_gain_ws += q_solar * delta_t_sec
        total_heating_required_ws += q_heating * delta_t_sec
        
        timesteps_results.append({
            "step": step["step"],
            "hour": step["hour"],
            "time_str": step["time_str"],
            "ambient_temperature": round(t_amb, 2),
            "indoor_temperature_unheated": round(t_in_unheated, 2),
            "indoor_temperature_heated": round(t_in_heated, 2),
            "solar_gain_watts": round(q_solar, 1),
            "heat_loss_watts": round(q_loss_heated, 1),
            "heating_power_watts": round(q_heating, 1),
            "pcm_state_of_charge_percent": soc_percent
        })
        
    # Conversions to kWh
    ws_to_kwh = 1.0 / 3600000.0
    roof_kwh = total_roof_ws * ws_to_kwh
    walls_kwh = total_walls_ws * ws_to_kwh
    floor_kwh = total_floor_ws * ws_to_kwh
    glazing_kwh = total_glazing_ws * ws_to_kwh
    infil_kwh = total_infil_ws * ws_to_kwh
    total_loss_kwh = roof_kwh + walls_kwh + floor_kwh + glazing_kwh + infil_kwh
    
    solar_kwh = total_solar_gain_ws * ws_to_kwh
    heating_kwh = total_heating_required_ws * ws_to_kwh
    
    total_loss_nonzero = max(0.001, total_loss_kwh)
    
    heat_loss_breakdown = {
        "roof": round(roof_kwh, 2),
        "walls": round(walls_kwh, 2),
        "floor": round(floor_kwh, 2),
        "glazing": round(glazing_kwh, 2),
        "infiltration": round(infil_kwh, 2),
        "total_kwh": round(total_loss_kwh, 2),
        "roof_percent": round((roof_kwh / total_loss_nonzero) * 100.0, 1),
        "walls_percent": round((walls_kwh / total_loss_nonzero) * 100.0, 1),
        "floor_percent": round((floor_kwh / total_loss_nonzero) * 100.0, 1),
        "glazing_percent": round((glazing_kwh / total_loss_nonzero) * 100.0, 1),
        "infiltration_percent": round((infil_kwh / total_loss_nonzero) * 100.0, 1)
    }
    
    impact = calculate_diesel_and_emissions(heating_kwh)
    impact["min_indoor_temp_unheated"] = round(min_unheated, 1)
    impact["max_indoor_temp_unheated"] = round(max_unheated, 1)
    
    energy_metrics = {
        "solar_gain_kwh": round(solar_kwh, 2),
        "total_heat_loss_kwh": round(total_loss_kwh, 2),
        "heating_required_kwh": round(heating_kwh, 2),
        "pcm_energy_stored_kwh": round((pcm.capacity_j * ws_to_kwh) if pcm.enabled else 0.0, 2)
    }
    
    return {
        "shelter_config": {
            "location": location,
            "length": length,
            "width": width,
            "height": height,
            "window_area": window_area,
            "material": material_id,
            "occupants": occupants,
            "target_temperature": target_temp,
            "ach": ach,
            "geometry": geom
        },
        "material_info": mat,
        "timesteps": timesteps_results,
        "heat_loss": heat_loss_breakdown,
        "energy": energy_metrics,
        "impact": impact
    }
