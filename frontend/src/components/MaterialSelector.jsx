import React from 'react';
import { Layers, Shield, Zap, Flame } from 'lucide-react';
import { MATERIAL_PRESETS } from '../services/simulationApi';

export default function MaterialSelector({ selectedMaterial, onChange }) {
  const materials = Object.values(MATERIAL_PRESETS);

  return (
    <div className="glass-panel p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Layers className="w-5 h-5 text-sky-400" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Material Construction Preset</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {materials.map((mat) => {
          const isSelected = selectedMaterial === mat.id;
          return (
            <button
              key={mat.id}
              type="button"
              onClick={() => onChange(mat.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-950/70 border-sky-400 shadow-lg shadow-sky-500/10 ring-1 ring-sky-400'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-gray-100 flex items-center gap-1.5">
                    {mat.id === 'baseline_steel' && <Shield className="w-4 h-4 text-rose-400" />}
                    {mat.id === 'insulated' && <Zap className="w-4 h-4 text-sky-400" />}
                    {mat.id === 'passive_pcm' && <Flame className="w-4 h-4 text-amber-400" />}
                    {mat.name}
                  </span>
                  {isSelected && <span className="badge badge-cyan">Active</span>}
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  {mat.description}
                </p>
              </div>

              {/* Thermal Specs */}
              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-gray-500 block">Wall U-Value</span>
                  <span className={isSelected ? 'text-sky-300 font-bold' : 'text-gray-300'}>
                    {mat.wall_u_value} W/m²K
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">PCM Storage</span>
                  <span className={mat.pcm_enabled ? 'text-amber-400 font-bold' : 'text-gray-500'}>
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
