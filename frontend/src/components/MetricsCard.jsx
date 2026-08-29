import React from 'react';
import { Fuel, Leaf, Zap, Sun, ArrowDownRight } from 'lucide-react';

export default function MetricsCard({ energy, impact }) {
  if (!energy || !impact) return null;

  const inrCost = Math.round(impact.daily_cost_usd * 86.0);

  return (
    <div className="kpi-grid">
      {/* Diesel Consumption Card */}
      <div className="glass-panel" style={{ borderLeft: '4px solid #f59e0b', display: 'flex', flexDirection: 'column', justifySpace: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
          <span style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Diesel Required</span>
          <Fuel style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
        </div>
        <div style={{ margin: '0.5rem 0' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'monospace', color: '#fcd34d' }}>
            {impact.diesel_litres_per_day} <span style={{ fontSize: '0.85rem', fontWeight: '400', color: '#f59e0b' }}>L/day</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>
            ~{(impact.diesel_litres_per_day * 30).toFixed(0)} L / month
          </span>
        </div>
        {impact.fuel_savings_percent > 0 && (
          <div className="badge badge-amber" style={{ alignSelf: 'flex-start' }}>
            <ArrowDownRight style={{ width: '12px', height: '12px' }} /> -{impact.fuel_savings_percent}% vs Steel
          </div>
        )}
      </div>

      {/* CO2 Emissions Card */}
      <div className="glass-panel" style={{ borderLeft: '4px solid #10b981', display: 'flex', flexDirection: 'column', justifySpace: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
          <span style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CO₂ Footprint</span>
          <Leaf style={{ width: '16px', height: '16px', color: '#10b981' }} />
        </div>
        <div style={{ margin: '0.5rem 0' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'monospace', color: '#6ee7b7' }}>
            {impact.co2_kg_per_day} <span style={{ fontSize: '0.85rem', fontWeight: '400', color: '#10b981' }}>kg/day</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>
            ~{(impact.co2_kg_per_day * 30).toFixed(0)} kg CO₂ / month
          </span>
        </div>
        {impact.co2_reduction_percent > 0 && (
          <div className="badge badge-emerald" style={{ alignSelf: 'flex-start' }}>
            <ArrowDownRight style={{ width: '12px', height: '12px' }} /> -{impact.co2_reduction_percent}% CO₂
          </div>
        )}
      </div>

      {/* Heating Energy Required */}
      <div className="glass-panel" style={{ borderLeft: '4px solid #38bdf8', display: 'flex', flexDirection: 'column', justifySpace: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
          <span style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Heating Energy</span>
          <Zap style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
        </div>
        <div style={{ margin: '0.5rem 0' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'monospace', color: '#7dd3fc' }}>
            {energy.heating_required_kwh} <span style={{ fontSize: '0.85rem', fontWeight: '400', color: '#38bdf8' }}>kWh/day</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total heat loss: {energy.total_heat_loss_kwh} kWh</span>
        </div>
        <div className="badge badge-cyan" style={{ alignSelf: 'flex-start' }}>
          Heater Efficiency: 85%
        </div>
      </div>

      {/* Solar Energy Captured & Cost */}
      <div className="glass-panel" style={{ borderLeft: '4px solid #c084fc', display: 'flex', flexDirection: 'column', justifySpace: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
          <span style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Solar & Cost</span>
          <Sun style={{ width: '16px', height: '16px', color: '#c084fc' }} />
        </div>
        <div style={{ margin: '0.5rem 0' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'monospace', color: '#e9d5ff' }}>
            {energy.solar_gain_kwh} <span style={{ fontSize: '0.85rem', fontWeight: '400', color: '#c084fc' }}>kWh Solar</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: '#cbd5e1', fontFamily: 'monospace' }}>
            Est. Fuel Cost: ₹{inrCost}/day (${impact.daily_cost_usd})
          </span>
        </div>
        <div style={{ fontSize: '0.65rem', color: '#e9d5ff', backgroundColor: 'rgba(192, 132, 252, 0.15)', border: '1px solid rgba(192, 132, 252, 0.3)', padding: '2px 6px', borderRadius: '4px', alignSelf: 'flex-start' }}>
          Passive Solar Gain
        </div>
      </div>
    </div>
  );
}
