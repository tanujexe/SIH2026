import React from 'react';
import { Box, Sun, Users, Thermometer } from 'lucide-react';

export default function GeometryControls({ config, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...config, [key]: parseFloat(value) });
  };

  const wallArea = 2 * (config.length * config.height) + 2 * (config.width * config.height);
  const volume = config.length * config.width * config.height;

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Box style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
          <h3 style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1' }}>
            Shelter Geometry
          </h3>
        </div>
        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#38bdf8', backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>
          {config.length}m × {config.width}m × {config.height}m ({volume.toFixed(1)} m³)
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Length Slider */}
        <div className="slider-container">
          <div className="slider-label-row">
            <span style={{ color: '#cbd5e1', fontWeight: '500' }}>Shelter Length (m)</span>
            <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontWeight: '700', backgroundColor: '#0f172a', padding: '2px 8px', borderRadius: '4px', border: '1px solid #1e293b' }}>{config.length} m</span>
          </div>
          <input
            type="range"
            min="3"
            max="12"
            step="0.5"
            value={config.length}
            onChange={(e) => handleChange('length', e.target.value)}
            className="slider-input"
          />
        </div>

        {/* Width Slider */}
        <div className="slider-container">
          <div className="slider-label-row">
            <span style={{ color: '#cbd5e1', fontWeight: '500' }}>Shelter Width (m)</span>
            <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontWeight: '700', backgroundColor: '#0f172a', padding: '2px 8px', borderRadius: '4px', border: '1px solid #1e293b' }}>{config.width} m</span>
          </div>
          <input
            type="range"
            min="2"
            max="6"
            step="0.5"
            value={config.width}
            onChange={(e) => handleChange('width', e.target.value)}
            className="slider-input"
          />
        </div>

        {/* Height Slider */}
        <div className="slider-container">
          <div className="slider-label-row">
            <span style={{ color: '#cbd5e1', fontWeight: '500' }}>Shelter Height (m)</span>
            <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontWeight: '700', backgroundColor: '#0f172a', padding: '2px 8px', borderRadius: '4px', border: '1px solid #1e293b' }}>{config.height} m</span>
          </div>
          <input
            type="range"
            min="2"
            max="4"
            step="0.1"
            value={config.height}
            onChange={(e) => handleChange('height', e.target.value)}
            className="slider-input"
          />
        </div>

        {/* Window Area Slider */}
        <div className="slider-container">
          <div className="slider-label-row">
            <span style={{ color: '#cbd5e1', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sun style={{ width: '14px', height: '14px', color: '#f59e0b' }} /> South Glazing Area (m²)
            </span>
            <span style={{ fontFamily: 'monospace', color: '#f59e0b', fontWeight: '700', backgroundColor: '#0f172a', padding: '2px 8px', borderRadius: '4px', border: '1px solid #1e293b' }}>{config.window_area} m²</span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.min(10, Math.floor(wallArea * 0.4))}
            step="0.5"
            value={config.window_area}
            onChange={(e) => handleChange('window_area', e.target.value)}
            className="slider-input"
          />
        </div>

        {/* Target Indoor Temperature Setpoint */}
        <div className="slider-container">
          <div className="slider-label-row">
            <span style={{ color: '#cbd5e1', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Thermometer style={{ width: '14px', height: '14px', color: '#f43f5e' }} /> Comfort Setpoint (°C)
            </span>
            <span style={{ fontFamily: 'monospace', color: '#f43f5e', fontWeight: '700', backgroundColor: '#0f172a', padding: '2px 8px', borderRadius: '4px', border: '1px solid #1e293b' }}>{config.target_temperature} °C</span>
          </div>
          <input
            type="range"
            min="10"
            max="24"
            step="1"
            value={config.target_temperature}
            onChange={(e) => handleChange('target_temperature', e.target.value)}
            className="slider-input"
          />
        </div>

        {/* Occupants Count */}
        <div className="slider-container">
          <div className="slider-label-row">
            <span style={{ color: '#cbd5e1', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users style={{ width: '14px', height: '14px', color: '#c084fc' }} /> Human Occupants
            </span>
            <span style={{ fontFamily: 'monospace', color: '#c084fc', fontWeight: '700', backgroundColor: '#0f172a', padding: '2px 8px', borderRadius: '4px', border: '1px solid #1e293b' }}>{config.occupants} Persons</span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            step="1"
            value={config.occupants}
            onChange={(e) => handleChange('occupants', e.target.value)}
            className="slider-input"
          />
        </div>
      </div>
    </div>
  );
}
