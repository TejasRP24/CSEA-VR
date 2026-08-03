import React, { useEffect, useState } from 'react';
import { usePanoramaStore } from '../../store/usePanoramaStore';
import { 
  FiZoomIn, 
  FiZoomOut, 
  FiCompass, 
  FiMaximize, 
  FiMinimize, 
  FiArrowLeft, 
  FiArrowRight, 
  FiCode 
} from 'react-icons/fi';

export default function Controls({ onZoomIn, onZoomOut, onResetView, onToggleFullscreen }) {
  const currentView = usePanoramaStore((state) => state.currentView);
  const historyIndex = usePanoramaStore((state) => state.historyIndex);
  const history = usePanoramaStore((state) => state.history);
  const goBack = usePanoramaStore((state) => state.goBack);
  const goForward = usePanoramaStore((state) => state.goForward);
  const isCoordsPanelOpen = usePanoramaStore((state) => state.isCoordsPanelOpen);
  const toggleCoordsPanel = usePanoramaStore((state) => state.toggleCoordsPanel);
  
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleFullscreen = () => {
    if (onToggleFullscreen) {
      onToggleFullscreen();
    } else {
      const container = document.getElementById('vr-container');
      if (!container) return;
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  // Convert radian yaw to degrees for compass rotation
  // In Marzipano, yaw increases clockwise or counter-clockwise.
  // Negating the yaw turns the compass in the opposite direction of rotation to face North.
  const compassRotation = -((currentView.yaw * 180) / Math.PI);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-slate-950/70 hover:bg-slate-950/80 border border-white/10 p-2.5 rounded-2xl shadow-2xl backdrop-blur-xl transition-all select-none">
      
      {/* History Controls */}
      <div className="flex items-center border-r border-white/10 pr-2 mr-1 gap-1">
        <button
          onClick={goBack}
          disabled={historyIndex <= 0}
          className="p-2 rounded-xl text-white/60 hover:text-white disabled:text-white/20 disabled:hover:bg-transparent hover:bg-white/10 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
          title="Go Back"
        >
          <FiArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          className="p-2 rounded-xl text-white/60 hover:text-white disabled:text-white/20 disabled:hover:bg-transparent hover:bg-white/10 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
          title="Go Forward"
        >
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Tools */}
      <button
        onClick={onZoomIn}
        className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
        title="Zoom In"
      >
        <FiZoomIn className="w-5 h-5" />
      </button>

      <button
        onClick={onZoomOut}
        className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
        title="Zoom Out"
      >
        <FiZoomOut className="w-5 h-5" />
      </button>

      <button
        onClick={onResetView}
        className="p-2 rounded-xl text-white/85 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer relative group"
        title="Reset Orientation"
      >
        <FiCompass 
          className="w-5 h-5 transition-transform duration-100 ease-out" 
          style={{ transform: `rotate(${compassRotation}deg)` }}
        />
      </button>

      <button
        onClick={handleFullscreen}
        className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      >
        {isFullscreen ? <FiMinimize className="w-5 h-5" /> : <FiMaximize className="w-5 h-5" />}
      </button>

      {/* Developer Tool Toggle */}
      <div className="border-l border-white/10 pl-2 ml-1">
        <button
          onClick={toggleCoordsPanel}
          className={`p-2 rounded-xl active:scale-95 transition-all cursor-pointer ${
            isCoordsPanelOpen 
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title="Developer Coordinates Tool"
        >
          <FiCode className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
