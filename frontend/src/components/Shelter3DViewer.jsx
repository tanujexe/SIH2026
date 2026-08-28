import React, { useState } from 'react';
import { Box, Sun, Flame, Eye } from 'lucide-react';

export default function Shelter3DViewer({ config, materialInfo, heatLoss }) {
  const [rotationY, setRotationY] = useState(-25);
  const [rotationX, setRotationX] = useState(15);

  const length = config.length || 6;
  const width = config.width || 3;
  const height = config.height || 2.5;
  const windowArea = config.window_area || 2;
  const isPcm = materialInfo?.pcm_enabled;

  // Scale dimensions for 3D canvas viewport
  const scale = 32;
  const W = length * scale;
  const H = height * scale;
  const D = width * scale;

  // Calculated coordinates to prevent double-minus or literal text in SVG points
  const halfW = W / 2;
  const halfH = H / 2;
  const halfD = D / 2;
  const d3 = D / 3;

  const roofY = -halfH;
  const roofTopY = -halfH - D * 0.25;

  const roofArrowY = roofY - 40;
  const roofTipY = roofY - 45;
  const roofBaseY = roofY - 35;

  const wallArrowX = halfW + 35;
  const wallTipX = halfW + 40;
  const wallBaseX = halfW + 30;

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-sky-400" />
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
              Interactive 3D Shelter Visualizer
            </h3>
            <p className="text-xs text-gray-400">Geometry, Solar Radiation & Thermal Flux Vectors</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {isPcm && (
            <span className="badge badge-amber flex items-center gap-1">
              <Flame className="w-3 h-3" /> Bio-PCM Layer Active
            </span>
          )}
          <span className="badge badge-cyan font-mono">{length}m × {width}m × {height}m</span>
        </div>
      </div>

      {/* 3D Isometric Viewport Container */}
      <div
        className="relative w-full h-72 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseMove={(e) => {
          if (e.buttons === 1) {
            setRotationY((prev) => prev + e.movementX * 0.5);
            setRotationX((prev) => Math.max(-40, Math.min(50, prev - e.movementY * 0.5)));
          }
        }}
      >
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Floating Controls Overlay */}
        <div className="absolute top-3 left-3 text-[11px] font-mono text-gray-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800 pointer-events-none flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-sky-400" /> Drag to Rotate 3D Model
        </div>

        {/* Solar Radiation Angle Highlight */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/40 border border-amber-800/50 px-2.5 py-1 rounded-lg">
          <Sun className="w-4 h-4 text-amber-400" />
          <span className="font-mono font-semibold">South Sun (780 W/m²)</span>
        </div>

        {/* SVG Isometric 3D Rendering */}
        <svg
          width="420"
          height="240"
          viewBox="-200 -120 400 240"
          className="transition-transform duration-75"
          style={{
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          <defs>
            <linearGradient id="frontWall" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="roofWall" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="sideWall" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Isometric Ground Shadow */}
          <polygon
            points={`${-halfW - 10},${halfH + 20} ${halfW + 20},${halfH + 20} ${halfW + halfD + 20},${halfH - halfD / 2 + 20} ${-halfW + halfD / 2 - 10},${halfH - halfD / 2 + 20}`}
            fill="#000000"
            fillOpacity="0.4"
          />

          {/* 3D Box Geometry */}
          {/* Back Wall Wireframe */}
          <polygon
            points={`${-halfW},${-halfH} ${halfW},${-halfH} ${halfW + halfD},${-halfH - halfD} ${-halfW + halfD},${-halfH - halfD}`}
            fill="url(#sideWall)"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Roof Panel */}
          <polygon
            points={`${-halfW},${-halfH} ${halfW},${-halfH} ${halfW + d3},${roofTopY} ${-halfW + d3},${roofTopY}`}
            fill="url(#roofWall)"
            stroke="#38bdf8"
            strokeWidth="2"
          />

          {/* Main Front Wall */}
          <polygon
            points={`${-halfW},${-halfH} ${halfW},${-halfH} ${halfW},${halfH} ${-halfW},${halfH}`}
            fill="url(#frontWall)"
            stroke="#38bdf8"
            strokeWidth="2"
          />

          {/* Side Right Wall */}
          <polygon
            points={`${halfW},${-halfH} ${halfW + d3},${roofTopY} ${halfW + d3},${halfH - d3} ${halfW},${halfH}`}
            fill="url(#sideWall)"
            stroke="#38bdf8"
            strokeWidth="2"
          />

          {/* South-Facing Window Glazing */}
          {windowArea > 0 && (
            <rect
              x={-halfW / 2}
              y={-halfH / 2}
              width={halfW}
              height={halfH}
              fill="#38bdf8"
              fillOpacity="0.35"
              stroke="#f59e0b"
              strokeWidth="2.5"
              rx="4"
            />
          )}

          {/* Animated Solar Radiation Rays */}
          {windowArea > 0 && (
            <g>
              <line x1="-140" y1="-100" x2="-20" y2="0" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5 5" />
              <line x1="-120" y1="-110" x2="0" y2="-10" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5 5" />
              <polygon points="-20,0 -25,-10 -10,-5" fill="#f59e0b" />
            </g>
          )}

          {/* Heat Loss Vector Arrows (Roof & Wall escaping heat) */}
          <g>
            {/* Roof Heat Loss Arrow */}
            <line x1="0" y1={roofY - 5} x2="0" y2={roofArrowY} stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
            <polygon points={`0,${roofTipY} -5,${roofBaseY} 5,${roofBaseY}`} fill="#f43f5e" />
            <text x="10" y={roofY - 25} fill="#f43f5e" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
              Roof: {heatLoss?.roof_percent || 38}%
            </text>

            {/* Wall Heat Loss Arrow */}
            <line x1={halfW + 5} y1="0" x2={wallArrowX} y2="0" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
            <polygon points={`${wallTipX},0 ${wallBaseX},-5 ${wallBaseX},5`} fill="#3b82f6" />
            <text x={halfW + 10} y="-10" fill="#3b82f6" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
              Wall: {heatLoss?.walls_percent || 22}%
            </text>
          </g>
        </svg>
      </div>

      {/* Legend & Specs Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
        <div className="flex items-center gap-1.5 text-sky-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span>Wall Area: {((2 * (length * height) + 2 * (width * height)) - windowArea).toFixed(1)} m²</span>
        </div>

        <div className="flex items-center gap-1.5 text-amber-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Glazing: {windowArea} m² (South)</span>
        </div>

        <div className="flex items-center gap-1.5 text-rose-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <span>Roof Area: {(length * width).toFixed(1)} m²</span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>Vol: {(length * width * height).toFixed(1)} m³</span>
        </div>
      </div>
    </div>
  );
}
