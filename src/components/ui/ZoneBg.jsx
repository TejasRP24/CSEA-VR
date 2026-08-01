import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * ZoneBg — Flowing dotted particle trails along smooth curves.
 *
 * Inspired by broadmindai.in style: small glowing dots tracing
 * elegant curved paths across a dark background, with scattered
 * ambient dust particles for depth.
 *
 * Props:
 *   trailColor    hex number (default 0xff6b9d — pinkish)
 *   dustColor     hex number (default same as trailColor)
 *   trailCount    number of flowing curves (default 4)
 *   dustCount     number of ambient particles (default 200)
 *   variant       1-5, each zone gets a different curve layout
 */
const ZoneBg = ({
  trailColor = 0xff6b9d,
  dustColor,
  trailCount = 4,
  dustCount = 200,
  variant = 1,
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth || window.innerWidth, mount.clientHeight || window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ── Scene / Camera ── */
    const scene = new THREE.Scene();
    const w = mount.clientWidth || window.innerWidth;
    const h = mount.clientHeight || window.innerHeight;
    const camera = new THREE.OrthographicCamera(
      -w / 2, w / 2, h / 2, -h / 2, 0.1, 1000
    );
    camera.position.z = 100;

    /* ── Circular dot texture ── */
    const canvas2d = document.createElement('canvas');
    canvas2d.width = canvas2d.height = 32;
    const ctx = canvas2d.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    grad.addColorStop(0.7, 'rgba(255,255,255,0.15)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const dotTex = new THREE.CanvasTexture(canvas2d);

    /* ── Generate curve control points per variant ── */
    const generateCurves = () => {
      const curves = [];
      const hw = w / 2;
      const hh = h / 2;

      for (let i = 0; i < trailCount; i++) {
        const pts = [];
        const segments = 5 + Math.floor(Math.random() * 3);
        // Each variant places curves differently
        const seed = variant * 1000 + i * 137;
        const seededRandom = (n) => {
          const x = Math.sin(seed + n * 9.1) * 10000;
          return x - Math.floor(x);
        };

        // Starting region
        const startSide = (i + variant) % 4; // 0=right, 1=top, 2=left, 3=bottom
        let sx, sy;
        switch (startSide) {
          case 0: sx = hw * 0.6 + seededRandom(0) * hw * 0.4; sy = -hh + seededRandom(1) * h; break;
          case 1: sx = -hw + seededRandom(0) * w; sy = hh * 0.5 + seededRandom(1) * hh * 0.5; break;
          case 2: sx = -hw * 0.6 - seededRandom(0) * hw * 0.4; sy = -hh + seededRandom(1) * h; break;
          default: sx = -hw + seededRandom(0) * w; sy = -hh * 0.5 - seededRandom(1) * hh * 0.5; break;
        }

        pts.push(new THREE.Vector3(sx, sy, 0));

        for (let j = 1; j < segments; j++) {
          const t = j / segments;
          // Flowing curve toward opposite region
          const cx = sx + (seededRandom(j * 2) - 0.5) * w * 0.8 * t;
          const cy = sy + (seededRandom(j * 2 + 1) - 0.5) * h * 0.6 * t;
          pts.push(new THREE.Vector3(cx, cy, 0));
        }

        curves.push(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5));
      }
      return curves;
    };

    const curves = generateCurves();

    /* ── Trail particles along each curve ── */
    const DOTS_PER_TRAIL = 80;
    const trailSystems = [];

    curves.forEach((curve) => {
      const positions = new Float32Array(DOTS_PER_TRAIL * 3);
      const alphas = new Float32Array(DOTS_PER_TRAIL);
      const sizes = new Float32Array(DOTS_PER_TRAIL);

      for (let i = 0; i < DOTS_PER_TRAIL; i++) {
        const t = i / (DOTS_PER_TRAIL - 1);
        const pt = curve.getPoint(t);
        positions[i * 3] = pt.x;
        positions[i * 3 + 1] = pt.y;
        positions[i * 3 + 2] = 0;

        // Fade in from head, peak in middle, fade at tail
        const fade = Math.sin(t * Math.PI);
        alphas[i] = fade;
        // Larger dots near head of trail
        sizes[i] = 2.0 + fade * 3.0;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
      geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

      // Custom shader for per-particle alpha and size
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color(trailColor) },
          uTexture: { value: dotTex },
          uOpacity: { value: 0.65 },
        },
        vertexShader: `
          attribute float aAlpha;
          attribute float aSize;
          varying float vAlpha;
          void main() {
            vAlpha = aAlpha;
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * (1.0 + 300.0 / -mvPos.z);
            gl_Position = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform sampler2D uTexture;
          uniform float uOpacity;
          varying float vAlpha;
          void main() {
            vec4 tex = texture2D(uTexture, gl_PointCoord);
            gl_FragColor = vec4(uColor, tex.a * vAlpha * uOpacity);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geo, mat);
      scene.add(points);
      trailSystems.push({ points, curve, geo, offset: Math.random() * 100 });
    });

    /* ── Ambient dust particles ── */
    const dustPositions = new Float32Array(dustCount * 3);
    const dustAlphas = new Float32Array(dustCount);
    const dustSizes = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * w * 1.2;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * h * 1.2;
      dustPositions[i * 3 + 2] = 0;
      dustAlphas[i] = 0.1 + Math.random() * 0.4;
      dustSizes[i] = 1.0 + Math.random() * 2.0;
    }

    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute('aAlpha', new THREE.BufferAttribute(dustAlphas, 1));
    dustGeo.setAttribute('aSize', new THREE.BufferAttribute(dustSizes, 1));

    const dustMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(dustColor || trailColor) },
        uTexture: { value: dotTex },
        uOpacity: { value: 0.3 },
      },
      vertexShader: `
        attribute float aAlpha;
        attribute float aSize;
        varying float vAlpha;
        void main() {
          vAlpha = aAlpha;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (1.0 + 300.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform sampler2D uTexture;
        uniform float uOpacity;
        varying float vAlpha;
        void main() {
          vec4 tex = texture2D(uTexture, gl_PointCoord);
          gl_FragColor = vec4(uColor, tex.a * vAlpha * uOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    /* ── Resize ── */
    const onResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth || window.innerWidth;
      const nh = mount.clientHeight || window.innerHeight;
      camera.left = -nw / 2;
      camera.right = nw / 2;
      camera.top = nh / 2;
      camera.bottom = -nh / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    /* ── Animation ── */
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      // Animate trail particles flowing along the curves
      trailSystems.forEach(({ geo, curve, offset }) => {
        const posAttr = geo.getAttribute('position');
        const alphaAttr = geo.getAttribute('aAlpha');
        const sizeAttr = geo.getAttribute('aSize');

        for (let i = 0; i < DOTS_PER_TRAIL; i++) {
          // Each dot flows along the curve over time
          const base = i / (DOTS_PER_TRAIL - 1);
          const flowSpeed = 0.03;
          let param = (base + t * flowSpeed + offset) % 1.0;
          // Clamp to valid range
          param = Math.max(0, Math.min(1, param));

          const pt = curve.getPoint(param);
          posAttr.setXYZ(i, pt.x, pt.y, 0);

          // Fade based on position along trail
          const fade = Math.sin(base * Math.PI) * (0.5 + 0.5 * Math.sin(t * 0.5 + i * 0.1));
          alphaAttr.setX(i, fade);
          sizeAttr.setX(i, 2.0 + fade * 3.5);
        }

        posAttr.needsUpdate = true;
        alphaAttr.needsUpdate = true;
        sizeAttr.needsUpdate = true;
      });

      // Gentle dust drift
      const dustPos = dustGeo.getAttribute('position');
      for (let i = 0; i < dustCount; i++) {
        const y = dustPos.getY(i);
        dustPos.setY(i, y + 0.08);
        if (y > h / 2 + 20) {
          dustPos.setY(i, -h / 2 - 20);
          dustPos.setX(i, (Math.random() - 0.5) * w * 1.2);
        }
      }
      dustPos.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      dotTex.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      trailSystems.forEach(({ geo, points }) => {
        geo.dispose();
        points.material.dispose();
      });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [trailColor, dustColor, trailCount, dustCount, variant]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
};

export default ZoneBg;
