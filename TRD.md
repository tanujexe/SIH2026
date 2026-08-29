# Technical Requirements Document (TRD)

## Thermal Shelter Simulation & Optimization Platform

**Version:** 1.0  
**Status:** MVP / Production-Ready Specification  
**Primary Environment:** Leh, Ladakh (3,500m Altitude)  
**Architecture:** React 18 + FastAPI + Python Thermal Engine + PyAnsys/ANSYS  

---

# 1. Technical Objective

The system will provide a web interface for configuring a shelter and calculating its thermal behavior over a 24-hour period.

The technical architecture will contain two simulation layers:

```text
                    React Frontend
                          │
                          ▼
                     FastAPI API
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
       Rapid Thermal Engine      PyAnsys Layer
              │                       │
              ▼                       ▼
       Instant Results             ANSYS
              │                       │
              └───────────┬───────────┘
                          ▼
                    Results Dashboard
```

---

# 2. System Architecture

## 2.1 Frontend

**Technology:**
* React 18
* Vite
* Tailwind CSS
* Recharts / Chart.js
* Lucide React Icons

**Responsibilities:**
* Collect user inputs (geometry sliders, setpoints, materials)
* Validate inputs
* Send simulation requests
* Display simulation results (24-hour diurnal profile, donut heat loss breakdown)
* Interactive 3D Canvas visualizer for shelter geometry, solar rays, and heat flux vectors
* Compare shelter configurations (Baseline Steel vs Optimized)
* Provide instant offline client-side JS fallback solver

---

## 2.2 Backend

**Technology:**
* Python 3.10+
* FastAPI
* Pydantic
* NumPy / PyMAPDL

**Responsibilities:**
* API management & CORS middleware
* Input validation & error handling
* Simulation orchestration
* Thermal calculations & transient differential integration
* Energy calculations
* Fuel calculations (Diesel L/day)
* $CO_2$ calculations (kg/day)
* Automated PyAnsys script generation & FEA mesh solver
* Returning structured JSON results

---

## 2.3 Thermal Engine

The thermal engine is implemented as an independent Python module (`backend/physics/thermal_solver.py`).

It does not depend directly on the frontend.

```text
Input Configuration
        ↓
Geometry Calculator
        ↓
Material Properties
        ↓
Weather Data
        ↓
Thermal Solver
        ↓
Energy/Fuel Calculator
        ↓
Simulation Result
```

---

# 3. Project Structure

Backend structure:

```text
backend/
│
├── main.py                     # FastAPI Application Entry Point
├── config.py                   # Physical Constants & Configuration Parameters
│
├── api/
│   └── simulation.py           # REST Endpoint Handlers (/simulate, /compare, /validate-ansys)
│
├── physics/
│   ├── thermal_solver.py       # 24-Hour Transient Differential Euler Solver
│   ├── heat_loss.py            # Geometry & Component Conductive/Infiltration Heat Losses
│   ├── solar_gain.py           # Diurnal Solar Irradiance Model
│   ├── pcm.py                  # Bio-PCM Phase Change Storage Model
│   └── energy.py               # Fuel, Emissions & Operating Cost Calculator
│
├── models/
│   ├── schemas.py              # Pydantic Input / Output Validation Models
│   └── materials.py            # Construction Material Presets
│
├── weather/
│   └── leh.py                  # Leh Meteorological Diurnal Profile Generator
│
├── ansys/
│   └── verification.py         # PyMAPDL Script Exporter & FEA Mesh Contours
│
└── tests/
    └── test_thermal.py         # Automated Physics Unit Tests
```

Frontend structure:

```text
frontend/
│
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx                # React Mount Entry Point
    ├── App.jsx                 # Master 2-Column Dashboard Layout
    ├── index.css               # Design System, Glassmorphic Styles & Layout Rules
    │
    ├── services/
    │   └── simulationApi.js    # API Client & Client-Side JS Fallback Solver
    │
    └── components/
        ├── LocationSelector.jsx# Deployment Location Dropdown & Weather Cards
        ├── GeometryControls.jsx# Sliders for Geometry, Setpoints & Occupants
        ├── MaterialSelector.jsx# Construction Material Preset Selector Cards
        ├── SimulationButton.jsx# Primary Execution CTA Button
        ├── TemperatureChart.jsx# 24-Hour Recharts Diurnal Profile Graph
        ├── HeatLossChart.jsx   # Donut Component Loss Breakdown Chart
        ├── MetricsCard.jsx     # High-Impact KPI Metric Cards Grid
        ├── DesignComparison.jsx# Comparative Performance Matrix Table
        ├── Shelter3DViewer.jsx # Interactive 3D Canvas Shelter Visualizer
        └── AnsysValidation.jsx # PyANSYS Verification Studio & Script Exporter
```

---

# 4. Input Data Model

The simulation request contains:

```json
{
  "location": "leh",
  "length": 6.0,
  "width": 3.0,
  "height": 2.5,
  "window_area": 2.0,
  "material": "passive_pcm",
  "occupants": 2,
  "target_temperature": 18.0,
  "ach": 0.5
}
```

### Required Fields

* **location**: String identifying weather profile (`leh`, `drass`, `siachen`).
* **length**: Shelter length in meters ($3.0\text{m}$ to $12.0\text{m}$).
* **width**: Shelter width in meters ($2.0\text{m}$ to $6.0\text{m}$).
* **height**: Shelter height in meters ($2.0\text{m}$ to $4.0\text{m}$).
* **window_area**: South-facing glazing area in square meters ($0.0\text{m}^2$ to $10.0\text{m}^2$).
* **material**: Selected material configuration (`baseline_steel`, `insulated`, `passive_pcm`).
* **occupants**: Number of occupants generating internal heat ($0$ to $12$).
* **target_temperature**: Desired indoor comfort setpoint ($10.0^\circ\text{C}$ to $24.0^\circ\text{C}$).
* **ach**: Air changes per hour for infiltration ($0.1$ to $3.0$).

---

# 5. Input Validation

FastAPI/Pydantic validates:

```text
Length > 0
Width > 0
Height > 0
Window Area >= 0
Occupants >= 0
Target Temperature >= 5.0 and <= 30.0
```

Window area must not exceed 50% of the total wall area.  
Invalid requests return HTTP `400 Bad Request`.

---

# 6. Geometry Engine

The geometry module calculates:

### Floor Area
$$A_{\text{floor}} = L \times W$$

### Roof Area
$$A_{\text{roof}} = L \times W$$

### Wall Area
$$A_{\text{wall}} = 2(LH) + 2(WH)$$

### Volume
$$V = L \times W \times H$$

### Net Wall Area
Window area is removed from the south wall surface:
$$A_{\text{wall,net}} = A_{\text{wall}} - A_{\text{window}}$$

---

# 7. Material Data Model

Each material preset contains thermophysical properties:

```python
{
    "id": "passive_pcm",
    "name": "Passive Solar + PCM Shelter",
    "description": "80mm PUF insulation + South solar window + Bio-PCM (~18°C) thermal wallboard storage.",
    "wall_u_value": 0.28,     # W/(m^2*K)
    "roof_u_value": 0.22,     # W/(m^2*K)
    "floor_u_value": 0.30,    # W/(m^2*K)
    "window_u_value": 1.60,   # W/(m^2*K)
    "window_shgc": 0.65,      # Solar Heat Gain Coefficient
    "thermal_capacitance_per_m2": 85000.0, # J/(m^2*K)
    "pcm_enabled": True,
    "pcm_capacity_j": 18000000.0, # 18 MJ latent heat
    "pcm_melt_temp": 18.0
}
```

The thermophysical values come from standard engineering handbooks and field measurement data.

---

# 8. Thermal Resistance

For a material layer:

$$R_k = \frac{L_k}{k_k}$$

For multiple layers:

$$R_{\text{total}} = R_{\text{si}} + \sum R_k + R_{\text{se}}$$

Where $R_{\text{si}} = 0.13\text{ m}^2\text{K/W}$ and $R_{\text{se}} = 0.04\text{ m}^2\text{K/W}$.

The overall heat-transfer coefficient (U-value) is:

$$U = \frac{1}{R_{\text{total}}}$$

This allows heat loss to be calculated for each building component.

---

# 9. Heat Loss Model

For each component $i \in \{\text{roof}, \text{walls}, \text{floor}, \text{glazing}\}$:

$$Q_i = U_i A_i (T_{\text{in}} - T_{\text{amb}})$$

Total conductive heat loss:

$$Q_{\text{cond}} = \sum_i Q_i$$

---

# 10. Infiltration Heat Loss

Includes high-altitude cold air infiltration:

$$Q_{\text{inf}} = \dot{m}_{\text{air}} C_p (T_{\text{in}} - T_{\text{amb}})$$

Where $\dot{m}_{\text{air}}$ is the mass flow rate of incoming outdoor air:

$$\dot{V}_{\text{air}} = \frac{\text{ACH} \times V}{3600} \quad (\text{m}^3/\text{s})$$
$$\dot{m}_{\text{air}} = \dot{V}_{\text{air}} \times \rho_{\text{air,Leh}} \quad (\text{kg/s})$$

For Leh altitude ($3,500\text{m}$), atmospheric air density is adjusted to $\rho_{\text{air,Leh}} = 0.88\text{ kg/m}^3$ and $C_p = 1005\text{ J/(kg·K)}$.

---

# 11. Solar Heat Gain

Solar gain through south-facing glazing:

$$Q_{\text{solar}}(t) = I(t) \cdot A_{\text{window}} \cdot \text{SHGC}$$

Where:
* $I(t)$ = solar irradiance at hour $t$ ($780\text{ W/m}^2$ peak at solar noon).
* $A_{\text{window}}$ = window area ($\text{m}^2$).
* $\text{SHGC}$ = solar heat gain coefficient.

Solar gain is zero during nighttime hours ($17:00$ to $07:00$).

---

# 12. Internal Heat Generation

Each occupant contributes sensible heat load:

$$Q_{\text{internal}} = N_{\text{occupants}} \times Q_{\text{person}}$$

Where $Q_{\text{person}} = 80.0\text{ Watts}$ per human occupant.

---

# 13. Thermal Capacitance

The shelter's effective thermal mass is represented using lumped thermal capacitance:

$$C_{\text{eff}} = \text{Total\_Surface\_Area} \times C_{\text{capacitance\_per\_m2}}$$

Where $C_{\text{capacitance\_per\_m2}}$ ranges from $25,000\text{ J/m}^2\text{K}$ (Steel) to $85,000\text{ J/m}^2\text{K}$ (Passive PCM).

---

# 14. Transient Thermal Solver

The core lumped energy balance differential equation is:

$$C_{\text{eff}} \frac{dT_{\text{in}}}{dt} = Q_{\text{solar}} + Q_{\text{internal}} - Q_{\text{loss}} - Q_{\text{pcm}}$$

For discrete time steps:

$$T_{t+\Delta t} = T_t + \frac{Q_{\text{net}}}{C_{\text{eff}}} \Delta t$$

Where:

$$Q_{\text{net}} = Q_{\text{solar}} + Q_{\text{internal}} - Q_{\text{loss}} - Q_{\text{pcm}}$$

---

# 15. Simulation Configuration

Default configuration:
* **Simulation Duration**: 24 hours
* **Time Step**: 5 minutes ($\Delta t = 300\text{ seconds}$)
* **Total Timesteps**: 288 simulation steps

The solver returns complete temperature and power data for every timestep.

---

# 16. Weather Engine

Predefined Leh winter weather profile:

```json
{
  "step": 144,
  "hour": 12.0,
  "time_str": "12:00",
  "ambient_temperature": -5.0,
  "solar_irradiance": 780.0
}
```

Minimum outdoor temperature is $-20.0^\circ\text{C}$ at 04:00 AM, maximum outdoor temperature is $-5.0^\circ\text{C}$ at 14:00 PM.

---

# 17. PCM Model

The Passive Solar + PCM configuration tracks thermal energy buffering:
* **Stored Thermal Energy**: Max latent capacity $18\text{ MJ}$ (~18°C Bio-PCM).
* **Charging Phase**: Absorbs excess solar heat when $T_{\text{in}} \ge 16.0^\circ\text{C}$ and $Q_{\text{net}} > 0$.
* **Discharging Phase**: Releases stored heat back into shelter when $T_{\text{in}} < 18.0^\circ\text{C}$.
* **State of Charge**: Tracked and reported as percentage ($0\text{--}100\%$).

---

# 18. Heating Requirement

If indoor temperature falls below target temperature setpoint ($18.0^\circ\text{C}$):

$$Q_{\text{heating}} = \max\left(0, Q_{\text{loss,heated}} - (Q_{\text{solar}} + Q_{\text{internal}})\right)$$

Accumulated over 24 hours to calculate total required heating energy ($E_{\text{heating}}$ in $\text{kWh}$).

---

# 19. Diesel Calculation

Given required heating energy:

$$\text{Fuel (L/day)} = \frac{E_{\text{heating}}}{E_{\text{diesel}} \times \eta}$$

Where:
* $E_{\text{heating}}$ = required heating energy ($\text{kWh}$).
* $E_{\text{diesel}}$ = energy content of diesel ($10.55\text{ kWh/L}$ or $38\text{ MJ/L}$).
* $\eta$ = space heater efficiency ($0.85$ or 85%).

---

# 20. CO₂ Calculation

$$CO_2 \text{ Footprint (kg/day)} = \text{Fuel (L/day)} \times \text{EF}$$

Where:
* $\text{Fuel}$ = diesel consumption ($\text{L/day}$).
* $\text{EF}$ = diesel emission factor ($2.68\text{ kg } CO_2\text{/L}$).
* Daily cost = $\text{Fuel} \times \$1.25\text{/L}$ ($\approx ₹86/\$$).

---

# 21. API Specification

## POST `/api/simulate`

### Request Payload

```json
{
  "location": "leh",
  "length": 6.0,
  "width": 3.0,
  "height": 2.5,
  "window_area": 2.0,
  "material": "passive_pcm",
  "occupants": 2,
  "target_temperature": 18.0,
  "ach": 0.5
}
```

### Response Payload

```json
{
  "shelter_config": {
    "location": "leh",
    "length": 6.0,
    "width": 3.0,
    "height": 2.5,
    "window_area": 2.0,
    "material": "passive_pcm",
    "occupants": 2,
    "target_temperature": 18.0,
    "ach": 0.5,
    "geometry": {
      "floor_area": 18.0,
      "roof_area": 18.0,
      "total_wall_area": 45.0,
      "net_wall_area": 43.0,
      "window_area": 2.0,
      "volume": 45.0
    }
  },
  "material_info": {
    "id": "passive_pcm",
    "name": "Passive Solar + PCM Shelter",
    "wall_u_value": 0.28,
    "roof_u_value": 0.22,
    "floor_u_value": 0.30,
    "window_u_value": 1.6,
    "window_shgc": 0.65,
    "pcm_enabled": true
  },
  "timesteps": [
    {
      "step": 0,
      "hour": 0.0,
      "time_str": "00:00",
      "ambient_temperature": -17.8,
      "indoor_temperature_unheated": -12.4,
      "indoor_temperature_heated": 18.0,
      "solar_gain_watts": 0.0,
      "heat_loss_watts": 412.5,
      "heating_power_watts": 252.5,
      "pcm_state_of_charge_percent": 45.2
    }
  ],
  "heat_loss": {
    "roof": 2.9,
    "walls": 8.81,
    "floor": 3.95,
    "glazing": 2.34,
    "infiltration": 4.05,
    "total_kwh": 22.05,
    "roof_percent": 13.1,
    "walls_percent": 40.0,
    "floor_percent": 17.9,
    "glazing_percent": 10.6,
    "infiltration_percent": 18.4
  },
  "energy": {
    "solar_gain_kwh": 6.45,
    "total_heat_loss_kwh": 22.05,
    "heating_required_kwh": 13.51,
    "pcm_energy_stored_kwh": 5.0
  },
  "impact": {
    "min_indoor_temp_unheated": -16.0,
    "max_indoor_temp_unheated": -11.2,
    "diesel_litres_per_day": 1.51,
    "co2_kg_per_day": 4.04,
    "daily_cost_usd": 1.88,
    "fuel_savings_percent": 95.6,
    "co2_reduction_percent": 95.6
  }
}
```

---

# 22. Frontend Data Flow

```text
User Input (Sliders, Controls)
              ↓
      React Local State
              ↓
      POST /api/simulate
              ↓
       FastAPI Server
              ↓
    Python Thermal Engine
              ↓
        JSON Response
              ↓
  React State Update
              ↓
  Recharts + 3D Visualizer + Metrics
```

---

# 23. Frontend Components

### Configuration Panel (Left Sidebar)
* `LocationSelector.jsx`: Target environment dropdown & weather metric badges.
* `GeometryControls.jsx`: Length, width, height, glazing, setpoint, and occupant range sliders.
* `MaterialSelector.jsx`: Baseline Steel, Insulated, and Passive Solar + PCM selection cards.
* `SimulationButton.jsx`: Primary execution button ("Run 24-Hour Simulation").

### Results Panel (Right Dashboard)
* `MetricsCard.jsx`: 4-card KPI metric display (Diesel, $CO_2$, Heating Energy, Solar & Cost).
* `TemperatureChart.jsx`: Recharts 24-hour diurnal profile graph (Ambient vs Unheated vs Heated).
* `HeatLossChart.jsx`: Donut chart component breakdown (Roof, Walls, Floor, Glazing, Infiltration).
* `Shelter3DViewer.jsx`: Interactive 3D Canvas visualizer for shelter geometry, solar rays, and heat loss vectors.
* `DesignComparison.jsx`: Side-by-side comparative performance matrix table.
* `AnsysValidation.jsx`: PyANSYS FEA verification studio with script generator and nodal table.

---

# 24. Visualization Requirements

### Temperature Chart
Three datasets displayed simultaneously:
1. Outdoor Ambient Temperature ($^\circ\text{C}$)
2. Unheated Shelter Indoor Temperature ($^\circ\text{C}$)
3. Heated Shelter Temperature Setpoint ($^\circ\text{C}$)

### Heat Loss Chart
Five components evaluated:
1. Roof
2. Walls
3. Floor
4. Glazing
5. Infiltration

### Impact Metric Cards
1. Diesel Consumption (L/day)
2. $CO_2$ Footprint (kg/day)
3. Required Heating Energy (kWh/day)
4. Solar Energy Harvested (kWh/day) & Operating Cost ($ / ₹)

---

# 25. Baseline Comparison

Runs two simulations in parallel:
$$\text{Baseline Steel Shelter} \quad \text{VS} \quad \text{Selected Design}$$

Calculates exact Liters of fuel saved, $CO_2$ reduction, and fuel savings percentage.

---

# 26. PyAnsys Integration

Implemented as an independent backend module (`backend/ansys/verification.py`).

Responsibilities:
1. Receive selected design geometry and material U-values.
2. Generate production-ready PyMAPDL Python script using `SOLID70` 3D thermal elements.
3. Apply interior convection ($h_{\text{int}} = 8.29\text{ W/m}^2\text{K}$) and exterior sub-zero boundary loads ($-20.0^\circ\text{C}$).
4. Compute 3D finite element grid ($N = 480$ nodes) with nodal temperatures and thermal flux.
5. Return results for verification.

---

# 27. Verification Strategy

Compares Rapid Solver thermal predictions against 3D FEA ANSYS model:

$$\text{Rapid Physics Engine} \quad \text{VS} \quad \text{PyANSYS 3D SOLID70 FEA}$$

Reports validation delta percentage ($\Delta < 3.5\%$) demonstrating high fidelity.

---

# 28. Error Handling

Backend handles:
* Invalid window area (> 50% wall area) $\rightarrow$ Returns HTTP `400 Bad Request`.
* Missing parameters $\rightarrow$ Returns Pydantic validation error.
* Server errors $\rightarrow$ Handled gracefully with fallback client-side solver.

---

# 29. Performance Requirements

* **Rapid Thermal Solver**: Target $< 15\text{ ms}$ for 24-hour simulation.
* **FastAPI API**: Target $< 100\text{ ms}$ for API requests.
* **PyANSYS Verification**: Asynchronous/on-demand execution.

---

# 30. Testing Requirements

* **Unit Tests**: `backend/tests/test_thermal.py` tests geometry, thermal resistance, heat loss, solar gain, and fuel calculations.
* **Integration Tests**: Tested end-to-end API pipeline.
* **Physics Sanity Tests**: Verifies that increasing insulation reduces heat loss, and increasing solar glazing increases solar gain.

---

# 31. Security Requirements

* Input validation on all API endpoints via Pydantic.
* Restricted CORS middleware.
* No arbitrary execution of untrusted user scripts.

---

# 32. Deployment Architecture

```text
                 Internet
                    │
                    ▼
          React 18 Frontend (Vite)
                    │
                    ▼
             FastAPI Backend
                    │
                    ▼
          Python Physics Engine
```

---

# 33. Configuration Management

All simulation physical constants and parameters are centralized in `backend/config.py`:
* Air density at Leh altitude: $0.88\text{ kg/m}^3$
* Diesel energy density: $38.0\text{ MJ/L}$ ($10.55\text{ kWh/L}$)
* Heater efficiency: $85\%$
* $CO_2$ emission factor: $2.68\text{ kg } CO_2\text{/L}$
* Diesel fuel price: $\$1.25\text{/L}$ ($\approx ₹86/\$$)

---

# 34. Development Priority

1. **Phase 1: Physics Engine** (Weather, Geometry, Materials, Heat Loss, Solar Gain, 24h Solver).
2. **Phase 2: FastAPI Backend** (Validation, Schemas, `/simulate`, `/compare`).
3. **Phase 3: Frontend Dashboard** (Inputs, Sliders, Charts, 3D Visualizer, Metrics).
4. **Phase 4: Design Comparison** (Baseline Steel vs Selected Shelter).
5. **Phase 5: PyANSYS Validation** (PyMAPDL script generator, FEA mesh nodal grid).
6. **Phase 6: Testing & Optimization** (Unit tests, performance benchmarking, styling polish).

---

# 35. Technical Definition of Done

The MVP is technically complete:
* React 18 frontend runs cleanly with dark engineering aesthetic.
* User can adjust geometry sliders, setpoint, occupants, and material configuration.
* Leh winter weather profile (-20°C ambient, 780 W/m² solar) is loaded.
* FastAPI backend processes transient thermal simulations in $< 15\text{ ms}$.
* 24-hour indoor temperature curves, heat loss breakdown, and solar gains calculated.
* Diesel consumption (L/day), $CO_2$ emissions (kg/day), and fuel savings % calculated.
* Baseline Steel Bunk and Selected Shelter designs compared side-by-side.
* PyANSYS script generator and 3D FEA nodal grid verified.
* All core physics unit tests pass (`backend/tests/test_thermal.py`).

---

# 36. Final Technical Architecture

```text
                         USER
                           │
                           ▼
                  ┌─────────────────┐
                  │ React Frontend  │
                  │                 │
                  │ Inputs          │
                  │ Charts          │
                  │ Metrics         │
                  └────────┬────────┘
                           │
                         REST
                           │
                           ▼
                  ┌─────────────────┐
                  │    FastAPI      │
                  │                 │
                  │ Validation      │
                  │ API             │
                  │ Orchestration   │
                  └────────┬────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   Thermal Engine       │
              │                        │
              │ Geometry               │
              │ Materials              │
              │ Heat Loss              │
              │ Solar Gain             │
              │ Thermal Storage        │
              │ Transient Solver       │
              │ Energy/Fuel            │
              └───────────┬────────────┘
                          │
                          ▼
                  Simulation Results
                          │
                          ▼
                  ┌─────────────────┐
                  │ Analytics Layer │
                  └────────┬────────┘
                           │
                           ▼
                     React Charts


              HIGH-FIDELITY PATH
                           │
                           ▼
                       PyAnsys
                           │
                           ▼
                         ANSYS
                           │
                           ▼
                  Thermal Validation
```

## Core Technical Principle

**Fast Solver for exploration + ANSYS for validation.**

The platform prioritizes a scientifically consistent thermal model and a working end-to-end pipeline over visual complexity or an unnecessarily detailed simulation.
