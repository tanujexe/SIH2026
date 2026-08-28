import React from 'react';
import { GitCompare, TrendingDown, ArrowRight, Shield, Zap, Flame, Check } from 'lucide-react';
import { MATERIAL_PRESETS } from '../services/simulationApi';

export default function DesignComparison({ comparisonData, onSelectMaterial, selectedMaterial }) {
  if (!comparisonData || !comparisonData.baseline || !comparisonData.selected) return null;

  const { baseline, selected, savings_diesel_litres_day, savings_co2_kg_day, savings_percent } = comparisonData;

  const presets = [
    { id: 'baseline_steel', label: 'Baseline Steel Bunk', icon: Shield },
    { id: 'insulated', label: 'Insulated PUF/EPS', icon: Zap },
    { id: 'passive_pcm', label: 'Passive Solar + PCM', icon: Flame },
  ];

  return (
    <div className="glass-panel p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-sky-400" />
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
              Comparative Design Analysis
            </h3>
            <p className="text-xs text-gray-400">Baseline Galvanized Steel vs Selected Shelter Configuration</p>
          </div>
        </div>

        {/* Big Savings Highlight Banner */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-950/80 to-sky-950/80 border border-emerald-500/30 px-4 py-2 rounded-xl">
          <TrendingDown className="w-6 h-6 text-emerald-400" />
          <div>
            <div className="text-xs text-emerald-300 font-medium">Daily Fuel & Emission Savings</div>
            <div className="text-base font-extrabold font-mono text-emerald-300">
              -{savings_diesel_litres_day} L Diesel ({savings_percent}% reduction)
            </div>
          </div>
        </div>
      </div>

      {/* Preset Comparison Buttons */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <span className="text-xs text-gray-400 font-medium">Compare Preset:</span>
        {presets.map((p) => {
          const Icon = p.icon;
          const isSelected = selectedMaterial === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectMaterial(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-900 text-gray-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {p.label}
              {isSelected && <Check className="w-3 h-3 ml-1" />}
            </button>
          );
        })}
      </div>

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-gray-400 uppercase font-mono">
              <th className="py-2.5 px-3">Performance Metric</th>
              <th className="py-2.5 px-3 bg-slate-900/40 text-rose-300">Baseline Steel</th>
              <th className="py-2.5 px-3 bg-sky-950/40 text-sky-300">Selected Design</th>
              <th className="py-2.5 px-3 text-emerald-300">Delta / Improvement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-gray-200">
            <tr>
              <td className="py-3 px-3 font-sans font-medium text-gray-300">Min Indoor Temp (Unheated)</td>
              <td className="py-3 px-3 text-rose-400 bg-slate-900/20">{baseline.impact.min_indoor_temp_unheated} °C</td>
              <td className="py-3 px-3 text-sky-300 bg-sky-950/20">{selected.impact.min_indoor_temp_unheated} °C</td>
              <td className="py-3 px-3 text-emerald-400 font-bold">
                +{(selected.impact.min_indoor_temp_unheated - baseline.impact.min_indoor_temp_unheated).toFixed(1)} °C warmer
              </td>
            </tr>

            <tr>
              <td className="py-3 px-3 font-sans font-medium text-gray-300">Total Heat Loss (24h)</td>
              <td className="py-3 px-3 text-rose-400 bg-slate-900/20">{baseline.energy.total_heat_loss_kwh} kWh</td>
              <td className="py-3 px-3 text-sky-300 bg-sky-950/20">{selected.energy.total_heat_loss_kwh} kWh</td>
              <td className="py-3 px-3 text-emerald-400 font-bold">
                -{(baseline.energy.total_heat_loss_kwh - selected.energy.total_heat_loss_kwh).toFixed(1)} kWh/day
              </td>
            </tr>

            <tr>
              <td className="py-3 px-3 font-sans font-medium text-gray-300">Heating Energy Required</td>
              <td className="py-3 px-3 text-rose-400 bg-slate-900/20">{baseline.energy.heating_required_kwh} kWh</td>
              <td className="py-3 px-3 text-sky-300 bg-sky-950/20">{selected.energy.heating_required_kwh} kWh</td>
              <td className="py-3 px-3 text-emerald-400 font-bold">
                -{(baseline.energy.heating_required_kwh - selected.energy.heating_required_kwh).toFixed(1)} kWh/day
              </td>
            </tr>

            <tr>
              <td className="py-3 px-3 font-sans font-medium text-gray-300">Diesel Consumption</td>
              <td className="py-3 px-3 text-rose-400 bg-slate-900/20 font-bold">{baseline.impact.diesel_litres_per_day} L/day</td>
              <td className="py-3 px-3 text-sky-300 bg-sky-950/20 font-bold">{selected.impact.diesel_litres_per_day} L/day</td>
              <td className="py-3 px-3 text-emerald-400 font-bold">
                -{savings_diesel_litres_day} L/day ({savings_percent}%)
              </td>
            </tr>

            <tr>
              <td className="py-3 px-3 font-sans font-medium text-gray-300">CO₂ Emissions</td>
              <td className="py-3 px-3 text-rose-400 bg-slate-900/20">{baseline.impact.co2_kg_per_day} kg/day</td>
              <td className="py-3 px-3 text-sky-300 bg-sky-950/20">{selected.impact.co2_kg_per_day} kg/day</td>
              <td className="py-3 px-3 text-emerald-400 font-bold">
                -{savings_co2_kg_day} kg CO₂ / day
              </td>
            </tr>

            <tr>
              <td className="py-3 px-3 font-sans font-medium text-gray-300">Estimated Monthly Heating Cost</td>
              <td className="py-3 px-3 text-rose-400 bg-slate-900/20">${(baseline.impact.daily_cost_usd * 30).toFixed(0)}</td>
              <td className="py-3 px-3 text-sky-300 bg-sky-950/20">${(selected.impact.daily_cost_usd * 30).toFixed(0)}</td>
              <td className="py-3 px-3 text-emerald-400 font-bold">
                Saves ~${((baseline.impact.daily_cost_usd - selected.impact.daily_cost_usd) * 30).toFixed(0)} / month
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
