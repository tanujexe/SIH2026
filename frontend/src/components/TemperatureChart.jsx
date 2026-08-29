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
import { Thermometer, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function TemperatureChart({ timesteps, targetTemp, minUnheated, maxUnheated }) {
  if (!timesteps || timesteps.length === 0) return null;

  // Sample dataset to reduce chart point density (every 3rd step = 15 min intervals)
  const chartData = timesteps.filter((_, idx) => idx % 3 === 0);

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Thermometer style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
          <div>
            <h3 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1' }}>
              24-Hour Diurnal Temperature Profile
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Leh, Ladakh Winter Weather vs Shelter Thermal Response</p>
          </div>
        </div>

        {/* Quick Min / Max Unheated Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontFamily: 'monospace' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowDownRight style={{ width: '14px', height: '14px', color: '#38bdf8' }} />
            <span style={{ color: '#94a3b8' }}>Min Unheated:</span>
            <span style={{ color: '#38bdf8', fontWeight: '700' }}>{minUnheated} °C</span>
          </div>

          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
            <span style={{ color: '#94a3b8' }}>Max Unheated:</span>
            <span style={{ color: '#f59e0b', fontWeight: '700' }}>{maxUnheated} °C</span>
          </div>
        </div>
      </div>

      {/* Recharts Line Chart */}
      <div style={{ height: '280px', width: '100%', paddingTop: '0.5rem' }}>
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
