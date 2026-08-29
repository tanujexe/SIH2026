import React from 'react';
import { GitCompare, TrendingDown, Shield, Zap, Flame, Check } from 'lucide-react';

export default function DesignComparison({ comparisonData, onSelectMaterial, selectedMaterial }) {
  if (!comparisonData || !comparisonData.baseline || !comparisonData.selected) return null;

  const { baseline, selected, savings_diesel_litres_day, savings_co2_kg_day, savings_percent } = comparisonData;

  const presets = [
    { id: 'baseline_steel', label: 'Baseline Steel Bunk', icon: Shield },
    { id: 'insulated', label: 'Insulated PUF/EPS', icon: Zap },
    { id: 'passive_pcm', label: 'Passive Solar + PCM', icon: Flame },
  ];

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GitCompare style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1' }}>
              Comparative Design Analysis
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Baseline Galvanized Steel vs Selected Shelter Configuration</p>
          </div>
        </div>

        {/* Big Savings Highlight Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#0f172a', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '0.5rem 1rem', borderRadius: '10px' }}>
          <TrendingDown style={{ width: '20px', height: '20px', color: '#10b981' }} />
          <div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>Daily Fuel Savings</div>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', fontFamily: 'monospace', color: '#10b981' }}>
              -{savings_diesel_litres_day} L Diesel ({savings_percent}% reduction)
            </div>
          </div>
        </div>
      </div>

      {/* Preset Comparison Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>Compare Preset:</span>
        {presets.map((p) => {
          const Icon = p.icon;
          const isSelected = selectedMaterial === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectMaterial(p.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#0284c7' : '#0f172a',
                color: isSelected ? '#ffffff' : '#cbd5e1',
                borderColor: isSelected ? '#38bdf8' : '#1e293b'
              }}
            >
              <Icon style={{ width: '14px', height: '14px' }} />
              {p.label}
              {isSelected && <Check style={{ width: '12px', height: '12px' }} />}
            </button>
          );
        })}
      </div>

      {/* Comparison Matrix Table */}
      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #1e293b' }}>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Performance Metric</th>
              <th style={{ color: '#f43f5e' }}>Baseline Steel</th>
              <th style={{ color: '#38bdf8' }}>Selected Design</th>
              <th style={{ color: '#10b981' }}>Delta / Improvement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500', color: '#cbd5e1' }}>Min Indoor Temp (Unheated)</td>
              <td style={{ color: '#f43f5e' }}>{baseline.impact.min_indoor_temp_unheated} °C</td>
              <td style={{ color: '#38bdf8' }}>{selected.impact.min_indoor_temp_unheated} °C</td>
              <td style={{ color: '#10b981', fontWeight: '700' }}>
                +{(selected.impact.min_indoor_temp_unheated - baseline.impact.min_indoor_temp_unheated).toFixed(1)} °C warmer
              </td>
            </tr>

            <tr>
              <td style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500', color: '#cbd5e1' }}>Total Heat Loss (24h)</td>
              <td style={{ color: '#f43f5e' }}>{baseline.energy.total_heat_loss_kwh} kWh</td>
              <td style={{ color: '#38bdf8' }}>{selected.energy.total_heat_loss_kwh} kWh</td>
              <td style={{ color: '#10b981', fontWeight: '700' }}>
                -{(baseline.energy.total_heat_loss_kwh - selected.energy.total_heat_loss_kwh).toFixed(1)} kWh/day
              </td>
            </tr>

            <tr>
              <td style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500', color: '#cbd5e1' }}>Heating Energy Required</td>
              <td style={{ color: '#f43f5e' }}>{baseline.energy.heating_required_kwh} kWh</td>
              <td style={{ color: '#38bdf8' }}>{selected.energy.heating_required_kwh} kWh</td>
              <td style={{ color: '#10b981', fontWeight: '700' }}>
                -{(baseline.energy.heating_required_kwh - selected.energy.heating_required_kwh).toFixed(1)} kWh/day
              </td>
            </tr>

            <tr>
              <td style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500', color: '#cbd5e1' }}>Diesel Consumption</td>
              <td style={{ color: '#f43f5e', fontWeight: '700' }}>{baseline.impact.diesel_litres_per_day} L/day</td>
              <td style={{ color: '#38bdf8', fontWeight: '700' }}>{selected.impact.diesel_litres_per_day} L/day</td>
              <td style={{ color: '#10b981', fontWeight: '700' }}>
                -{savings_diesel_litres_day} L/day ({savings_percent}%)
              </td>
            </tr>

            <tr>
              <td style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500', color: '#cbd5e1' }}>CO₂ Emissions</td>
              <td style={{ color: '#f43f5e' }}>{baseline.impact.co2_kg_per_day} kg/day</td>
              <td style={{ color: '#38bdf8' }}>{selected.impact.co2_kg_per_day} kg/day</td>
              <td style={{ color: '#10b981', fontWeight: '700' }}>
                -{savings_co2_kg_day} kg CO₂ / day
              </td>
            </tr>

            <tr>
              <td style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500', color: '#cbd5e1' }}>Estimated Monthly Heating Cost</td>
              <td style={{ color: '#f43f5e' }}>${(baseline.impact.daily_cost_usd * 30).toFixed(0)}</td>
              <td style={{ color: '#38bdf8' }}>${(selected.impact.daily_cost_usd * 30).toFixed(0)}</td>
              <td style={{ color: '#10b981', fontWeight: '700' }}>
                Saves ~${((baseline.impact.daily_cost_usd - selected.impact.daily_cost_usd) * 30).toFixed(0)} / month
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
