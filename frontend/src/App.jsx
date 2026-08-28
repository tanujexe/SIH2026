import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Flame,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Award,
  ChevronRight,
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
  runLocalThermalSimulation,
  MATERIAL_PRESETS
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
      // Fallback local execution
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
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-wide uppercase bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
                  Thermal Shelter Simulation Platform
                </h1>
                <span className="badge badge-cyan text-[10px]">v1.0 MVP</span>
              </div>
              <p className="text-xs text-gray-400">Extreme-Cold Military Shelter Optimization • Leh, Ladakh (3,500m)</p>
            </div>
          </div>

          {/* Quick Header Indicators */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-gray-300 flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-sky-950/40 border border-sky-800/40 px-3 py-1.5 rounded-lg text-xs font-mono text-sky-300">
              <Activity className="w-4 h-4 text-sky-400 animate-pulse" />
              <span>Engine Status: ONLINE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Controls Drawer (4 Columns) */}
          <div className="lg:col-span-4 space-y-5">
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

          {/* Right Results Dashboard (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Impact Metrics KPI Cards */}
            {simulationData && (
              <MetricsCard
                energy={simulationData.energy}
                impact={simulationData.impact}
              />
            )}

            {/* 24-Hour Temperature Curve Chart */}
            {simulationData && (
              <TemperatureChart
                timesteps={simulationData.timesteps}
                targetTemp={config.target_temperature}
                minUnheated={simulationData.impact.min_indoor_temp_unheated}
                maxUnheated={simulationData.impact.max_indoor_temp_unheated}
              />
            )}

            {/* Heat Loss Breakdown & Interactive 3D Shelter Visualizer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Design Comparison Module */}
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
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DRDO Extreme-Cold Military Thermal Shelter Simulation & Optimization Platform</span>
          <span className="font-mono text-gray-400">FastAPI Transient Engine • PyANSYS FEA Integration</span>
        </div>
      </footer>
    </div>
  );
}
