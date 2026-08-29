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
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Box style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
          <div>
            <h3 style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1' }}>
              Interactive 3D Shelter Visualizer
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Geometry, Solar Rays & Thermal Flux Vectors</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
          {isPcm && (
            <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Flame style={{ width: '12px', height: '12px' }} /> Bio-PCM Active
            </span>
          )}
          <span className="badge badge-cyan" style={{ fontFamily: 'monospace' }}>{length}m × {width}m × {height}m</span>
        </div>
      </div>

      {/* 3D Isometric Viewport Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          borderRadius: '10px',
          backgroundColor: '#050912',
          border: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: 'grab'
        }}
        onMouseMove={(e) => {
          if (e.buttons === 1) {
            setRotationY((prev) => prev + e.movementX * 0.5);
            setRotationX((prev) => Math.max(-40, Math.min(50, prev - e.movementY * 0.5)));
          }
        }}
      >
        {/* Floating Controls Overlay */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '0.65rem', fontFamily: 'monospace', color: '#94a3b8', backgroundColor: 'rgba(15, 23, 42, 0.85)', padding: '4px 8px', borderRadius: '4px', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '4px', pointerEvents: 'none' }}>
          <Eye style={{ width: '12px', height: '12px', color: '#38bdf8' }} /> Drag to Rotate 3D Model
        </div>

        {/* Solar Radiation Angle Highlight */}
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 8px', borderRadius: '6px' }}>
          <Sun style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
          <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>South Sun (780 W/m²)</span>
        </div>

        {/* SVG Isometric 3D Rendering */}
        <svg
          width="420"
          height="220"
          viewBox="-200 -110 400 220"
          style={{
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
            transition: 'transform 0.05s ease-out'
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', fontSize: '0.7rem', fontFamily: 'monospace' }}>
        <div style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#7dd3fc' }}>
          Wall: {((2 * (length * height) + 2 * (width * height)) - windowArea).toFixed(1)} m²
        </div>

        <div style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fcd34d' }}>
          Glazing: {windowArea} m²
        </div>

        <div style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fda4af' }}>
          Roof: {(length * width).toFixed(1)} m²
        </div>

        <div style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#6ee7b7' }}>
          Vol: {(length * width * height).toFixed(1)} m³
        </div>
      </div>
    </div>
  );
}
