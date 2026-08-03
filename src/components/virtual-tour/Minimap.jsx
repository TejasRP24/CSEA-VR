import React, { useState } from 'react';
import { usePanoramaStore } from '../../store/usePanoramaStore';
import { FiMap, FiMinus, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function Minimap() {
  const navigate = useNavigate();
  const panoramas = usePanoramaStore((state) => state.panoramas);
  const currentPanoramaId = usePanoramaStore((state) => state.currentPanoramaId);
  const currentView = usePanoramaStore((state) => state.currentView);
  const selectedBuilding = usePanoramaStore((state) => state.selectedBuilding);
  const selectedFloor = usePanoramaStore((state) => state.selectedFloor);

  const [isOpen, setIsOpen] = useState(true);

  // Filter panoramas on the current building & floor
  const floorNodes = panoramas.filter(
    (p) => p.building === selectedBuilding && p.floor === selectedFloor
  );

  const currentActiveNode = floorNodes.find((p) => p.id === currentPanoramaId);

  // Yaw is in radians. Let's convert to degrees for CSS rotation.
  // In Marzipano, yaw is clockwise, so rotating the radar beam clockwise works perfectly.
  const rotationDegrees = (currentView.yaw * 180) / Math.PI;

  return (
    <div className="absolute bottom-6 left-6 z-40 select-none">
      {isOpen ? (
        <div className="bg-slate-900/80 border border-white/10 p-3 rounded-2xl shadow-2xl backdrop-blur-xl w-72 transition-all duration-300">
          {/* Header */}
          <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-white/5">
            <div className="flex items-center gap-2 text-white/90 text-sm font-semibold">
              <FiMap className="text-blue-400" />
              <span>Floor Plan — {selectedFloor}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
            >
              <FiMinus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Map Area */}
          <div className="relative h-44 bg-slate-950/80 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
            {/* Architectural Blueprint Outline (SVG) */}
            <svg
              className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Main long corridor corridor */}
              <rect x="10" y="45" width="80" height="20" rx="2" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" />
              
              {/* Entrance lobby area */}
              <rect x="10" y="30" width="30" height="40" rx="2" fill="none" stroke="#38bdf8" strokeWidth="1" />
              
              {/* Lab 1 Block */}
              <rect x="45" y="15" width="20" height="30" rx="1" fill="none" stroke="#38bdf8" strokeWidth="0.75" />
              <text x="55" y="30" fill="#38bdf8" fontSize="4" textAnchor="middle" opacity="0.6">CS LAB 1</text>
              
              {/* Lab 2 Block */}
              <rect x="68" y="15" width="22" height="30" rx="1" fill="none" stroke="#38bdf8" strokeWidth="0.75" />
              <text x="79" y="30" fill="#38bdf8" fontSize="4" textAnchor="middle" opacity="0.6">CS LAB 2</text>

              {/* Seminar Hall */}
              <rect x="45" y="65" width="45" height="20" rx="1" fill="none" stroke="#38bdf8" strokeWidth="0.75" />
              <text x="67" y="77" fill="#38bdf8" fontSize="4" textAnchor="middle" opacity="0.6">SEMINAR HALL</text>

              {/* Elevator / Stairs */}
              <rect x="10" y="15" width="12" height="15" rx="1" fill="none" stroke="#38bdf8" strokeWidth="1" />
              <line x1="10" y1="15" x2="22" y2="30" stroke="#38bdf8" strokeWidth="0.5" />
              <line x1="22" y1="15" x2="10" y2="30" stroke="#38bdf8" strokeWidth="0.5" />
              <text x="16" y="24" fill="#38bdf8" fontSize="3" textAnchor="middle">LIFT</text>
            </svg>

            {/* Plotting interactive nodes */}
            {floorNodes.map((node) => {
              const isActive = node.id === currentPanoramaId;

              return (
                <div
                  key={node.id}
                  style={{
                    position: 'absolute',
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="z-10"
                >
                  {/* Radar effect on the active node */}
                  {isActive && (
                    <div 
                      className="absolute pointer-events-none"
                      style={{
                        transform: `rotate(${rotationDegrees}deg)`,
                        width: '0px',
                        height: '0px',
                      }}
                    >
                      {/* Visual Flashlight / Radar cone */}
                      <svg 
                        width="120" 
                        height="120" 
                        viewBox="0 0 100 100" 
                        className="absolute"
                        style={{
                          left: '-50px',
                          top: '-85px',
                        }}
                      >
                        <defs>
                          <radialGradient id="radar-glow" cx="50%" cy="80%" r="50%">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.45" />
                            <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                        {/* 45 degree radar beam */}
                        <path 
                          d="M 50 80 L 15 20 A 45 45 0 0 1 85 20 Z" 
                          fill="url(#radar-glow)" 
                        />
                      </svg>
                    </div>
                  )}

                  {/* Node Button */}
                  <button
                    onClick={() => navigate(`/tour/${node.id}`)}
                    className={`group relative w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-blue-500 ring-4 ring-blue-500/30 scale-110 shadow-lg'
                        : 'bg-white hover:bg-sky-400 hover:scale-120 border border-slate-700 shadow-md'
                    }`}
                    title={node.name}
                  >
                    {/* Ring animation on active node */}
                    {isActive && (
                      <span className="absolute inline-flex h-full w-full rounded-full animate-ping bg-blue-400 opacity-75"></span>
                    )}

                    {/* Tooltip on hover */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-white/10 shadow-lg">
                      {node.name}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900/80 border border-white/10 hover:border-white/20 p-3.5 rounded-2xl shadow-2xl backdrop-blur-xl text-white/95 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <FiMap className="w-5 h-5 text-blue-400" />
          <span className="text-xs font-semibold">Show Floor Map</span>
        </button>
      )}
    </div>
  );
}
