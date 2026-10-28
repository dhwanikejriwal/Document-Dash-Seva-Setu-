import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCanvas() {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene with Adaptive Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xe0f2fe, 0.03);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4.5, 11);
    camera.lookAt(0, 1.0, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 4. Vibrant Cyber Lighting
    const ambientLight = new THREE.AmbientLight(0xf8fafc, 2.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
    mainLight.position.set(6, 12, 8);
    scene.add(mainLight);

    const cyanRim = new THREE.PointLight(0x00d2ff, 3.5, 25);
    cyanRim.position.set(-6, 3, 4);
    scene.add(cyanRim);

    const saffronRim = new THREE.PointLight(0xff8c00, 3.5, 25);
    saffronRim.position.set(6, 3, 4);
    scene.add(saffronRim);

    // Interactive cursor light
    const cursorLight = new THREE.PointLight(0x00e676, 4, 15);
    cursorLight.position.set(0, 2, 2);
    scene.add(cursorLight);

    // 5. Grid Floor
    const floorGeo = new THREE.PlaneGeometry(50, 50);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.4,
      metalness: 0.3
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    scene.add(floor);

    const grid = new THREE.GridHelper(36, 36, 0x0284c7, 0xcfd8dc);
    grid.position.y = 0.01;
    scene.add(grid);

    // 6. Concentric Glowing Energy Rings
    const ringGeo1 = new THREE.RingGeometry(4.8, 5.0, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00d2ff, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.02;
    scene.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(7.5, 7.7, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xffaa00, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.02;
    scene.add(ring2);

    // 7. Ambient Glowing Starfield / Warp Particles
    const particleCount = 600;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x00d2ff),
      new THREE.Color(0xff8c00),
      new THREE.Color(0x00e676),
      new THREE.Color(0xec4899),
      new THREE.Color(0xffd700)
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = Math.random() * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 24 - 2;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // 8. 3D Floating Hologram Cards
    const cardGeo = new THREE.BoxGeometry(0.7, 0.95, 0.02);
    const ambientCards = [];
    const cardMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x00d2ff, roughness: 0.2, metalness: 0.7, transparent: true, opacity: 0.65 }),
      new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.2, metalness: 0.7, transparent: true, opacity: 0.65 }),
      new THREE.MeshStandardMaterial({ color: 0x00e676, roughness: 0.2, metalness: 0.7, transparent: true, opacity: 0.65 }),
      new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.2, metalness: 0.7, transparent: true, opacity: 0.65 })
    ];

    for (let i = 0; i < 12; i++) {
      const mat = cardMaterials[i % cardMaterials.length];
      const card = new THREE.Mesh(cardGeo, mat);
      card.position.set(
        (Math.random() - 0.5) * 20,
        2.5 + Math.random() * 4.5,
        -1.0 - Math.random() * 6
      );
      card.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(card);
      ambientCards.push(card);
    }

    // Mouse movement handler
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Interactive cursor light follows mouse
      cursorLight.position.x = mouseRef.current.x * 6;
      cursorLight.position.y = mouseRef.current.y * 3 + 2.5;

      ring1.rotation.z += delta * 0.2;
      ring2.rotation.z -= delta * 0.15;

      // Slowly drifting particles
      particles.rotation.y = time * 0.025;
      const posArray = particles.geometry.attributes.position.array;
      for (let i = 1; i < posArray.length; i += 3) {
        posArray[i] -= delta * 0.2;
        if (posArray[i] < 0) posArray[i] = 14;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Card rotations
      ambientCards.forEach((c, idx) => {
        c.rotation.x += 0.005 + idx * 0.001;
        c.rotation.y += 0.006 + idx * 0.001;
        c.position.y += Math.sin(time * 2 + idx) * 0.004;
      });

      // Gentle parallax follow
      camera.position.x = mouseRef.current.x * 0.6;
      camera.position.y = 4.5 + mouseRef.current.y * 0.4;
      camera.position.z = 11;
      camera.lookAt(0, 1.0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  );
}
