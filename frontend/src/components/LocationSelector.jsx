import React from 'react';
import { MapPin, Snowflake, Sun, Mountain } from 'lucide-react';

export default function LocationSelector({ location, onChange }) {
  return (
    <div className="glass-panel p-5">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-sky-400" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Target Environment</h3>
        <span className="badge badge-cyan ml-auto">High Altitude</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label className="block">
          <span className="text-xs text-gray-400 font-medium">Deployment Location</span>
          <select
            value={location}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 block w-full rounded-lg bg-slate-900/90 border border-slate-700 text-gray-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
          >
            <option value="leh">Leh, Ladakh (Elevation: 3,500m | Winter Min: -20°C)</option>
            <option value="drass">Drass, Kargil (Elevation: 3,230m | Winter Min: -35°C)</option>
            <option value="siachen">Siachen Base Camp (Elevation: 3,600m | Winter Min: -40°C)</option>
          </select>
        </label>

        {/* Quick Weather Indicators */}
        <div className="grid grid-cols-3 gap-2 mt-1 pt-3 border-t border-slate-800 text-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-400 flex items-center gap-1">
              <Snowflake className="w-3 h-3 text-cyan-400" /> Min Temp
            </span>
            <span className="font-mono font-bold text-cyan-300">-20.0 °C</span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-gray-400 flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" /> Peak Solar
            </span>
            <span className="font-mono font-bold text-amber-300">780 W/m²</span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-gray-400 flex items-center gap-1">
              Altitude
            </span>
            <span className="font-mono font-bold text-slate-300">3,500 m</span>
          </div>
        </div>
      </div>
    </div>
  );
}
