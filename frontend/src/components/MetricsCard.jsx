import React from 'react';
import { Fuel, Leaf, Zap, Sun, DollarSign, ArrowDownRight } from 'lucide-react';

export default function MetricsCard({ energy, impact }) {
  if (!energy || !impact) return null;

  const inrCost = Math.round(impact.daily_cost_usd * 86.0); // Approx INR conversion

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Diesel Consumption Card */}
      <div className="glass-panel p-4 flex flex-col justify-between border-l-4 border-l-amber-500">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-semibold uppercase tracking-wider">Diesel Required</span>
          <Fuel className="w-4 h-4 text-amber-400" />
        </div>
        <div className="my-2">
          <div className="text-2xl font-extrabold font-mono text-amber-300">
            {impact.diesel_litres_per_day} <span className="text-sm font-normal text-amber-400">L/day</span>
          </div>
          <span className="text-[11px] text-gray-400 font-mono">
            ~{(impact.diesel_litres_per_day * 30).toFixed(0)} L / month
          </span>
        </div>
        {impact.fuel_savings_percent > 0 && (
          <div className="badge badge-amber text-[10px] self-start mt-1">
            <ArrowDownRight className="w-3 h-3" /> -{impact.fuel_savings_percent}% vs Steel
          </div>
        )}
      </div>

      {/* CO2 Emissions Card */}
      <div className="glass-panel p-4 flex flex-col justify-between border-l-4 border-l-emerald-500">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-semibold uppercase tracking-wider">CO₂ Footprint</span>
          <Leaf className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="my-2">
          <div className="text-2xl font-extrabold font-mono text-emerald-300">
            {impact.co2_kg_per_day} <span className="text-sm font-normal text-emerald-400">kg/day</span>
          </div>
          <span className="text-[11px] text-gray-400 font-mono">
            ~{(impact.co2_kg_per_day * 30).toFixed(0)} kg CO₂ / month
          </span>
        </div>
        {impact.co2_reduction_percent > 0 && (
          <div className="badge badge-emerald text-[10px] self-start mt-1">
            <ArrowDownRight className="w-3 h-3" /> -{impact.co2_reduction_percent}% CO₂
          </div>
        )}
      </div>

      {/* Heating Energy Required */}
      <div className="glass-panel p-4 flex flex-col justify-between border-l-4 border-l-sky-500">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-semibold uppercase tracking-wider">Heating Energy</span>
          <Zap className="w-4 h-4 text-sky-400" />
        </div>
        <div className="my-2">
          <div className="text-2xl font-extrabold font-mono text-sky-300">
            {energy.heating_required_kwh} <span className="text-sm font-normal text-sky-400">kWh/day</span>
          </div>
          <span className="text-[11px] text-gray-400">Total heat loss: {energy.total_heat_loss_kwh} kWh</span>
        </div>
        <div className="badge badge-cyan text-[10px] self-start mt-1">
          Heater Efficiency: 85%
        </div>
      </div>

      {/* Solar Energy Captured & Cost */}
      <div className="glass-panel p-4 flex flex-col justify-between border-l-4 border-l-purple-500">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-semibold uppercase tracking-wider">Solar & Cost</span>
          <Sun className="w-4 h-4 text-purple-400" />
        </div>
        <div className="my-2">
          <div className="text-2xl font-extrabold font-mono text-purple-300">
            {energy.solar_gain_kwh} <span className="text-sm font-normal text-purple-400">kWh Solar</span>
          </div>
          <span className="text-[11px] text-gray-300 font-mono">
            Est. Fuel Cost: ₹{inrCost}/day (${impact.daily_cost_usd})
          </span>
        </div>
        <div className="text-[10px] text-purple-300 bg-purple-950/60 border border-purple-800/60 px-2 py-0.5 rounded self-start mt-1">
          Passive Solar Gain
        </div>
      </div>
    </div>
  );
}
