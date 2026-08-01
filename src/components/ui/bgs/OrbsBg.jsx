import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * Zone 5 — Floating Gradient Orbs
 * Large soft gradient spheres slowly drifting and overlapping
 * with additive blending. Like premium macOS-style blobs.
 * Warm amber/gold tones.
 */
const OrbsBg = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth || window.innerWidth;
    const h = mount.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-w/2, w/2, h/2, -h/2, 0.1, 1000);
    camera.position.z = 100;

    // Gradient circle texture
    const makeGradientTex = (color1, color2) => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 256;
      const ctx = cv.getContext('2d');
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, color1);
      g.addColorStop(0.5, color2);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(cv);
    };

    const orbData = [
      { size: 380, color1: 'rgba(245,158,11,0.25)', color2: 'rgba(245,158,11,0.03)', x: w*0.3, y: h*0.2, sx: 0.12, sy: 0.08, px: 0 },
      { size: 300, color1: 'rgba(168,85,247,0.18)', color2: 'rgba(168,85,247,0.02)', x: -w*0.25, y: -h*0.15, sx: 0.09, sy: 0.11, px: 1.5 },
      { size: 420, color1: 'rgba(94,241,223,0.12)', color2: 'rgba(94,241,223,0.01)', x: w*0.1, y: -h*0.3, sx: 0.07, sy: 0.06, px: 3 },
      { size: 260, color1: 'rgba(59,130,246,0.15)', color2: 'rgba(59,130,246,0.02)', x: -w*0.35, y: h*0.25, sx: 0.10, sy: 0.13, px: 4.5 },
      { size: 340, color1: 'rgba(245,158,11,0.14)', color2: 'rgba(245,158,11,0.01)', x: w*0.4, y: -h*0.1, sx: 0.06, sy: 0.09, px: 2 },
    ];

    const orbs = orbData.map(({ size, color1, color2, x, y, sx, sy, px }) => {
      const tex = makeGradientTex(color1, color2);
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(size, size, 1);
      sprite.position.set(x, y, 0);
      sprite.userData = { baseX: x, baseY: y, sx, sy, px, tex };
      scene.add(sprite);
      return sprite;
    });

    const onResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth || window.innerWidth;
      const nh = mount.clientHeight || window.innerHeight;
      camera.left = -nw/2; camera.right = nw/2;
      camera.top = nh/2; camera.bottom = -nh/2;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      orbs.forEach((orb) => {
        const d = orb.userData;
        orb.position.x = d.baseX + Math.sin(t * d.sx + d.px) * 80;
        orb.position.y = d.baseY + Math.cos(t * d.sy + d.px) * 60;
        // Subtle scale breathing
        const breath = 1 + Math.sin(t * 0.3 + d.px) * 0.08;
        const s = orb.scale.x / breath; // undo previous
        orb.scale.setScalar(s * (1 + Math.sin(t * 0.3 + d.px) * 0.08));
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      orbs.forEach(o => { o.userData.tex.dispose(); o.material.dispose(); });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} style={{
      position: 'fixed', inset: 0, width: '100%', height: '100%',
      zIndex: 0, pointerEvents: 'none', overflow: 'hidden',
    }} />
  );
};

export default OrbsBg;
