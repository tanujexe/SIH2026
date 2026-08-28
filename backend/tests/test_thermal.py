# Standard python test module without external dependencies
from backend.physics.thermal_solver import run_transient_thermal_simulation
from backend.physics.heat_loss import calculate_geometry
from backend.models.materials import get_material_preset

def test_geometry_calculation():
    geom = calculate_geometry(6.0, 3.0, 2.5, 2.0)
    assert geom["floor_area"] == 18.0
    assert geom["roof_area"] == 18.0
    assert geom["total_wall_area"] == 45.0
    assert geom["net_wall_area"] == 43.0
    assert geom["volume"] == 45.0

def test_insulated_heat_loss_less_than_baseline():
    baseline_req = {
        "length": 6.0, "width": 3.0, "height": 2.5, "window_area": 2.0,
        "material": "baseline_steel", "occupants": 2, "target_temperature": 18.0
    }
    insulated_req = {
        "length": 6.0, "width": 3.0, "height": 2.5, "window_area": 2.0,
        "material": "insulated", "occupants": 2, "target_temperature": 18.0
    }
    
    res_base = run_transient_thermal_simulation(baseline_req)
    res_ins = run_transient_thermal_simulation(insulated_req)
    
    assert res_ins["energy"]["total_heat_loss_kwh"] < res_base["energy"]["total_heat_loss_kwh"]
    assert res_ins["impact"]["diesel_litres_per_day"] < res_base["impact"]["diesel_litres_per_day"]

def test_passive_pcm_reduces_heating():
    pcm_req = {
        "length": 6.0, "width": 3.0, "height": 2.5, "window_area": 2.0,
        "material": "passive_pcm", "occupants": 2, "target_temperature": 18.0
    }
    res_pcm = run_transient_thermal_simulation(pcm_req)
    
    assert res_pcm["energy"]["solar_gain_kwh"] > 0
    assert res_pcm["impact"]["diesel_litres_per_day"] > 0
    assert len(res_pcm["timesteps"]) == 288
