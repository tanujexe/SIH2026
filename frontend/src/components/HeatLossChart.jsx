import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

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
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PieIcon style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
          <h3 style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1' }}>
            Heat Loss Component Breakdown
          </h3>
        </div>
        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#f59e0b', backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
          Total: {heatLoss.total_kwh} kWh/day
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', alignItems: 'center' }}>
        {/* Pie Chart Visualizer */}
        <div style={{ height: '220px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
          {data.map((item, idx) => (
            <div
              key={item.name}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span style={{ fontWeight: '500', color: '#cbd5e1' }}>{item.name} Heat Loss</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'monospace' }}>
                <span style={{ color: '#94a3b8' }}>{item.value} kWh</span>
                <span style={{ fontWeight: '700', color: '#38bdf8', minWidth: '42px', textAlign: 'right' }}>{item.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
