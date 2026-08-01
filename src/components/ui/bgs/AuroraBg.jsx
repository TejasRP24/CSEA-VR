import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * Zone 1 — Aurora Waves
 * Fullscreen shader-based flowing color bands using simplex noise.
 * Soft morphing gradients like northern lights.
 */
const AuroraBg = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth || window.innerWidth, mount.clientHeight || window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(mount.clientWidth, mount.clientHeight) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        varying vec2 vUv;

        // Simplex-style noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                             -0.577350269189626, 0.024390243902439);
          vec2 i = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
          m = m*m; m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x = a0.x * x0.x + h.x * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 uv = vUv;
          float t = uTime * 0.15;

          // Layer multiple noise octaves for flowing aurora bands
          float n1 = snoise(vec2(uv.x * 1.5 + t * 0.3, uv.y * 0.8 + t * 0.1)) * 0.5 + 0.5;
          float n2 = snoise(vec2(uv.x * 2.5 - t * 0.2, uv.y * 1.2 + t * 0.15)) * 0.5 + 0.5;
          float n3 = snoise(vec2(uv.x * 0.8 + t * 0.1, uv.y * 2.0 - t * 0.08)) * 0.5 + 0.5;

          // Aurora color bands
          vec3 col1 = vec3(0.369, 0.945, 0.875); // #5ef1df teal
          vec3 col2 = vec3(0.231, 0.510, 0.965); // #3b82f6 blue
          vec3 col3 = vec3(0.659, 0.333, 0.969); // #a855f7 purple

          vec3 color = mix(col1, col2, n1);
          color = mix(color, col3, n2 * 0.5);

          // Vertical fade — aurora is stronger near top
          float verticalFade = smoothstep(0.0, 0.7, uv.y);
          // Horizontal variation
          float horizontalWave = sin(uv.x * 3.14159 + t) * 0.15 + 0.85;

          float alpha = n3 * verticalFade * horizontalWave * 0.07;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      mat.uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener('resize', onResize);

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      mat.uniforms.uTime.value = performance.now() * 0.001;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      geo.dispose(); mat.dispose(); renderer.dispose();
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

export default AuroraBg;
