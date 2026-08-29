import React from 'react';
import { Layers, Shield, Zap, Flame, Check } from 'lucide-react';
import { MATERIAL_PRESETS } from '../services/simulationApi';

export default function MaterialSelector({ selectedMaterial, onChange }) {
  const materials = Object.values(MATERIAL_PRESETS);

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <Layers style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
        <h3 style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1' }}>
          Material Construction Preset
        </h3>
      </div>

      <div className="mat-card-list">
        {materials.map((mat) => {
          const isSelected = selectedMaterial === mat.id;
          return (
            <button
              key={mat.id}
              type="button"
              onClick={() => onChange(mat.id)}
              className={`mat-card ${isSelected ? 'selected' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {mat.id === 'baseline_steel' && <Shield style={{ width: '16px', height: '16px', color: '#f43f5e' }} />}
                  {mat.id === 'insulated' && <Zap style={{ width: '16px', height: '16px', color: '#38bdf8' }} />}
                  {mat.id === 'passive_pcm' && <Flame style={{ width: '16px', height: '16px', color: '#f59e0b' }} />}
                  {mat.name}
                </span>
                {isSelected && <span className="badge badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Check style={{ width: '12px', height: '12px' }} /> ACTIVE</span>}
              </div>

              <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4', marginBottom: '0.75rem' }}>
                {mat.description}
              </p>

              {/* Thermal Specs */}
              <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', fontFamily: 'monospace' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Wall U-Value</span>
                  <span style={{ color: isSelected ? '#38bdf8' : '#cbd5e1', fontWeight: '700' }}>
                    {mat.wall_u_value} W/m²K
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#64748b', display: 'block' }}>PCM Thermal Storage</span>
                  <span style={{ color: mat.pcm_enabled ? '#f59e0b' : '#64748b', fontWeight: '700' }}>
                    {mat.pcm_enabled ? 'Bio-PCM ~18°C' : 'None'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
