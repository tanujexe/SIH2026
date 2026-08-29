# Product Requirements Document (PRD)

## Thermal Shelter Simulation & Optimization Platform

**Version:** 1.0  
**Status:** MVP / Prototype  
**Primary Use Case:** Extreme-cold military shelters  
**Initial Location:** Leh, Ladakh  

---

## 1. Product Overview

The Thermal Shelter Simulation & Optimization Platform is a web-based engineering prototype that allows users to simulate the thermal performance of a shelter under extreme environmental conditions.

Users can configure the shelter's location, dimensions, window area, and construction material. The system uses a fast Python-based transient thermal model to estimate indoor temperature, heat loss, solar heat gain, heating requirement, diesel consumption, and CO₂ emissions over a 24-hour period.

A PyAnsys/ANSYS integration will be added as a secondary validation layer for selected designs.

### Core Concept

**Configure → Simulate → Compare → Optimize → Validate**

---

## 2. Problem Statement

Military personnel operating in high-altitude and cold environments such as Ladakh face extremely low temperatures and large day-night temperature variations.

Traditional shelters can lose significant amounts of heat through:

* Walls
* Roof
* Windows/glazing
* Floor
* Air infiltration

This increases dependence on auxiliary heating systems, particularly diesel-based heating.

This creates:

* Higher fuel consumption
* Higher operating costs
* Additional fuel transportation requirements
* Increased carbon emissions

There is a need for a rapid simulation system that can evaluate different shelter designs before physical deployment.

---

## 3. Product Goal

The MVP should demonstrate that a software-based thermal simulation system can:

1. Model a shelter under a representative Leh winter environment.
2. Calculate indoor temperature over 24 hours.
3. Compare different material configurations.
4. Identify major sources of heat loss.
5. Estimate heating energy and diesel requirements.
6. Estimate associated CO₂ emissions.
7. Provide an ANSYS/PyAnsys validation pathway.

---

## 4. Target Users

### Primary User

**Defense/Engineering Designer**

A user who wants to evaluate shelter designs for cold environments.

### Secondary Users

* Researchers
* Thermal engineers
* Defense organizations
* Infrastructure planners
* Engineering students/research teams

---

# 5. MVP Scope

The MVP will focus on a single location and a limited number of shelter configurations.

### Location

**Leh, Ladakh**

A representative winter weather profile will be used initially.

### Default Shelter

```text
Length: 6 m
Width: 3 m
Height: 2.5 m
```

### Material Presets

#### 1. Baseline Steel Bunk

Corrugated galvanized steel-based shelter ($U_{\text{wall}} = 5.80\text{ W/m}^2\text{K}$).

#### 2. Insulated Shelter

50 mm PUF/EPS-type insulated sandwich panel configuration ($U_{\text{wall}} = 0.42\text{ W/m}^2\text{K}$).

#### 3. Passive Solar + PCM

Combination of:

* Insulation ($U_{\text{wall}} = 0.28\text{ W/m}^2\text{K}$)
* South-facing glazing
* Passive solar gain
* Thermal energy storage using Bio-PCM (~18°C)

---

# 6. User Flow

```text
Open Application
       ↓
Select Location
       ↓
Configure Shelter Geometry
       ↓
Select Window Area
       ↓
Select Material Configuration
       ↓
Run Simulation
       ↓
Thermal Engine Calculates Results
       ↓
View 24-hour Temperature
       ↓
View Heat Loss Breakdown
       ↓
View Solar / Heating Energy
       ↓
View Diesel & CO₂ Impact
       ↓
Compare Designs
       ↓
PyANSYS / ANSYS Verification Layer
```

---

# 7. Frontend Requirements

## 7.1 Location Selector

The user should be able to select a predefined location.

### MVP

```text
Location
[ Leh, Ladakh ▼ ]
```

Selecting Leh automatically loads the predefined weather profile.

### Future

Support:

* Multiple locations
* Live weather data
* Custom weather profiles

---

## 7.2 Geometry Controls

Users should be able to modify:

* Length
* Width
* Height
* Window area

Example:

```text
Length       6 m
Width        3 m
Height       2.5 m
Window Area  2 m²
```

Sliders should provide immediate visual feedback.

---

## 7.3 Material Selector

The user should be able to select:

```text
○ Baseline Steel

○ Insulated Shelter

○ Passive Solar + PCM
```

Each preset should automatically load its corresponding thermal properties.

---

## 7.4 Run Simulation

Primary CTA:

**Run Simulation**

The system sends the selected configuration to the backend.

While simulation is running:

```text
Running Simulation...
```

The UI should prevent duplicate requests.

---

# 8. Backend Requirements

## 8.1 Technology

Recommended:

* Python
* FastAPI
* NumPy
* Pydantic

---

## 8.2 API

### POST `/simulate`

Accepts:

```json
{
  "location": "leh",
  "length": 6,
  "width": 3,
  "height": 2.5,
  "window_area": 2,
  "material": "insulated"
}
```

Returns:

```json
{
  "time": [],
  "ambient_temperature": [],
  "indoor_temperature": [],
  "heat_loss": {},
  "solar_energy": 0,
  "heating_energy": 0,
  "diesel_consumption": 0,
  "co2_emission": 0
}
```

---

# 9. Thermal Simulation Engine

The core MVP engine will use a reduced-order transient thermal model.

The basic energy balance is:

$$
C\frac{dT_{in}}{dt}
=
Q_{solar}
+
Q_{internal}
-
Q_{loss}
$$

Where:

* `C` = effective thermal capacitance
* `Tin` = indoor temperature
* `Qsolar` = solar heat gain
* `Qinternal` = heat generated by occupants/equipment
* `Qloss` = total heat loss

Heat loss can be estimated using:

$$
Q_{loss} = \sum_i \frac{A_i(T_{in}-T_{amb})}{R_i}
$$

The simulation will use discrete time steps to calculate indoor temperature throughout 24 hours.

---

# 10. Heat Loss Components

The MVP should calculate heat loss separately for:

* Roof
* Walls
* Floor
* Glazing
* Infiltration

Example output:

```text
Roof          38%
Glazing       27%
Walls         22%
Infiltration  13%
```

These values must be generated from the simulation rather than hard-coded.

---

# 11. Solar Heat Gain

Solar gain will be estimated using solar irradiance and glazing characteristics.

Simplified relationship:

$$
Q_{solar}=I \times A_{window}\times SHGC
$$

Where:

* `I` = solar irradiance
* `Awindow` = window area
* `SHGC` = Solar Heat Gain Coefficient

The system should calculate solar contribution throughout the day.

---

# 12. PCM Model

For the MVP, PCM can initially be represented using a simplified thermal-storage model.

The model should account for:

* PCM thermal capacity
* Charging during heating periods
* Discharging during cooling periods

Future versions can implement a more detailed phase-change enthalpy model.

---

# 13. Output Dashboard

After simulation, the user should see four major sections.

## 13.1 24-Hour Temperature Chart

Display:

* Ambient temperature
* Baseline indoor temperature
* Selected design indoor temperature

X-axis:

**Time**

Y-axis:

**Temperature °C**

The chart should make temperature differences easy to understand.

---

## 13.2 Heat Loss Breakdown

Display a donut/pie chart showing:

```text
Roof
Walls
Glazing
Floor
Infiltration
```

This identifies the major thermal weaknesses of the shelter.

---

## 13.3 Solar & Energy Metrics

Display:

* Solar energy captured
* Total heat loss
* Heating energy required
* Estimated diesel consumption

---

## 13.4 Impact Metrics

Display:

### Indoor Temperature

```text
Minimum Indoor Temperature
Maximum Indoor Temperature
```

### Fuel

```text
Diesel Required / Day
Fuel Reduction %
```

### Environmental

```text
CO₂ / Day
CO₂ Reduction %
```

### Cost

```text
Estimated Daily Cost
Estimated Monthly Cost
```

---

# 14. Design Comparison

The platform should allow comparison between:

**Baseline Steel Shelter**

and

**Optimized Shelter**

Example:

```text
                  Baseline      Optimized

Min Temp          X °C          Y °C
Heat Loss         X kWh         Y kWh
Diesel            X L/day       Y L/day
CO₂               X kg/day      Y kg/day
```

All values should be generated by the simulation model.

---

# 15. PyAnsys / ANSYS Integration

PyAnsys will serve as the high-fidelity validation layer.

### MVP Workflow

```text
User Design
     ↓
Fast Thermal Solver
     ↓
Candidate Design
     ↓
PyAnsys
     ↓
ANSYS
     ↓
Temperature / Thermal Result
```

The prototype should demonstrate at least one successful automated PyAnsys workflow.

A simplified geometry can be used for the first proof of concept.

The goal is to demonstrate the architecture, not build a complete military-grade CFD model during the MVP.

---

# 16. Performance Requirements

The reduced-order thermal simulation should ideally return results within:

**< 1 second**

for a standard 24-hour simulation.

The frontend should feel interactive when configuration values are changed.

ANSYS simulations may take significantly longer and should therefore remain separate from the instant simulation workflow.

---

# 17. Validation Requirements

The system should clearly distinguish between:

### Rapid Simulation

Used for:

* Design exploration
* Comparison
* Interactive UI

### ANSYS Validation

Used for:

* High-fidelity verification
* Selected designs
* Engineering validation

The system should not claim that the reduced-order model is equivalent to a full ANSYS simulation.

---

# 18. Important Assumptions

The MVP will use simplified assumptions for:

* Weather
* Material properties
* Solar radiation
* Occupancy
* Infiltration
* Heating efficiency
* Diesel energy content
* CO₂ emission factor

All assumptions should be documented and configurable where practical.

---

# 19. Non-Goals for MVP

The following are outside the initial scope:

* Full CFD simulation
* Full 3D shelter simulation
* Real-time IoT sensor integration
* AI-based optimization
* Live weather for every location
* Structural analysis
* Wind-load analysis
* Complete military deployment system
* Automated large-scale ANSYS optimization

These can be considered for future versions.

---

# 20. Suggested Technology Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Recharts / Chart.js

### Backend

* Python
* FastAPI
* NumPy
* Pydantic

### Simulation

* Custom transient thermal solver
* PyAnsys
* ANSYS

### Deployment

Initially:

```text
Frontend → Vercel/Netlify
Backend → Render/Railway/VPS
```

ANSYS/PyAnsys execution can remain local or on a dedicated environment during the prototype phase.

---

# 21. Success Criteria

The MVP will be considered successful when:

* User can configure a shelter from the web UI.
* User can select between three material configurations.
* A 24-hour simulation runs successfully.
* Indoor temperature is calculated.
* Heat-loss components are calculated.
* Solar gain is calculated.
* Heating/diesel requirement is estimated.
* CO₂ impact is estimated.
* Baseline and optimized designs can be compared.
* At least one PyAnsys/ANSYS validation workflow is demonstrated.
* Simulation results are generated from the underlying model rather than hard-coded values.

---

# 22. MVP Demo Story

The ideal demonstration should follow this sequence:

```text
1. Select Leh
       ↓
2. Show extreme outdoor temperature
       ↓
3. Select Baseline Steel Shelter
       ↓
4. Run Simulation
       ↓
5. Show temperature + heat loss
       ↓
6. Switch to Passive Solar + PCM
       ↓
7. Run Again
       ↓
8. Compare results
       ↓
9. Show diesel & CO₂ reduction
       ↓
10. Show PyAnsys/ANSYS validation
```

---

# 23. Product Vision

The MVP starts with a single cold-region use case, but the long-term platform can become a broader **thermal engineering decision-support system**.

Future capabilities could include:

* Multiple locations
* Live weather data
* More construction materials
* Automated design optimization
* AI-assisted design recommendations
* Detailed 3D ANSYS simulation
* Sensor-based model calibration
* Digital twin capabilities
* Deployment-specific shelter recommendations

### Long-Term Product Loop

**Design → Simulate → Optimize → Validate → Deploy → Measure → Improve**

---

## One-Line Product Definition

> **A rapid thermal simulation and optimization platform that helps engineers design energy-efficient shelters for extreme environments while using ANSYS for high-fidelity validation.**
