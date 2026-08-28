import React from 'react';
import { Play, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function SimulationButton({ onRun, isLoading, lastUpdated }) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={onRun}
        disabled={isLoading}
        className={`flex-1 sm:flex-initial px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-3 transition-all duration-200 shadow-lg ${
          isLoading
            ? 'bg-slate-800 text-sky-400 cursor-not-allowed border border-sky-500/30'
            : 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-500/25 hover:shadow-sky-500/40 active:scale-98'
        }`}
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin text-sky-400" />
            <span>Running Transient Engine...</span>
          </>
        ) : (
          <>
            <Play className="w-5 h-5 fill-current" />
            <span>Run 24-Hour Simulation</span>
          </>
        )}
      </button>

      {lastUpdated && !isLoading && (
        <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/40 px-3 py-2 rounded-lg">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ran in &lt; 15ms ({lastUpdated})</span>
        </span>
      )}
    </div>
  );
}
