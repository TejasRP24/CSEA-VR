import React, { useEffect, useRef, useState } from 'react';
import Marzipano from 'marzipano';
import { usePanoramaStore } from '../../store/usePanoramaStore';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function MarzipanoViewer({ zoomInRef, zoomOutRef, resetViewRef }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const scenesRef = useRef({}); // Track initialized scenes
  const currentPanoramaId = usePanoramaStore((state) => state.currentPanoramaId);
  const panoramas = usePanoramaStore((state) => state.panoramas);
  
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialize Marzipano Viewer
  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    // Create viewer
    const viewerOpts = {
      controls: {
        mouseViewMode: 'drag',
      },
    };
    const viewer = new Marzipano.Viewer(containerRef.current, viewerOpts);
    viewerRef.current = viewer;

    // Register handlers for buttons
    const handleResize = () => {
      viewer.updateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      viewer.destroy();
      viewerRef.current = null;
      scenesRef.current = {};
    };
  }, []);

  // Handle scene creation and transition (using dynamic canvas padding to keep aspect ratio correct)
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !currentPanoramaId || panoramas.length === 0) return;

    const activePano = panoramas.find((p) => p.id === currentPanoramaId);
    if (!activePano) return;

    // Start transition fade-out and load image asynchronously
    setIsTransitioning(true);

    const img = new Image();
    img.onload = () => {
      // 1. Get horizontal FOV from panorama data, fallback to 360 degrees (full rotation)
      const hFovDeg = activePano.hFov || 360;
      
      // Calculate canvas size so the image maps pixel-for-pixel without horizontal stretching
      let canvasWidth = img.width * (360 / hFovDeg);
      let canvasHeight = canvasWidth / 2; // Strict 2:1 aspect ratio
      let drawWidth = img.width;
      let drawHeight = img.height;

      // Cap resolution to prevent WebGL Out-of-Memory crashes on high-res panoramas
      const MAX_CANVAS_WIDTH = 4096;
      if (canvasWidth > MAX_CANVAS_WIDTH) {
        const scale = MAX_CANVAS_WIDTH / canvasWidth;
        canvasWidth = MAX_CANVAS_WIDTH;
        canvasHeight = canvasWidth / 2;
        drawWidth = drawWidth * scale;
        drawHeight = drawHeight * scale;
      }

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const ctx = canvas.getContext('2d');
      // Keep top/bottom/sides blank (black background)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center the cylindrical panorama horizontally and vertically
      const drawX = (canvas.width - drawWidth) / 2;
      const drawY = (canvas.height - drawHeight) / 2;
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      // 2. Setup Marzipano Source (Use blob URL to prevent massive base64 string allocations)
      canvas.toBlob((blob) => {
        if (!blob) return;
        const blobUrl = URL.createObjectURL(blob);

        const source = new Marzipano.ImageUrlSource(() => {
          return { url: blobUrl };
        });
        const geometry = new Marzipano.EquirectGeometry([{ width: canvas.width }]);

        // 3. Compute pitch boundaries dynamically based on height fraction
        const maxPitch = (drawHeight / canvas.height) * (Math.PI / 2);
        
        const limiters = [
          Marzipano.RectilinearView.limit.resolution(canvas.width),
          Marzipano.RectilinearView.limit.vfov(0.3, (110 * Math.PI) / 180),
          Marzipano.RectilinearView.limit.hfov(0.3, (110 * Math.PI) / 180),
          Marzipano.RectilinearView.limit.pitch(-maxPitch * 0.95, maxPitch * 0.95)
        ];

        // Removed yaw limiter so users can always freely rotate 360 degrees into the black padded space

        const limiter = Marzipano.util.compose.apply(null, limiters);

        const defaultYaw = activePano.defaultView?.yaw || 0;
        const defaultPitch = activePano.defaultView?.pitch || 0;
        const defaultFov = activePano.defaultView?.fov || Math.PI / 2.2;

        const view = new Marzipano.RectilinearView(
          { yaw: defaultYaw, pitch: defaultPitch, fov: defaultFov },
          limiter
        );

        // 4. Create scene
        const scene = viewer.createScene({
          source,
          geometry,
          view,
          pinFirstLevel: true,
        });

        // 5. Add hotspots / connections
        const hotspotContainer = scene.hotspotContainer();
        if (activePano.connections && activePano.connections.length > 0) {
          activePano.connections.forEach((conn) => {
            const element = document.createElement('div');
            element.className = 'nav-hotspot-container';
            element.style.cursor = 'pointer';

            element.innerHTML = `
              <div class="nav-hotspot group">
                <div class="nav-arrow-wrapper">
                  <svg class="nav-arrow" viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                </div>
                <div class="nav-tooltip">${conn.label || 'Go forward'}</div>
              </div>
            `;

            // Navigation Click Handler (Skip animation to prevent freezing, just fade out and switch)
            element.addEventListener('click', () => {
              setIsTransitioning(true);
              setTimeout(() => {
                navigate(`/tour/${conn.target}`);
              }, 400); // Wait for fade to black before navigating
            });

            hotspotContainer.createHotspot(element, { yaw: conn.yaw, pitch: conn.pitch });
          });
        }

        // 6. Listen to view adjustments (yaw/pitch changes) to feed store
        view.addEventListener('change', () => {
          const yaw = view.yaw();
          const pitch = view.pitch();
          const fov = view.fov();
          usePanoramaStore.getState().setCurrentView(yaw, pitch, fov);
        });

        // Switch to the new scene
        scene.switchTo({ transitionDuration: 0 });
        setIsTransitioning(false); // Fade in

        // Hook up external controls buttons
        if (zoomInRef) {
          zoomInRef.current = () => {
            view.setParameters({ fov: Math.max(0.4, view.fov() - 0.15) });
          };
        }
        if (zoomOutRef) {
          zoomOutRef.current = () => {
            view.setParameters({ fov: Math.min(Math.PI * 0.65, view.fov() + 0.15) });
          };
        }
        if (resetViewRef) {
          resetViewRef.current = () => {
            view.animate({
              yaw: defaultYaw,
              pitch: defaultPitch,
              fov: defaultFov,
            }, {
              duration: 600,
            });
          };
        }

      }, 'image/jpeg', 0.90);
    };

    img.onerror = (err) => {
      console.error('Failed to load panorama image texture:', activePano.image, err);
      setIsTransitioning(false);
    };

    img.src = activePano.image;

  }, [currentPanoramaId, panoramas, zoomInRef, zoomOutRef, resetViewRef, navigate]);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden">
      
      {/* Marzipano Canvas Mount Node */}
      <div ref={containerRef} className="w-full h-full" id="marzipano-viewport" />

      {/* Framer Motion Fade Transition Layer */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="absolute inset-0 bg-slate-950 z-30 pointer-events-none flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-t-blue-500 border-white/10 animate-spin" />
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold font-sans">
                Loading Perspective...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
