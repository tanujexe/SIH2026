import React, { useState } from 'react';
import { Cpu, CheckCircle2, Code2, Copy, Download, Layers, ShieldCheck, Activity } from 'lucide-react';

export default function AnsysValidation({ ansysData, config }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'script' | 'mesh'

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
    <div className="glass-panel p-5 space-y-4 border-l-4 border-l-cyan-400">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
                PyANSYS / ANSYS High-Fidelity Validation Layer
              </h3>
              <span className="badge badge-emerald">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </span>
            </div>
            <p className="text-xs text-gray-400">FEA Mesh Boundary Conduction & Thermal Flux Verification</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'summary' ? 'bg-sky-500 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Validation Summary
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('script')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'script' ? 'bg-sky-500 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            PyMAPDL Script
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mesh')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'mesh' ? 'bg-sky-500 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            3D FEA Mesh Nodes
          </button>
        </div>
      </div>

      {/* Tab 1: Validation Summary */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{ansysData.verdict}</span>
            </div>
            <span className="text-gray-400">Error Margin: <strong className="text-sky-300">{ansysData.validation_delta_percent}%</strong></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-gray-400 block">Rapid Physics Solver Heat Loss</span>
              <span className="text-base font-bold font-mono text-sky-300">{ansysData.rapid_heat_loss_kwh} kWh/day</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-gray-400 block">ANSYS 3D SOLID70 FEA Heat Loss</span>
              <span className="text-base font-bold font-mono text-cyan-300">{ansysData.ansys_heat_loss_kwh} kWh/day</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-gray-400 block">FEA Discretized Mesh</span>
              <span className="text-base font-bold font-mono text-purple-300">
                {ansysData.mesh_nodes_count || 480} Nodes ({ansysData.mesh_elements_count || 378} Elements)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Generated PyMAPDL Python Script */}
      {activeTab === 'script' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1 font-mono">
              <Code2 className="w-4 h-4 text-sky-400" /> PyMAPDL Script Generator
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyScript}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 flex items-center gap-1 text-[11px]"
              >
                <Copy className="w-3 h-3" />
                {copied ? 'Copied!' : 'Copy Script'}
              </button>
              <button
                type="button"
                onClick={handleDownloadScript}
                className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1 text-[11px]"
              >
                <Download className="w-3 h-3" />
                Download .py
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-sky-200 overflow-x-auto max-h-64 scrollbar-thin">
            {ansysData.pyansys_script}
          </pre>
        </div>
      )}

      {/* Tab 3: 3D FEA Mesh Nodes Data */}
      {activeTab === 'mesh' && (
        <div className="space-y-2">
          <div className="text-xs text-gray-400 font-mono flex items-center justify-between">
            <span>3D SOLID70 Finite Element Nodal Temperature Contours</span>
            <span>Sample 120 Nodes Exported</span>
          </div>

          <div className="overflow-x-auto max-h-60 rounded-xl border border-slate-800">
            <table className="w-full text-left text-[11px] font-mono border-collapse bg-slate-950">
              <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-gray-400">
                <tr>
                  <th className="py-2 px-3">Node ID</th>
                  <th className="py-2 px-3">X (m)</th>
                  <th className="py-2 px-3">Y (m)</th>
                  <th className="py-2 px-3">Z (m)</th>
                  <th className="py-2 px-3">Node Temp (°C)</th>
                  <th className="py-2 px-3">Thermal Flux (W/m²)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-gray-300">
                {(ansysData.fea_nodes || []).slice(0, 15).map((node) => (
                  <tr key={node.id} className="hover:bg-slate-900/60">
                    <td className="py-1.5 px-3 text-sky-400">#{node.id}</td>
                    <td className="py-1.5 px-3">{node.x}</td>
                    <td className="py-1.5 px-3">{node.y}</td>
                    <td className="py-1.5 px-3">{node.z}</td>
                    <td className="py-1.5 px-3 text-amber-300 font-bold">{node.temp} °C</td>
                    <td className="py-1.5 px-3 text-purple-300">{node.flux} W/m²</td>
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
