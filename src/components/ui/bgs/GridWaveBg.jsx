import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * Zone 3 — Digital Terrain Grid
 * A plane of dots that undulates with sine waves — like a living digital ocean
 * viewed at a perspective angle. Dots pulse in color waves.
 */
const GridWaveBg = () => {
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
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 1000);
    camera.position.set(0, 35, 50);
    camera.lookAt(0, 0, 0);

    // Dot texture
    const c = document.createElement('canvas');
    c.width = c.height = 32;
    const cx = c.getContext('2d');
    const g = cx.createRadialGradient(16,16,0,16,16,16);
    g.addColorStop(0,'rgba(255,255,255,1)');
    g.addColorStop(0.3,'rgba(255,255,255,0.7)');
    g.addColorStop(1,'rgba(255,255,255,0)');
    cx.fillStyle = g;
    cx.fillRect(0,0,32,32);
    const dotTex = new THREE.CanvasTexture(c);

    // Grid of points
    const COLS = 60;
    const ROWS = 40;
    const SPACING = 2.2;
    const COUNT = COLS * ROWS;
    const positions = new Float32Array(COUNT * 3);
    const basePositions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);

    const col1 = new THREE.Color(0x3b82f6); // blue
    const col2 = new THREE.Color(0x5ef1df); // teal
    const col3 = new THREE.Color(0xa855f7); // purple

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const i = row * COLS + col;
        const x = (col - COLS / 2) * SPACING;
        const z = (row - ROWS / 2) * SPACING;
        positions[i*3] = x;
        positions[i*3+1] = 0;
        positions[i*3+2] = z;
        basePositions[i*3] = x;
        basePositions[i*3+1] = 0;
        basePositions[i*3+2] = z;

        // Default color
        colors[i*3] = col1.r;
        colors[i*3+1] = col1.g;
        colors[i*3+2] = col1.b;

        sizes[i] = 1.5;
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
          gl_FragColor = vec4(vColor, tex.a * 0.6);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

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

      const posAttr = geo.getAttribute('position');
      const colAttr = geo.getAttribute('color');
      const sizeAttr = geo.getAttribute('size');

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const i = row * COLS + col;
          const bx = basePositions[i*3];
          const bz = basePositions[i*3+2];

          // Wave displacement
          const wave1 = Math.sin(bx * 0.15 + t * 0.8) * Math.cos(bz * 0.12 + t * 0.6);
          const wave2 = Math.sin(bx * 0.08 - t * 0.3 + bz * 0.1) * 0.5;
          const y = (wave1 + wave2) * 3.0;

          posAttr.setY(i, y);

          // Color based on height — low=blue, mid=teal, high=purple
          const normalized = (y + 4) / 8; // map -4..4 to 0..1
          if (normalized < 0.5) {
            tempCol.lerpColors(col1, col2, normalized * 2);
          } else {
            tempCol.lerpColors(col2, col3, (normalized - 0.5) * 2);
          }
          colAttr.setXYZ(i, tempCol.r, tempCol.g, tempCol.b);

          // Size pulses with height
          sizeAttr.setX(i, 1.2 + Math.abs(y) * 0.25);
        }
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;

      // Slow camera orbit
      camera.position.x = Math.sin(t * 0.05) * 8;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      dotTex.dispose(); geo.dispose(); mat.dispose(); renderer.dispose();
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

export default GridWaveBg;
