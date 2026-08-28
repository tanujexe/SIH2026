def calculate_solar_gain(
    solar_irradiance: float,
    window_area: float,
    shgc: float
) -> float:
    """
    Calculates instant solar heat gain into the shelter through south-facing window.
    Q_solar = Irradiance (W/m^2) * Window_Area (m^2) * SHGC
    
    Returns:
        Solar heat gain in Watts (W).
    """
    if solar_irradiance <= 0 or window_area <= 0:
        return 0.0
    return solar_irradiance * window_area * shgc
