import React from 'react';
import { Play, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function SimulationButton({ onRun, isLoading, lastUpdated }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <button
        type="button"
        onClick={onRun}
        disabled={isLoading}
        className="btn-primary"
      >
        {isLoading ? (
          <>
            <RefreshCw style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
            <span>Running Engine...</span>
          </>
        ) : (
          <>
            <Play style={{ width: '18px', height: '18px', fill: 'currentColor' }} />
            <span>Run 24-Hour Simulation</span>
          </>
        )}
      </button>

      {lastUpdated && !isLoading && (
        <span style={{ fontSize: '0.7rem', color: '#10b981', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '6px', borderRadius: '8px' }}>
          <CheckCircle2 style={{ width: '14px', height: '14px' }} />
          <span>Ran in &lt; 15ms ({lastUpdated})</span>
        </span>
      )}
    </div>
  );
}
