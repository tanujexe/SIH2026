"""
Global simulation constants and configuration parameters for Thermal Shelter Solver.
All values are based on standard thermophysical engineering literature.
"""

# Physical Constants
AIR_DENSITY = 1.225  # kg/m^3 at sea level
AIR_DENSITY_LEH = 0.88  # kg/m^3 (High-altitude Leh adjustment)
AIR_SPECIFIC_HEAT = 1005.0  # J/(kg*K)

# Occupant thermal load
OCCUPANT_SENSIBLE_HEAT = 80.0  # Watts per person

# Diesel Fuel & Emissions Parameters
DIESEL_ENERGY_DENSITY_MJ = 38.0  # MJ/L (approx 10.55 kWh/L)
DIESEL_ENERGY_DENSITY_KWH = 10.55  # kWh/L
HEATER_EFFICIENCY = 0.85  # 85% efficiency for military-grade diesel space heaters
DIESEL_EMISSION_FACTOR = 2.68  # kg CO2 per liter of diesel burned
DIESEL_COST_PER_LITER = 1.25  # USD equivalent

# Simulation Default Parameters
DEFAULT_TARGET_TEMP = 18.0  # °C desired indoor comfort setpoint
DEFAULT_ACH = 0.5  # Air Changes per Hour for standard well-sealed military shelter

# Weather Defaults for Leh, Ladakh (34.15°N latitude, 3500m altitude)
LEH_LATITUDE = 34.15
LEH_WINTER_MIN_TEMP = -20.0  # °C at 04:00
LEH_WINTER_MAX_TEMP = -5.0   # °C at 14:00
LEH_PEAK_SOLAR_IRRADIANCE = 780.0  # W/m^2 (Clear high-altitude sky)
