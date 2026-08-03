import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePanoramaStore } from '../../store/usePanoramaStore';

import MarzipanoViewer from './MarzipanoViewer';
import Sidebar from './Sidebar';
import Minimap from './Minimap';
import Controls from './Controls';
import DevCoordsPanel from './DevCoordsPanel';

export default function VirtualTour() {
  const { panoramaId } = useParams();
  const navigate = useNavigate();
  
  const currentPanoramaId = usePanoramaStore((state) => state.currentPanoramaId);
  const setCurrentPanoramaId = usePanoramaStore((state) => state.setCurrentPanoramaId);
  const setPanoramas = usePanoramaStore((state) => state.setPanoramas);
  const panoramas = usePanoramaStore((state) => state.panoramas);

  // Refs to trigger Marzipano camera methods from HUD control buttons
  const zoomInRef = useRef(null);
  const zoomOutRef = useRef(null);
  const resetViewRef = useRef(null);

  // 1. Fetch navigation graph on mount
  useEffect(() => {
    fetch('./data/panoramas.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load panoramas JSON, status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.panoramas) {
          setPanoramas(data.panoramas);
          
          // If URL already specifies a panorama, navigate to it on load
          const urlId = panoramaId;
          const isValidId = data.panoramas.some((p) => p.id === urlId);
          if (urlId && isValidId) {
            setCurrentPanoramaId(urlId);
          } else if (data.panoramas.length > 0) {
            // Default to first panorama
            setCurrentPanoramaId(data.panoramas[0].id);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching panoramas.json:', err);
      });
  }, [setPanoramas, setCurrentPanoramaId]);

  // 2. Sync URL -> Zustand (Browser Back/Forward)
  useEffect(() => {
    if (panoramaId && panoramaId !== currentPanoramaId && panoramas.some((p) => p.id === panoramaId)) {
      // Set state and skip updating history array to prevent duplicate entries
      setCurrentPanoramaId(panoramaId, true);
    }
  }, [panoramaId, currentPanoramaId, setCurrentPanoramaId, panoramas]);

  // 3. (Removed) Sync Zustand -> URL (Hotspots & Sidebar actions now call navigate directly to enforce unidirectional data flow)

  return (
    <div 
      className="relative w-full h-[calc(100vh-70px)] bg-slate-950 flex overflow-hidden font-sans" 
      id="vr-container"
    >
      {/* 360 viewer canvas */}
      <MarzipanoViewer
        zoomInRef={zoomInRef}
        zoomOutRef={zoomOutRef}
        resetViewRef={resetViewRef}
      />

      {/* Floating search & detail panel */}
      <Sidebar />

      {/* Floating interactive minimap blueprint */}
      <Minimap />

      {/* Floating control action buttons */}
      <Controls
        onZoomIn={() => zoomInRef.current?.()}
        onZoomOut={() => zoomOutRef.current?.()}
        onResetView={() => resetViewRef.current?.()}
      />

      {/* Developer Coordinates Overlay */}
      <DevCoordsPanel />
    </div>
  );
}
