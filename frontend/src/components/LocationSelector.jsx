import React from 'react';
import { MapPin, Snowflake, Sun, Mountain } from 'lucide-react';

export default function LocationSelector({ location, onChange }) {
  return (
    <div className="glass-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
          <h3 style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1' }}>
            Target Environment
          </h3>
        </div>
        <span className="badge badge-cyan">HIGH ALTITUDE</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500', marginBottom: '0.35rem' }}>
            Deployment Location
          </label>
          <select
            value={location}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="leh">Leh, Ladakh (Elevation: 3,500m | Winter Min: -20°C)</option>
            <option value="drass">Drass, Kargil (Elevation: 3,230m | Winter Min: -35°C)</option>
            <option value="siachen">Siachen Base Camp (Elevation: 3,600m | Winter Min: -40°C)</option>
          </select>
        </div>

        {/* Quick Weather Indicators Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #1e293b' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Snowflake style={{ width: '12px', height: '12px', color: '#38bdf8' }} /> Min Temp
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#38bdf8', fontSize: '0.85rem', marginTop: '4px' }}>-20.0 °C</span>
          </div>

          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sun style={{ width: '12px', height: '12px', color: '#f59e0b' }} /> Peak Solar
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#f59e0b', fontSize: '0.85rem', marginTop: '4px' }}>780 W/m²</span>
          </div>

          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mountain style={{ width: '12px', height: '12px', color: '#c084fc' }} /> Altitude
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#c084fc', fontSize: '0.85rem', marginTop: '4px' }}>3,500 m</span>
          </div>
        </div>
      </div>
    </div>
  );
}
