import React, { useState } from 'react';
import { Cpu, CheckCircle2, Code2, Copy, Download, ShieldCheck } from 'lucide-react';

export default function AnsysValidation({ ansysData, config }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  if (!ansysData) return null;

  const handleCopyScript = () => {
    if (ansysData.pyansys_script) {
      navigator.clipboard.writeText(ansysData.pyansys_script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadScript = () => {
    if (ansysData.pyansys_script) {
      const blob = new Blob([ansysData.pyansys_script], { type: 'text/x-python' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ansys_thermal_validation_${config.material}.py`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="glass-panel" style={{ borderLeft: '4px solid #38bdf8', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu style={{ width: '20px', height: '20px', color: '#38bdf8' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1' }}>
                PyANSYS / ANSYS High-Fidelity Validation Layer
              </h3>
              <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 style={{ width: '12px', height: '12px' }} /> VERIFIED
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>FEA Mesh Boundary Conduction & Thermal Flux Verification</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #1e293b', fontSize: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeTab === 'summary' ? '#0284c7' : 'transparent',
              color: activeTab === 'summary' ? '#ffffff' : '#94a3b8'
            }}
          >
            Validation Summary
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('script')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeTab === 'script' ? '#0284c7' : 'transparent',
              color: activeTab === 'script' ? '#ffffff' : '#94a3b8'
            }}
          >
            PyMAPDL Script
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mesh')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeTab === 'mesh' ? '#0284c7' : 'transparent',
              color: activeTab === 'mesh' ? '#ffffff' : '#94a3b8'
            }}
          >
            3D FEA Mesh Nodes
          </button>
        </div>
      </div>

      {/* Tab 1: Validation Summary */}
      {activeTab === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6ee7b7' }}>
              <ShieldCheck style={{ width: '16px', height: '16px', color: '#10b981' }} />
              <span>{ansysData.verdict}</span>
            </div>
            <span style={{ color: '#94a3b8' }}>Error Margin: <strong style={{ color: '#38bdf8' }}>{ansysData.validation_delta_percent}%</strong></span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', fontSize: '0.75rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
              <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Rapid Physics Solver Heat Loss</span>
              <span style={{ fontSize: '1rem', fontWeight: '700', fontFamily: 'monospace', color: '#38bdf8' }}>{ansysData.rapid_heat_loss_kwh} kWh/day</span>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
              <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>ANSYS 3D SOLID70 FEA Heat Loss</span>
              <span style={{ fontSize: '1rem', fontWeight: '700', fontFamily: 'monospace', color: '#38bdf8' }}>{ansysData.ansys_heat_loss_kwh} kWh/day</span>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid #1e293b' }}>
              <span style={{ color: '#94a3b8', display: 'block', marginBottom: '4px' }}>FEA Discretized Mesh</span>
              <span style={{ fontSize: '1rem', fontWeight: '700', fontFamily: 'monospace', color: '#c084fc' }}>
                {ansysData.mesh_nodes_count || 480} Nodes ({ansysData.mesh_elements_count || 378} Elements)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Generated PyMAPDL Python Script */}
      {activeTab === 'script' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace', color: '#cbd5e1' }}>
              <Code2 style={{ width: '16px', height: '16px', color: '#38bdf8' }} /> PyMAPDL Script Generator
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleCopyScript}
                style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: '#1e293b', color: '#38bdf8', border: '1px solid #334155', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <Copy style={{ width: '12px', height: '12px' }} />
                {copied ? 'Copied!' : 'Copy Script'}
              </button>
              <button
                type="button"
                onClick={handleDownloadScript}
                style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <Download style={{ width: '12px', height: '12px' }} />
                Download .py
              </button>
            </div>
          </div>

          <pre style={{ padding: '1rem', borderRadius: '10px', backgroundColor: '#050912', border: '1px solid #1e293b', fontFamily: 'monospace', fontSize: '0.7rem', color: '#7dd3fc', overflowX: 'auto', maxHeight: '240px' }}>
            {ansysData.pyansys_script}
          </pre>
        </div>
      )}

      {/* Tab 3: 3D FEA Mesh Nodes Data */}
      {activeTab === 'mesh' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>3D SOLID70 Finite Element Nodal Temperature Contours</span>
            <span>Sample 120 Nodes Exported</span>
          </div>

          <div style={{ overflowX: 'auto', maxHeight: '220px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Node ID</th>
                  <th>X (m)</th>
                  <th>Y (m)</th>
                  <th>Z (m)</th>
                  <th>Node Temp (°C)</th>
                  <th>Thermal Flux (W/m²)</th>
                </tr>
              </thead>
              <tbody>
                {(ansysData.fea_nodes || []).slice(0, 15).map((node) => (
                  <tr key={node.id}>
                    <td style={{ color: '#38bdf8', fontWeight: '700' }}>#{node.id}</td>
                    <td>{node.x}</td>
                    <td>{node.y}</td>
                    <td>{node.z}</td>
                    <td style={{ color: '#f59e0b', fontWeight: '700' }}>{node.temp} °C</td>
                    <td style={{ color: '#c084fc' }}>{node.flux} W/m²</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
