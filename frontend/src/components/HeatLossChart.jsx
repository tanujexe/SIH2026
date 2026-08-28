import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { PieChart as PieIcon, Activity } from 'lucide-react';

const COLORS = ['#38bdf8', '#3b82f6', '#10b981', '#f59e0b', '#a855f7'];

export default function HeatLossChart({ heatLoss }) {
  if (!heatLoss) return null;

  const data = [
    { name: 'Roof', value: heatLoss.roof, percent: heatLoss.roof_percent },
    { name: 'Walls', value: heatLoss.walls, percent: heatLoss.walls_percent },
    { name: 'Floor', value: heatLoss.floor, percent: heatLoss.floor_percent },
    { name: 'Glazing', value: heatLoss.glazing, percent: heatLoss.glazing_percent },
    { name: 'Infiltration', value: heatLoss.infiltration, percent: heatLoss.infiltration_percent },
  ];

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieIcon className="w-5 h-5 text-sky-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
            Heat Loss Component Breakdown
          </h3>
        </div>
        <span className="text-xs font-mono text-sky-300 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-md">
          Total: <strong className="text-amber-300">{heatLoss.total_kwh} kWh/day</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Pie Chart Visualizer */}
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f8fafc'
                }}
                formatter={(val, name, entry) => [`${val} kWh (${entry.payload.percent}%)`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Component Loss Breakdown List */}
        <div className="space-y-2 text-xs">
          {data.map((item, idx) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="font-medium text-gray-300">{item.name} Heat Loss</span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-gray-400">{item.value} kWh</span>
                <span className="font-bold text-gray-100 w-12 text-right">{item.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
