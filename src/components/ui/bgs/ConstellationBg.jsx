import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * Zone 2 — Visually Stunning & Confusing Double-Crossing Waves (Moiré Grid)
 * Two sets of angled ribbons of glowing particles crossing each other in 3D space,
 * undulating with complex overlapping harmonics. This creates optical moiré pattern
 * interference and mathematical depth that is visually stunning and intriguing.
 */
const ConstellationBg = () => {
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
    
    // Perspective camera
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    camera.position.set(0, 0, 105);
    camera.lookAt(0, 0, 0);

    // Create soft dot texture
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.75)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const dotTex = new THREE.CanvasTexture(canvas);

    // Set up double-crossing ribbons
    const RIBBONS_PER_SET = 8;
    const POINTS_PER_RIBBON = 160;
    const SET_COUNT = 2; // Two intersecting sets
    const COUNT = SET_COUNT * RIBBONS_PER_SET * POINTS_PER_RIBBON;

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);

    const colorsList = [
      new THREE.Color(0xa855f7), // Purple
      new THREE.Color(0xec4899), // Pink
      new THREE.Color(0xf43f5e), // Rose
      new THREE.Color(0xf97316), // Orange
      new THREE.Color(0xeab308), // Yellow/Gold
      new THREE.Color(0x10b981), // Emerald/Green
      new THREE.Color(0x06b6d4), // Cyan
      new THREE.Color(0x3b82f6), // Blue
    ];

    const getInterpolatedColor = (progress, targetColor) => {
      const pVal = Math.max(0, Math.min(0.999, progress));
      const scaled = pVal * (colorsList.length - 1);
      const idx1 = Math.floor(scaled);
      const idx2 = idx1 + 1;
      const factor = scaled - idx1;
      targetColor.lerpColors(colorsList[idx1], colorsList[idx2], factor);
    };

    // Initialize point positions
    let idx = 0;
    for (let set = 0; set < SET_COUNT; set++) {
      for (let r = 0; r < RIBBONS_PER_SET; r++) {
        const baseY = (r - (RIBBONS_PER_SET - 1) / 2) * 16;
        for (let p = 0; p < POINTS_PER_RIBBON; p++) {
          // Horizontal span
          const tVal = (p / (POINTS_PER_RIBBON - 1) - 0.5) * 260;
          const z = (r - (RIBBONS_PER_SET - 1) / 2) * -12 + (set * 6);

          // Angled coordinates to cross each other at 60 and -60 degrees
          const angle = set === 0 ? Math.PI / 6 : -Math.PI / 6;
          const x = tVal * Math.cos(angle) - baseY * Math.sin(angle);
          const y = tVal * Math.sin(angle) + baseY * Math.cos(angle);

          positions[idx * 3] = x;
          positions[idx * 3 + 1] = y;
          positions[idx * 3 + 2] = z;

          sizes[idx] = 1.0 + Math.random() * 2.2;
          idx++;
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: { uTexture: { value: dotTex } },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec3 vColor;
        void main() {
          vec4 tex = texture2D(uTexture, gl_PointCoord);
          gl_FragColor = vec4(vColor, tex.a * 0.45);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Mouse parallax target
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };
    const onMove = (e) => {
      targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 30;
      targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 15;
    };
    window.addEventListener('mousemove', onMove);

    const onResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth || window.innerWidth;
      const nh = mount.clientHeight || window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    let raf;
    const tempCol = new THREE.Color();
    
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      // Smooth camera parallax
      mouse.x += (targetMouse.x - mouse.x) * 0.03;
      mouse.y += (targetMouse.y - mouse.y) * 0.03;

      camera.position.x = mouse.x;
      camera.position.y = mouse.y;
      camera.lookAt(0, 0, 0);

      const posAttr = geo.getAttribute('position');
      const colAttr = geo.getAttribute('color');

      let ptIdx = 0;
      for (let set = 0; set < SET_COUNT; set++) {
        for (let r = 0; r < RIBBONS_PER_SET; r++) {
          const ribbonOffset = r * 0.5 + (set * 1.5);
          const baseY = (r - (RIBBONS_PER_SET - 1) / 2) * 16;
          
          for (let p = 0; p < POINTS_PER_RIBBON; p++) {
            // Get original static position vectors
            const tVal = (p / (POINTS_PER_RIBBON - 1) - 0.5) * 260;
            const z = (r - (RIBBONS_PER_SET - 1) / 2) * -12 + (set * 6);
            const angle = set === 0 ? Math.PI / 6 : -Math.PI / 6;
            
            const origX = tVal * Math.cos(angle) - baseY * Math.sin(angle);
            const origY = tVal * Math.sin(angle) + baseY * Math.cos(angle);

            // Multivariable wave functions to make coordinates fold/warp confusingly in 3D
            const wave1 = Math.sin(origX * 0.02 + t * 0.5 + ribbonOffset) * 12;
            const wave2 = Math.cos(origY * 0.015 - t * 0.4 + ribbonOffset) * 8;
            
            // Displace along the diagonal plane perpendicular to the ribbon path
            const dx = wave1 * Math.sin(angle);
            const dy = wave2 * Math.cos(angle);
            const dz = Math.sin(origX * 0.03 + t) * 5;

            posAttr.setXYZ(ptIdx, origX + dx, origY + dy, z + dz);

            // Dynamic color shift depending on coordinates, set, and wave height
            const shift = (set === 0 ? 0.0 : 0.5);
            const colorProgress = (p / (POINTS_PER_RIBBON - 1) + Math.sin(t * 0.15 + r * 0.3) * 0.2 + shift + 1.0) % 1.0;

            getInterpolatedColor(colorProgress, tempCol);
            colAttr.setXYZ(ptIdx, tempCol.r, tempCol.g, tempCol.b);

            ptIdx++;
          }
        }
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      // Slow scene rotation
      points.rotation.z = t * 0.01;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      dotTex.dispose();
      geo.dispose();
      mat.dispose();
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

export default ConstellationBg;
