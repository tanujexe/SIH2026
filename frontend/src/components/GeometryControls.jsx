import React from 'react';
import { Box, Sun, Users, Thermometer, Wind } from 'lucide-react';

export default function GeometryControls({ config, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...config, [key]: parseFloat(value) });
  };

  const wallArea = 2 * (config.length * config.height) + 2 * (config.width * config.height);
  const volume = config.length * config.width * config.height;

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-sky-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Geometry & Parameters</h3>
        </div>
        <span className="text-xs font-mono text-sky-300 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded">
          {config.length}m × {config.width}m × {config.height}m ({volume.toFixed(1)} m³)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Length Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 font-medium">Shelter Length (m)</span>
            <span className="font-mono text-cyan-300 font-semibold">{config.length} m</span>
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
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 font-medium">Shelter Width (m)</span>
            <span className="font-mono text-cyan-300 font-semibold">{config.width} m</span>
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
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 font-medium">Shelter Height (m)</span>
            <span className="font-mono text-cyan-300 font-semibold">{config.height} m</span>
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
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 font-medium flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" /> South Glazing (m²)
            </span>
            <span className="font-mono text-amber-300 font-semibold">{config.window_area} m²</span>
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
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 font-medium flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-rose-400" /> Comfort Setpoint (°C)
            </span>
            <span className="font-mono text-rose-300 font-semibold">{config.target_temperature} °C</span>
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
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 font-medium flex items-center gap-1">
              <Users className="w-3 h-3 text-purple-400" /> Human Occupants
            </span>
            <span className="font-mono text-purple-300 font-semibold">{config.occupants} Persons</span>
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
