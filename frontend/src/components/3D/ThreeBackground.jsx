import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    let animationFrameId;

    // ── Scene ──
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#050505', 0.015);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 12);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // ── Ambient volumetric fog particles ──
    const fogParticleCount = 2000;
    const fogGeom = new THREE.BufferGeometry();
    const fogPositions = new Float32Array(fogParticleCount * 3);
    const fogSizes = new Float32Array(fogParticleCount);
    const fogPhases = new Float32Array(fogParticleCount);

    for (let i = 0; i < fogParticleCount; i++) {
      fogPositions[i * 3]     = (Math.random() - 0.5) * 60;
      fogPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      fogPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      fogSizes[i] = Math.random() * 1.5 + 0.5;
      fogPhases[i] = Math.random() * Math.PI * 2;
    }

    fogGeom.setAttribute('position', new THREE.BufferAttribute(fogPositions, 3));
    fogGeom.setAttribute('size', new THREE.BufferAttribute(fogSizes, 1));
    fogGeom.setAttribute('phase', new THREE.BufferAttribute(fogPhases, 1));

    const fogMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        uniform float time;
        attribute float size;
        attribute float phase;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          pos.y += sin(time * 0.3 + phase) * 0.5;
          pos.x += cos(time * 0.2 + phase * 1.3) * 0.3;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (80.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
          vAlpha = smoothstep(40.0, 5.0, -mv.z) * 0.4;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d) * vAlpha;
          gl_FragColor = vec4(0.6, 0.4, 0.2, a * 0.15);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    scene.add(new THREE.Points(fogGeom, fogMat));

    // ── Floating 3D Shield (Emergency Beacon — the hero object like shader.se's computer) ──
    const shieldGroup = new THREE.Group();
    scene.add(shieldGroup);
    shieldGroup.position.set(3, 1.5, 0);

    // Outer ring
    const ringGeom = new THREE.TorusGeometry(3, 0.08, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({ color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 2.5, metalness: 1, roughness: 0.2 });
    const ring1 = new THREE.Mesh(ringGeom, ringMat);
    shieldGroup.add(ring1);

    const ring2 = ring1.clone();
    ring2.rotation.x = Math.PI / 2;
    shieldGroup.add(ring2);

    const ring3 = ring1.clone();
    ring3.rotation.y = Math.PI / 2;
    shieldGroup.add(ring3);

    // Inner icosahedron core
    const coreGeom = new THREE.IcosahedronGeometry(1.8, 1);
    const coreMat = new THREE.MeshStandardMaterial({ color: '#a855f7', emissive: '#7c3aed', emissiveIntensity: 3, wireframe: true, transparent: true, opacity: 0.5 });
    const core = new THREE.Mesh(coreGeom, coreMat);
    shieldGroup.add(core);

    // Inner glow sphere
    const glowGeom = new THREE.SphereGeometry(1.2, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({ color: '#ef4444', transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending });
    const glowSphere = new THREE.Mesh(glowGeom, glowMat);
    shieldGroup.add(glowSphere);

    // Orbiting mini-spheres
    const orbitGroup = new THREE.Group();
    shieldGroup.add(orbitGroup);
    const miniGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const miniMat = new THREE.MeshBasicMaterial({ color: '#06b6d4' });
    for (let i = 0; i < 6; i++) {
      const mini = new THREE.Mesh(miniGeom, miniMat.clone());
      mini.userData.angle = (i / 6) * Math.PI * 2;
      mini.userData.radius = 3.5 + Math.random() * 0.5;
      mini.userData.speed = 0.3 + Math.random() * 0.3;
      mini.userData.yOff = (Math.random() - 0.5) * 2;
      orbitGroup.add(mini);
    }

    // ── Atmospheric Lights ──
    const ambientLight = new THREE.AmbientLight('#1a1a2e', 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight('#ef4444', 60, 40);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight('#a855f7', 40, 40);
    pointLight2.position.set(-5, 3, -5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight('#06b6d4', 20, 30);
    pointLight3.position.set(0, -3, 8);
    scene.add(pointLight3);

    // ── Ground plane subtle grid ──
    const gridHelper = new THREE.GridHelper(60, 60, '#1a1a2e', '#0a0a0f');
    gridHelper.position.y = -5;
    gridHelper.material.opacity = 0.15;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // ── Mouse ──
    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);

    const onMouseMove = (e) => {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Resize ──
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animation Loop ──
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse follow
      mouse.x += (targetMouse.x - mouse.x) * 0.03;
      mouse.y += (targetMouse.y - mouse.y) * 0.03;

      // Cinematic parallax camera (shader.se style)
      camera.position.x = mouse.x * 2;
      camera.position.y = 2 + mouse.y * 1.5;
      camera.lookAt(3, 1.5, 0);

      // Float the shield group
      shieldGroup.position.y = 1.5 + Math.sin(t * 0.5) * 0.4;
      shieldGroup.rotation.y = t * 0.15;

      // Rotate rings at different speeds
      ring1.rotation.z = t * 0.4;
      ring2.rotation.x = Math.PI / 2 + t * 0.3;
      ring3.rotation.y = Math.PI / 2 + t * 0.5;

      // Core wobble
      core.rotation.x = t * 0.2;
      core.rotation.z = t * 0.1;

      // Glow pulse
      glowSphere.scale.setScalar(1 + Math.sin(t * 2) * 0.1);
      glowMat.opacity = 0.06 + Math.sin(t * 2) * 0.04;

      // Orbiting spheres
      orbitGroup.children.forEach(mini => {
        const a = mini.userData.angle + t * mini.userData.speed;
        const r = mini.userData.radius;
        mini.position.set(Math.cos(a) * r, mini.userData.yOff + Math.sin(t + mini.userData.angle) * 0.5, Math.sin(a) * r);
      });

      // Lights follow shield
      pointLight1.position.x = 5 + Math.sin(t * 0.5) * 3;
      pointLight2.position.z = -5 + Math.cos(t * 0.3) * 3;

      // Fog animation
      fogMat.uniforms.time.value = t;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      // Dispose everything
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 70% 50%, #1a0a0a 0%, #050505 50%, #020202 100%)'
      }}
    />
  );
}
