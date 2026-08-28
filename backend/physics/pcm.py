from typing import Tuple, Dict, Any

class PCMModel:
    def __init__(self, mat: Dict[str, Any]):
        self.enabled = mat.get("pcm_enabled", False)
        self.capacity_j = mat.get("pcm_capacity_j", 0.0) # Max latent capacity (J)
        self.melt_temp = mat.get("pcm_melt_temp", 18.0) # Melt midpoint °C
        self.temp_range = mat.get("pcm_temp_range", 4.0) # Band (e.g., 16°C to 20°C)
        self.current_stored_j = 0.0 # Start empty or neutral

    def update(self, t_in: float, delta_t_sec: float, q_net_available: float) -> Tuple[float, float]:
        """
        Updates PCM state of charge.
        Returns:
            (q_pcm_exchange_watts, state_of_charge_percent)
            - Positive q_pcm_exchange: PCM absorbs heat (charging, reduces indoor overheating).
            - Negative q_pcm_exchange: PCM releases heat into shelter (discharging, buffers cooling).
        """
        if not self.enabled or self.capacity_j <= 0:
            return 0.0, 0.0

        t_low = self.melt_temp - (self.temp_range / 2.0)
        t_high = self.melt_temp + (self.temp_range / 2.0)
        
        q_pcm = 0.0
        
        # Charging condition: Indoor temp rises above t_low and excess solar heat is present
        if t_in >= t_low and q_net_available > 0:
            max_charge_rate = min(q_net_available * 0.85, 3000.0) # Watts absorption cap
            energy_to_add = max_charge_rate * delta_t_sec
            
            # Clamp to max capacity
            remaining_cap = self.capacity_j - self.current_stored_j
            actual_add = min(energy_to_add, remaining_cap)
            
            if actual_add > 0:
                self.current_stored_j += actual_add
                q_pcm = actual_add / delta_t_sec # Positive: absorbing heat
                
        # Discharging condition: Indoor temp falls below melt_temp and stored energy exists
        elif t_in < self.melt_temp and self.current_stored_j > 0:
            discharge_rate = min(2500.0, 150.0 * (self.melt_temp - t_in)) # Watts release
            energy_to_release = discharge_rate * delta_t_sec
            
            actual_release = min(energy_to_release, self.current_stored_j)
            if actual_release > 0:
                self.current_stored_j -= actual_release
                q_pcm = - (actual_release / delta_t_sec) # Negative: releasing heat to room
                
        soc_percent = (self.current_stored_j / self.capacity_j) * 100.0 if self.capacity_j > 0 else 0.0
        return q_pcm, round(soc_percent, 1)
