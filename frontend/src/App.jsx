import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Activity,
  RotateCcw
} from 'lucide-react';

import LocationSelector from './components/LocationSelector';
import GeometryControls from './components/GeometryControls';
import MaterialSelector from './components/MaterialSelector';
import SimulationButton from './components/SimulationButton';
import TemperatureChart from './components/TemperatureChart';
import HeatLossChart from './components/HeatLossChart';
import MetricsCard from './components/MetricsCard';
import DesignComparison from './components/DesignComparison';
import Shelter3DViewer from './components/Shelter3DViewer';
import AnsysValidation from './components/AnsysValidation';

import {
  fetchSimulation,
  fetchComparison,
  fetchAnsysValidation,
  runLocalThermalSimulation
} from './services/simulationApi';

export default function App() {
  const [config, setConfig] = useState({
    location: 'leh',
    length: 6.0,
    width: 3.0,
    height: 2.5,
    window_area: 2.0,
    material: 'passive_pcm',
    occupants: 2,
    target_temperature: 18.0,
    ach: 0.5
  });

  const [isLoading, setIsLoading] = useState(false);
  const [simulationData, setSimulationData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [ansysData, setAnsysData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  // Initial simulation run on load
  useEffect(() => {
    handleRunSimulation();
  }, []);

  const handleRunSimulation = async (customConfig = config) => {
    setIsLoading(true);
    try {
      // Execute 24-hour transient thermal simulation
      const simResult = await fetchSimulation(customConfig);
      const compResult = await fetchComparison(customConfig);
      const ansysResult = await fetchAnsysValidation(customConfig);

      setSimulationData(simResult);
      setComparisonData(compResult);
      setAnsysData(ansysResult);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Simulation error:', err);
      const simResult = runLocalThermalSimulation(customConfig);
      setSimulationData(simResult);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaterialChange = (matId) => {
    const updated = { ...config, material: matId };
    setConfig(updated);
    handleRunSimulation(updated);
  };

  const handleResetDefaults = () => {
    const defaultConfig = {
      location: 'leh',
      length: 6.0,
      width: 3.0,
      height: 2.5,
      window_area: 2.0,
      material: 'passive_pcm',
      occupants: 2,
      target_temperature: 18.0,
      ach: 0.5
    };
    setConfig(defaultConfig);
    handleRunSimulation(defaultConfig);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Executive Top Header Bar */}
      <header className="app-header">
        <div className="header-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)' }}>
              <ShieldAlert style={{ width: '22px', height: '22px', color: '#ffffff' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '1rem', fontWeight: '800', tracking: '0.05em', textTransform: 'uppercase', color: '#f8fafc' }}>
                  Thermal Shelter Simulation Platform
                </h1>
                <span className="badge badge-cyan">v1.0 MVP</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Extreme-Cold Military Shelter Optimization • Leh, Ladakh (3,500m)</p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleResetDefaults}
              style={{ padding: '6px 12px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#cbd5e1', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <RotateCcw style={{ width: '14px', height: '14px' }} /> Reset Defaults
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#38bdf8' }}>
              <Activity style={{ width: '14px', height: '14px', color: '#38bdf8' }} />
              <span>Engine Status: ONLINE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace 2-Column Grid Layout */}
      <main className="dashboard-layout">
        {/* Left Sidebar Config Panel (380px) */}
        <div className="sidebar-panel">
          <LocationSelector
            location={config.location}
            onChange={(loc) => setConfig({ ...config, location: loc })}
          />

          <GeometryControls
            config={config}
            onChange={(newCfg) => setConfig(newCfg)}
          />

          <MaterialSelector
            selectedMaterial={config.material}
            onChange={handleMaterialChange}
          />

          <SimulationButton
            onRun={() => handleRunSimulation(config)}
            isLoading={isLoading}
            lastUpdated={lastUpdated}
          />
        </div>

        {/* Right Main Analytics Dashboard */}
        <div className="main-panel">
          {/* Impact Metrics KPI Cards */}
          {simulationData && (
            <MetricsCard
              energy={simulationData.energy}
              impact={simulationData.impact}
            />
          )}

          {/* 24-Hour Diurnal Temperature Curve Chart */}
          {simulationData && (
            <TemperatureChart
              timesteps={simulationData.timesteps}
              targetTemp={config.target_temperature}
              minUnheated={simulationData.impact.min_indoor_temp_unheated}
              maxUnheated={simulationData.impact.max_indoor_temp_unheated}
            />
          )}

          {/* Heat Loss Breakdown & 3D Interactive Visualizer Side-by-Side */}
          <div className="visualizer-grid">
            {simulationData && (
              <HeatLossChart heatLoss={simulationData.heat_loss} />
            )}

            {simulationData && (
              <Shelter3DViewer
                config={config}
                materialInfo={simulationData.material_info}
                heatLoss={simulationData.heat_loss}
              />
            )}
          </div>

          {/* Comparative Design Analysis Module */}
          {comparisonData && (
            <DesignComparison
              comparisonData={comparisonData}
              selectedMaterial={config.material}
              onSelectMaterial={handleMaterialChange}
            />
          )}

          {/* PyAnsys / ANSYS FEA Validation Layer */}
          {ansysData && (
            <AnsysValidation
              ansysData={ansysData}
              config={config}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1e293b', padding: '1rem 1.5rem', backgroundColor: '#0b1120', fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>DRDO Extreme-Cold Military Thermal Shelter Simulation & Optimization Platform</span>
          <span style={{ fontFamily: 'monospace', color: '#94a3b8' }}>FastAPI Transient Engine • PyANSYS FEA Integration</span>
        </div>
      </footer>
    </div>
  );
}
