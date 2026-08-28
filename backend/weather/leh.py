import math
from typing import List, Dict, Any
from backend.config import (
    LEH_WINTER_MIN_TEMP,
    LEH_WINTER_MAX_TEMP,
    LEH_PEAK_SOLAR_IRRADIANCE
)

def generate_leh_weather_profile(time_step_minutes: int = 5) -> List[Dict[str, Any]]:
    """
    Generates a realistic 24-hour weather profile for Leh, Ladakh in winter.
    Time is discretized into time_step_minutes steps (default 5 min = 288 steps).
    
    Outdoor Temperature Curve:
    - Minimum outdoor temp (-20°C) around 04:00 AM.
    - Maximum outdoor temp (-5°C) around 14:00 PM (2 PM).
    - Modeled as a smooth sinusoidal daily curve with thermal lag.
    
    Solar Irradiance Curve:
    - Sunrise at ~07:00, Sunset at ~17:00 (10 hours daylight).
    - Peak solar irradiance (~780 W/m^2) at solar noon (12:00).
    - High atmospheric transmittance due to Leh's 3,500m elevation.
    """
    steps_per_day = int((24 * 60) / time_step_minutes)
    profile = []
    
    t_min = LEH_WINTER_MIN_TEMP
    t_max = LEH_WINTER_MAX_TEMP
    t_mean = (t_max + t_min) / 2.0
    t_amp = (t_max - t_min) / 2.0
    
    for i in range(steps_per_day):
        minutes = i * time_step_minutes
        hour_float = minutes / 60.0
        
        # Diurnal temperature sinusoidal curve with peak at 14.0h
        # shift phase so minimum occurs near 04.0h and maximum near 14.0h
        temp_phase = (hour_float - 8.0) * (2 * math.pi / 24.0)
        ambient_temp = t_mean + t_amp * math.sin(temp_phase)
        
        # Solar irradiance (half-sine wave between sunrise 07:00 and sunset 17:00)
        sunrise = 7.0
        sunset = 17.0
        if sunrise <= hour_float <= sunset:
            solar_phase = (hour_float - sunrise) / (sunset - sunrise) * math.pi
            solar_irradiance = LEH_PEAK_SOLAR_IRRADIANCE * math.sin(solar_phase)
        else:
            solar_irradiance = 0.0
            
        profile.append({
            "step": i,
            "hour": round(hour_float, 2),
            "time_str": f"{int(hour_float):02d}:{int((hour_float % 1) * 60):02d}",
            "ambient_temperature": round(ambient_temp, 2),
            "solar_irradiance": round(solar_irradiance, 2)
        })
        
    return profile
