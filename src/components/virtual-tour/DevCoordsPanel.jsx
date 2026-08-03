import React, { useState } from 'react';
import { usePanoramaStore } from '../../store/usePanoramaStore';
import { FiCopy, FiCheck } from 'react-icons/fi';

export default function DevCoordsPanel() {
  const isCoordsPanelOpen = usePanoramaStore((state) => state.isCoordsPanelOpen);
  const currentView = usePanoramaStore((state) => state.currentView);
  const [copied, setCopied] = useState(false);

  if (!isCoordsPanelOpen) return null;

  const handleCopy = () => {
    const text = `"yaw": ${currentView.yaw.toFixed(4)}, "pitch": ${currentView.pitch.toFixed(4)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute top-24 right-6 z-50 bg-slate-900/90 text-white p-4 rounded-xl shadow-2xl border border-slate-700/50 backdrop-blur-lg w-72 text-xs font-mono select-none">
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-700/50">
        <span className="font-bold text-amber-400">🧭 Camera Coordinates</span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
          title="Copy yaw/pitch to JSON format"
        >
          {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-400">Yaw:</span>
          <span className="font-bold text-slate-200">{currentView.yaw.toFixed(5)} rad</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Yaw (Deg):</span>
          <span className="font-bold text-slate-200">{((currentView.yaw * 180) / Math.PI).toFixed(1)}°</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Pitch:</span>
          <span className="font-bold text-slate-200">{currentView.pitch.toFixed(5)} rad</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Pitch (Deg):</span>
          <span className="font-bold text-slate-200">{((currentView.pitch * 180) / Math.PI).toFixed(1)}°</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">FOV:</span>
          <span className="font-bold text-slate-200">{currentView.fov.toFixed(5)} rad</span>
        </div>
      </div>
      <p className="mt-3 text-[10px] text-slate-500 italic">
        Rotate the camera to see values update. Copy and paste these into panoramas.json.
      </p>
    </div>
  );
}
