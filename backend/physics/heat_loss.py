from typing import Dict, Any
from backend.config import AIR_DENSITY_LEH, AIR_SPECIFIC_HEAT

def calculate_geometry(length: float, width: float, height: float, window_area: float) -> Dict[str, float]:
    """
    Computes geometric properties of shelter.
    """
    floor_area = length * width
    roof_area = length * width
    total_wall_area = 2.0 * (length * height) + 2.0 * (width * height)
    
    # Ensure window area does not exceed total wall area (safety check)
    window_area_clamped = min(window_area, total_wall_area * 0.4)
    net_wall_area = total_wall_area - window_area_clamped
    volume = length * width * height
    
    return {
        "floor_area": floor_area,
        "roof_area": roof_area,
        "total_wall_area": total_wall_area,
        "net_wall_area": net_wall_area,
        "window_area": window_area_clamped,
        "volume": volume
    }

def calculate_heat_loss_components(
    t_in: float,
    t_amb: float,
    geom: Dict[str, float],
    mat: Dict[str, Any],
    ach: float = 0.5
) -> Dict[str, float]:
    """
    Calculates instant heat loss breakdown (Watts) for each building component:
    - Roof
    - Net Walls
    - Floor
    - Glazing/Window
    - Infiltration
    
    Q_component = U_component * Area * (T_in - T_amb)
    Q_infil = (ACH * Volume / 3600) * Air_Density * Air_Cp * (T_in - T_amb)
    """
    delta_t = t_in - t_amb
    
    q_roof = max(0.0, mat["roof_u_value"] * geom["roof_area"] * delta_t)
    q_walls = max(0.0, mat["wall_u_value"] * geom["net_wall_area"] * delta_t)
    q_floor = max(0.0, mat["floor_u_value"] * geom["floor_area"] * delta_t)
    q_glazing = max(0.0, mat["window_u_value"] * geom["window_area"] * delta_t)
    
    # Infiltration mass flow rate
    volume_flow = (ach * geom["volume"]) / 3600.0  # m^3/s
    mass_flow = volume_flow * AIR_DENSITY_LEH  # kg/s
    q_infil = max(0.0, mass_flow * AIR_SPECIFIC_HEAT * delta_t)
    
    total_q_loss = q_roof + q_walls + q_floor + q_glazing + q_infil
    
    return {
        "q_roof": q_roof,
        "q_walls": q_walls,
        "q_floor": q_floor,
        "q_glazing": q_glazing,
        "q_infil": q_infil,
        "total_q_loss": total_q_loss
    }
