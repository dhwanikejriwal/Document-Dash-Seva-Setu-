import * as THREE from 'three';

export class ThreeWorld {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.pods = {};
    this.particles = null;
    this.ambientCards = [];
    this.unlockedCertMesh = null;
    this.clock = new THREE.Clock();
    this.isCertificateRevealed = false;
    this.podGlowColors = {
      affidavit: 0xff8c00,
      stay_15: 0x00c8ff,
      education: 0x00e676,
      distractors: 0xf43f5e
    };

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a1024, 0.035);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 5.5, 12);
    this.camera.lookAt(0, 1.2, 0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lights
    this.setupLighting();

    // 5. Environment & Floor
    this.createEnvironment();

    // 6. Interactive 3D Pods
    this.createPods();

    // 7. Floating ambient particles & paper shards
    this.createParticles();
    this.createAmbientCards();

    // 8. Central Certificate Hologram Projector
    this.createCertificateProjector();

    // Resize event
    window.addEventListener('resize', () => this.onWindowResize());

    // Animation Loop
    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x283b66, 1.8);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
    mainLight.position.set(5, 12, 8);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    this.scene.add(mainLight);

    // Colored accent rim lights
    const blueRim = new THREE.PointLight(0x00d4ff, 3, 20);
    blueRim.position.set(-6, 3, 4);
    this.scene.add(blueRim);

    const saffronRim = new THREE.PointLight(0xffaa00, 3, 20);
    saffronRim.position.set(6, 3, 4);
    this.scene.add(saffronRim);

    const greenRim = new THREE.PointLight(0x00ff88, 2.5, 18);
    greenRim.position.set(0, 6, -2);
    this.scene.add(greenRim);
  }

  createEnvironment() {
    // Cyber/Modern Holographic Floor
    const floorGeo = new THREE.PlaneGeometry(40, 40, 32, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x070c1b,
      roughness: 0.25,
      metalness: 0.85,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Grid Overlay
    const grid = new THREE.GridHelper(30, 30, 0x00f0ff, 0x172b4d);
    grid.position.y = 0.01;
    this.scene.add(grid);

    // Concentric Energy Rings
    const ringGeo1 = new THREE.RingGeometry(4.8, 5.0, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00c8ff, side: THREE.DoubleSide, transparent: true, opacity: 0.45 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.02;
    this.scene.add(ring1);
    this.centerRing1 = ring1;

    const ringGeo2 = new THREE.RingGeometry(7.2, 7.35, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xffaa00, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.02;
    this.scene.add(ring2);
    this.centerRing2 = ring2;
  }

  createPods() {
    // 4 Pods positioned along an arc
    const podConfigs = [
      { id: 'affidavit', x: -4.8, z: 0.2, color: 0xff8c00, label: 'Affidavit' },
      { id: 'stay_15', x: -1.6, z: -0.6, color: 0x00c8ff, label: '15-Year Stay' },
      { id: 'education', x: 1.6, z: -0.6, color: 0x00e676, label: 'Education' },
      { id: 'distractors', x: 4.8, z: 0.2, color: 0xf43f5e, label: 'Reject / Other' }
    ];

    podConfigs.forEach(cfg => {
      const podGroup = new THREE.Group();
      podGroup.position.set(cfg.x, 0, cfg.z);

      // Base Pedestal
      const baseGeo = new THREE.CylinderGeometry(1.2, 1.45, 0.4, 32);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x0d182e,
        roughness: 0.2,
        metalness: 0.9,
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.2;
      base.receiveShadow = true;
      base.castShadow = true;
      podGroup.add(base);

      // Inner Glowing Ring
      const ringGeo = new THREE.TorusGeometry(1.15, 0.06, 16, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: cfg.color });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.42;
      podGroup.add(ring);

      // Holographic Beam Cylinder
      const beamGeo = new THREE.CylinderGeometry(1.0, 1.0, 2.2, 32, 1, true);
      const beamMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = 1.4;
      podGroup.add(beam);

      // Floating Icon / Emblem Mesh inside pod
      let coreGeo;
      if (cfg.id === 'affidavit') {
        coreGeo = new THREE.TorusKnotGeometry(0.35, 0.1, 64, 16);
      } else if (cfg.id === 'stay_15') {
        coreGeo = new THREE.OctahedronGeometry(0.48);
      } else if (cfg.id === 'education') {
        coreGeo = new THREE.IcosahedronGeometry(0.48);
      } else {
        coreGeo = new THREE.DodecahedronGeometry(0.42);
      }

      const coreMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.5,
        roughness: 0.1,
        metalness: 0.8
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.y = 1.35;
      coreMesh.castShadow = true;
      podGroup.add(coreMesh);

      // Dynamic light for active feedback
      const podLight = new THREE.PointLight(cfg.color, 1.8, 6);
      podLight.position.y = 1.6;
      podGroup.add(podLight);

      this.scene.add(podGroup);

      this.pods[cfg.id] = {
        group: podGroup,
        beam: beam,
        core: coreMesh,
        light: podLight,
        baseColor: cfg.color,
        initialIntensity: 1.8,
        pulseSpeed: 2 + Math.random()
      };
    });
  }

  createParticles() {
    const particleCount = 600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0x00c8ff),
      new THREE.Color(0xffaa00),
      new THREE.Color(0x00e676),
      new THREE.Color(0xffffff)
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 2;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createAmbientCards() {
    // Floating miniature 3D documents in the background
    const cardGeo = new THREE.BoxGeometry(0.7, 0.95, 0.02);
    const colors = [0xffffff, 0xffe082, 0x80deea, 0xa5d6a7];

    for (let i = 0; i < 9; i++) {
      const cardMat = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        roughness: 0.4,
        metalness: 0.3,
        transparent: true,
        opacity: 0.8
      });
      const card = new THREE.Mesh(cardGeo, cardMat);
      card.position.set(
        (Math.random() - 0.5) * 16,
        3.5 + Math.random() * 4,
        -1.5 - Math.random() * 5
      );
      card.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      card.userData = {
        speedY: 0.005 + Math.random() * 0.01,
        rotSpeedX: 0.008 + Math.random() * 0.01,
        rotSpeedY: 0.01 + Math.random() * 0.012,
        initialY: card.position.y
      };
      this.scene.add(card);
      this.ambientCards.push(card);
    }
  }

  createCertificateProjector() {
    // 3D Master Certificate that will levitate and open during the unlock celebration!
    const certGroup = new THREE.Group();
    certGroup.position.set(0, -5, -1); // starts hidden below floor

    // Certificate Plaque
    const sheetGeo = new THREE.BoxGeometry(2.4, 3.2, 0.04);
    const sheetMat = new THREE.MeshStandardMaterial({
      color: 0xfff8e1,
      roughness: 0.2,
      metalness: 0.2,
      emissive: 0xffd54f,
      emissiveIntensity: 0.35
    });
    const sheet = new THREE.Mesh(sheetGeo, sheetMat);
    certGroup.add(sheet);

    // Golden Border
    const borderGeo = new THREE.BoxGeometry(2.5, 3.3, 0.03);
    const borderMat = new THREE.MeshStandardMaterial({
      color: 0xffb300,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0xff8f00,
      emissiveIntensity: 0.6
    });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.z = -0.01;
    certGroup.add(border);

    // Shiny Seal Emblem
    const sealGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.05, 32);
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });
    const seal = new THREE.Mesh(sealGeo, sealMat);
    seal.rotation.x = Math.PI / 2;
    seal.position.set(0, -0.85, 0.04);
    certGroup.add(seal);

    this.scene.add(certGroup);
    this.unlockedCertMesh = certGroup;
  }

  triggerPodSuccess(bucketId) {
    const pod = this.pods[bucketId];
    if (!pod) return;

    // Flash light & expand beam
    pod.light.intensity = 7.0;
    pod.beam.material.opacity = 0.85;

    // Spawn a quick burst ring
    const burstGeo = new THREE.RingGeometry(0.8, 1.6, 32);
    const burstMat = new THREE.MeshBasicMaterial({
      color: pod.baseColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const burst = new THREE.Mesh(burstGeo, burstMat);
    burst.rotation.x = -Math.PI / 2;
    burst.position.set(pod.group.position.x, 0.5, pod.group.position.z);
    this.scene.add(burst);

    let scale = 1;
    const animateBurst = () => {
      scale += 0.08;
      burst.scale.set(scale, scale, 1);
      burst.material.opacity -= 0.04;
      if (burst.material.opacity > 0) {
        requestAnimationFrame(animateBurst);
      } else {
        this.scene.remove(burst);
        burst.geometry.dispose();
        burst.material.dispose();
      }
    };
    animateBurst();

    // Reset beam smoothly
    setTimeout(() => {
      pod.light.intensity = pod.initialIntensity;
      pod.beam.material.opacity = 0.18;
    }, 600);
  }

  triggerPodError(bucketId) {
    const pod = this.pods[bucketId];
    if (!pod) return;

    // Shake pod slightly
    const origX = pod.group.position.x;
    let count = 0;
    const shake = () => {
      count++;
      pod.group.position.x = origX + Math.sin(count * 1.5) * 0.12;
      if (count < 14) {
        requestAnimationFrame(shake);
      } else {
        pod.group.position.x = origX;
      }
    };
    shake();
  }

  reveal3DCertificate(onComplete) {
    if (!this.unlockedCertMesh) return;
    this.isCertificateRevealed = true;

    // Animate Certificate levitating up into view with 3D rotation
    this.unlockedCertMesh.position.set(0, 0, 1);
    this.unlockedCertMesh.rotation.set(0, 0, 0);

    let progress = 0;
    const animateCert = () => {
      progress += 0.02;
      const ease = Math.sin((progress * Math.PI) / 2);
      this.unlockedCertMesh.position.y = 0.5 + ease * 2.2;
      this.unlockedCertMesh.rotation.y = ease * Math.PI * 4;
      this.unlockedCertMesh.rotation.x = Math.sin(progress * 4) * 0.15;

      // Camera push in
      this.camera.position.z = 12 - ease * 2.8;

      if (progress < 1) {
        requestAnimationFrame(animateCert);
      } else {
        if (onComplete) onComplete();
      }
    };
    animateCert();
  }

  reset3DCertificate() {
    this.isCertificateRevealed = false;
    if (this.unlockedCertMesh) {
      this.unlockedCertMesh.position.set(0, -5, -1);
      this.unlockedCertMesh.rotation.set(0, 0, 0);
    }
    this.camera.position.set(0, 5.5, 12);
  }

  onWindowResize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Rotate Concentric Rings
    if (this.centerRing1) this.centerRing1.rotation.z += delta * 0.2;
    if (this.centerRing2) this.centerRing2.rotation.z -= delta * 0.15;

    // 2. Animate Pods (Core floating & bobbing)
    Object.values(this.pods).forEach(pod => {
      if (pod.core) {
        pod.core.rotation.y += delta * 1.2;
        pod.core.rotation.x += delta * 0.4;
        pod.core.position.y = 1.35 + Math.sin(elapsedTime * pod.pulseSpeed) * 0.12;
      }
      if (pod.beam) {
        pod.beam.material.opacity = 0.14 + Math.sin(elapsedTime * pod.pulseSpeed * 2) * 0.06;
      }
    });

    // 3. Float particles
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.03;
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= delta * 0.15;
        if (positions[i] < 0) {
          positions[i] = 12;
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Animate floating ambient background cards
    this.ambientCards.forEach(card => {
      card.rotation.x += card.userData.rotSpeedX;
      card.rotation.y += card.userData.rotSpeedY;
      card.position.y += Math.sin(elapsedTime * 2 + card.position.x) * 0.003;
    });

    // 5. Idle float for unlocked 3D certificate if revealed
    if (this.isCertificateRevealed && this.unlockedCertMesh) {
      this.unlockedCertMesh.position.y = 2.7 + Math.sin(elapsedTime * 2) * 0.1;
      this.unlockedCertMesh.rotation.y += delta * 0.5;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
