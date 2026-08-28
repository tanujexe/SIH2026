import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { Thermometer, Sun, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function TemperatureChart({ timesteps, targetTemp, minUnheated, maxUnheated }) {
  if (!timesteps || timesteps.length === 0) return null;

  // Sample dataset to reduce chart point density (every 3rd step = 15 min intervals)
  const chartData = timesteps.filter((_, idx) => idx % 3 === 0);

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-sky-400" />
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
              24-Hour Diurnal Temperature Profile
            </h3>
            <p className="text-xs text-gray-400">Leh, Ladakh Winter Weather vs Shelter Response</p>
          </div>
        </div>

        {/* Quick Min / Max Unheated Badges */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="bg-slate-900 border border-slate-700/80 px-2.5 py-1 rounded-md flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-gray-400">Min Unheated:</span>
            <span className="text-cyan-300 font-bold">{minUnheated} °C</span>
          </div>

          <div className="bg-slate-900 border border-slate-700/80 px-2.5 py-1 rounded-md flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-gray-400">Max Unheated:</span>
            <span className="text-amber-300 font-bold">{maxUnheated} °C</span>
          </div>
        </div>
      </div>

      {/* Recharts Line Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="time_str"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              unit="°C"
              domain={[-25, 25]}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f8fafc'
              }}
              formatter={(val, name) => [`${val} °C`, name]}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />

            {/* Target Temperature Setpoint Reference */}
            <ReferenceLine
              y={targetTemp}
              stroke="#f43f5e"
              strokeDasharray="4 4"
              label={{
                value: `Setpoint (${targetTemp}°C)`,
                fill: '#f43f5e',
                fontSize: 10,
                position: 'right'
              }}
            />

            {/* Outdoor Ambient Temperature */}
            <Line
              type="monotone"
              dataKey="ambient_temperature"
              name="Outdoor Ambient (°C)"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
            />

            {/* Unheated Shelter Indoor Temp */}
            <Line
              type="monotone"
              dataKey="indoor_temperature_unheated"
              name="Unheated Indoor (°C)"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={false}
            />

            {/* Heated Shelter Temperature Setpoint */}
            <Line
              type="monotone"
              dataKey="indoor_temperature_heated"
              name="Heated Indoor (°C)"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="2 2"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
