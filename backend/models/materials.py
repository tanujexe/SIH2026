from typing import Dict, Any

MATERIAL_PRESETS: Dict[str, Dict[str, Any]] = {
    "baseline_steel": {
        "id": "baseline_steel",
        "name": "Baseline Steel Bunk",
        "description": "Corrugated galvanized steel single-skin shelter with minimal insulation (typical uninsulated temporary field barracks).",
        "wall_u_value": 5.8,      # W/(m^2*K) - Single galvanized steel + minimal air gap
        "roof_u_value": 6.2,      # W/(m^2*K) - Corrugated metal roof
        "floor_u_value": 3.5,     # W/(m^2*K) - Plywood on raised metal frame on ground
        "window_u_value": 5.8,    # W/(m^2*K) - Single pane glass window
        "window_shgc": 0.85,      # Solar Heat Gain Coefficient
        "thermal_capacitance_per_m2": 25000.0, # J/(m^2*K) effective thermal mass
        "pcm_enabled": False,
        "pcm_capacity_j": 0.0,
        "pcm_melt_temp": 18.0
    },
    "insulated": {
        "id": "insulated",
        "name": "Insulated Shelter (PUF/EPS)",
        "description": "50mm Polyurethane Foam (PUF) / Expanded Polystyrene (EPS) modular sandwich panel shelter.",
        "wall_u_value": 0.42,     # W/(m^2*K) - 50mm PUF panel (k = 0.022 W/mK)
        "roof_u_value": 0.35,     # W/(m^2*K) - 75mm PUF insulated roof
        "floor_u_value": 0.50,    # W/(m^2*K) - Insulated wooden floor platform
        "window_u_value": 2.8,    # W/(m^2*K) - Double pane low-E window
        "window_shgc": 0.70,      # High solar gain double glazing
        "thermal_capacitance_per_m2": 45000.0, # J/(m^2*K)
        "pcm_enabled": False,
        "pcm_capacity_j": 0.0,
        "pcm_melt_temp": 18.0
    },
    "passive_pcm": {
        "id": "passive_pcm",
        "name": "Passive Solar + PCM Shelter",
        "description": "High-performance shelter combining 80mm PUF insulation, south-facing solar gain window, and Phase Change Material (Bio-PCM ~18°C) thermal wallboard.",
        "wall_u_value": 0.28,     # W/(m^2*K) - 80mm PUF + air barrier
        "roof_u_value": 0.22,     # W/(m^2*K) - High-efficiency insulated roof
        "floor_u_value": 0.30,    # W/(m^2*K) - XPS insulated foundation floor
        "window_u_value": 1.6,    # W/(m^2*K) - Triple pane insulated glazing
        "window_shgc": 0.65,      # Optimized solar gain coefficient
        "thermal_capacitance_per_m2": 85000.0, # J/(m^2*K) sensible mass
        "pcm_enabled": True,
        "pcm_capacity_j": 18000000.0, # 18 MJ latent heat thermal storage (~90kg Bio-PCM)
        "pcm_melt_temp": 18.0,    # Phase transition center temperature (°C)
        "pcm_temp_range": 4.0     # Transition phase bandwidth (16°C to 20°C)
    }
}

def get_material_preset(preset_id: str) -> Dict[str, Any]:
    if preset_id not in MATERIAL_PRESETS:
        # Default to insulated if unrecognized
        return MATERIAL_PRESETS["insulated"]
    return MATERIAL_PRESETS[preset_id]
