import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as AllSims from './AllSimulations';
import { generateSimulation } from "./simulations/generator";
import { parsePromptToJSON } from "./simulations/aiParser";
import { generateFromJSON } from "./simulations/generator";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';

export type SimulationType = 
  | 'solar-system'
  | 'bouncing-balls'
  | 'particle-explosion'
  | 'dna-helix'
  | 'gravity-wells'
  | 'wave-interference'
  | 'atom'
  | 'pendulum'
  | 'double-pendulum'
  | 'galaxy'
  | 'black-hole'
  | 'tornado'
  | 'fire'
  | 'rain'
  | 'snow'
  | 'fireworks'
  | 'lightning'
  | 'aurora'
  | 'flocking-birds'
  | 'spring-system'
  | 'cloth'
  | 'lorenz-attractor'
  | 'nebula'
  | 'lava-lamp'
  | 'asteroid-field'
  | 'fountain'
  | 'smoke'
  | 'magnetic-field'
  | 'ripples'
  | 'crystal-growth'
  | 'dynamic'
  | 'traffic'
  | 'city';

interface SimulationViewerProps {
  simulationType: SimulationType;
  query?: string;
}

export function SimulationViewer({ simulationType, query }: SimulationViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  // Post-processing is created per-mount; keep it local to avoid stale refs.
  const animationRef = useRef<number | null>(null);
  let animationData: any = null;

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    // Subtle depth cue across all scenes.
    scene.fog = new THREE.FogExp2(0x0b0b14, 0.0015);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    // Improves highlights with physically-based lighting.
    (renderer as any).physicallyCorrectLights = true;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationSpeed = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      rotationSpeed.x = deltaY * 0.01;
      rotationSpeed.y = deltaX * 0.01;
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.01;
      camera.position.z = Math.max(5, Math.min(50, camera.position.z));
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Initialize simulation
    // 🔥 DYNAMIC MULTI-OBJECT ENGINE
if (simulationType === "dynamic" && animationData) {

  // ✅ MULTIPLE OBJECTS
  if (Array.isArray(animationData)) {
  animationData.forEach(obj => {
    if (obj.group) obj.group.userData.rotate = true;
    if (obj.mesh) obj.mesh.userData.rotate = true;
  });
}

  // ✅ SINGLE OBJECT (fallback)
  else {
    if (animationData.group && animationData.group.userData.rotate) {
      animationData.group.rotation.y += 0.01;
    }

    if (animationData.mesh) {
      animationData.mesh.rotation.x += 0.01;
      animationData.mesh.rotation.y += 0.01;
    }
  }
} else {

    switch (simulationType) {
      case 'solar-system':
        animationData = initSolarSystem(scene, camera);
        break;
      case 'bouncing-balls':
        animationData = initBouncingBalls(scene, camera);
        break;
      case 'particle-explosion':
        animationData = initParticleExplosion(scene, camera);
        break;
      case 'dna-helix':
        animationData = initDNAHelix(scene, camera);
        break;
      case 'gravity-wells':
        animationData = initGravityWells(scene, camera);
        break;
      case 'wave-interference':
        animationData = initWaveInterference(scene, camera);
        break;
      case 'atom':
        animationData = initAtom(scene, camera);
        break;
      case 'pendulum':
        animationData = AllSims.initPendulum(scene, camera);
        break;
      case 'double-pendulum':
        animationData = AllSims.initDoublePendulum(scene, camera);
        break;
      case 'galaxy':
        animationData = AllSims.initGalaxy(scene, camera);
        break;
      case 'black-hole':
        animationData = AllSims.initBlackHole(scene, camera);
        break;
      case 'tornado':
        animationData = AllSims.initTornado(scene, camera);
        break;
      case 'fire':
        animationData = AllSims.initFire(scene, camera);
        break;
      case 'rain':
        animationData = AllSims.initRain(scene, camera);
        break;
      case 'snow':
        animationData = AllSims.initSnow(scene, camera);
        break;
      case 'fireworks':
        animationData = AllSims.initFireworks(scene, camera);
        break;
      case 'lightning':
        animationData = AllSims.initLightning(scene, camera);
        break;
      case 'aurora':
        animationData = AllSims.initAurora(scene, camera);
        break;
      case 'flocking-birds':
        animationData = AllSims.initFlockingBirds(scene, camera);
        break;
      case 'spring-system':
        animationData = AllSims.initSpringSystem(scene, camera);
        break;
      case 'cloth':
        animationData = AllSims.initCloth(scene, camera);
        break;
      case 'lorenz-attractor':
        animationData = AllSims.initLorenzAttractor(scene, camera);
        break;
      case 'nebula':
        animationData = AllSims.initNebula(scene, camera);
        break;
      case 'lava-lamp':
        animationData = AllSims.initLavaLamp(scene, camera);
        break;
      case 'asteroid-field':
        animationData = AllSims.initAsteroidField(scene, camera);
        break;
      case 'fountain':
        animationData = AllSims.initFountain(scene, camera);
        break;
      case 'smoke':
        animationData = AllSims.initSmoke(scene, camera);
        break;
      case 'magnetic-field':
        animationData = AllSims.initMagneticField(scene, camera);
        break;
      case 'ripples':
        animationData = AllSims.initRipples(scene, camera);
        break;
      case 'crystal-growth':
        animationData = AllSims.initCrystalGrowth(scene, camera);
        break;
      case 'traffic':
        animationData = AllSims.initTraffic(scene, camera);
      break;
      case 'city':
        animationData = AllSims.initCity(scene, camera);
      break;
    }
  }

    // Post-processing (bloom) - global “attractive” look.
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(renderer.getPixelRatio());
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const isCity = simulationType === 'city';
    const isTraffic = simulationType === 'traffic';

    const bloomStrength = isCity ? 0.35 : isTraffic ? 0.45 : 0.65;
    const bloomRadius = isCity ? 0.25 : isTraffic ? 0.35 : 0.45;
    const bloomThreshold = isCity ? 0.45 : isTraffic ? 0.4 : 0.35;

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(containerRef.current.clientWidth, containerRef.current.clientHeight),
      bloomStrength, // strength
      bloomRadius, // radius
      bloomThreshold // threshold
    );
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    // Animation loop
    const clock = new THREE.Clock();
    const fixedTimeStep = 1 / 60;
    let accumulator = 0;
    const maxSubSteps = 5;
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      const deltaTime = Math.min(clock.getDelta(), 0.05); // cap to avoid huge jumps
      accumulator += deltaTime;

      // Apply rotation from dragging
      if (rotationSpeed.x !== 0 || rotationSpeed.y !== 0) {
        scene.rotation.y += rotationSpeed.y;
        scene.rotation.x += rotationSpeed.x;
        rotationSpeed.x *= 0.95;
        rotationSpeed.y *= 0.95;
      }
if (simulationType !== "dynamic") {
      // Update simulation using fixed timesteps for consistent behavior.
      let subSteps = 0;
      while (accumulator >= fixedTimeStep && subSteps < maxSubSteps) {
        switch (simulationType) {
          case 'solar-system':
            updateSolarSystem(animationData);
            break;
          case 'bouncing-balls':
            updateBouncingBalls(animationData);
            break;
          case 'particle-explosion':
            updateParticleExplosion(animationData);
            break;
          case 'dna-helix':
            updateDNAHelix(animationData);
            break;
          case 'gravity-wells':
            updateGravityWells(animationData);
            break;
          case 'wave-interference':
            updateWaveInterference(animationData);
            break;
          case 'atom':
            updateAtom(animationData);
            break;
          case 'pendulum':
            AllSims.updatePendulum(animationData);
            break;
          case 'double-pendulum':
            AllSims.updateDoublePendulum(animationData);
            break;
          case 'galaxy':
            AllSims.updateGalaxy(animationData);
            break;
          case 'black-hole':
            AllSims.updateBlackHole(animationData);
            break;
          case 'tornado':
            AllSims.updateTornado(animationData);
            break;
          case 'fire':
            AllSims.updateFire(animationData);
            break;
          case 'rain':
            AllSims.updateRain(animationData);
            break;
          case 'snow':
            AllSims.updateSnow(animationData);
            break;
          case 'fireworks':
            AllSims.updateFireworks(animationData);
            break;
          case 'lightning':
            AllSims.updateLightning(animationData);
            break;
          case 'aurora':
            AllSims.updateAurora(animationData);
            break;
          case 'flocking-birds':
            AllSims.updateFlockingBirds(animationData);
            break;
          case 'spring-system':
            AllSims.updateSpringSystem(animationData);
            break;
          case 'cloth':
            AllSims.updateCloth(animationData);
            break;
          case 'lorenz-attractor':
            AllSims.updateLorenzAttractor(animationData);
            break;
          case 'nebula':
            AllSims.updateNebula(animationData);
            break;
          case 'lava-lamp':
            AllSims.updateLavaLamp(animationData);
            break;
          case 'asteroid-field':
            AllSims.updateAsteroidField(animationData);
            break;
          case 'fountain':
            AllSims.updateFountain(animationData);
            break;
          case 'smoke':
            AllSims.updateSmoke(animationData);
            break;
          case 'magnetic-field':
            AllSims.updateMagneticField(animationData);
            break;
          case 'ripples':
            AllSims.updateRipples(animationData);
            break;
          case 'crystal-growth':
            AllSims.updateCrystalGrowth(animationData);
            break;
          case 'traffic':
            AllSims.updateTraffic(animationData, fixedTimeStep);
            break;

          case 'city':
            AllSims.updateCity(animationData, camera, fixedTimeStep);
            break;
        }

        accumulator -= fixedTimeStep;
        subSteps++;
      }
    }
    // 🔥 DYNAMIC ANIMATION ENGINE
if (simulationType === "dynamic" && animationData) {
  const dynamicStep = Math.min(deltaTime * 60, 3);
  if (animationData.group && animationData.group.userData.rotate) {
    animationData.group.rotation.y += 0.01 * dynamicStep;
  }

  if (animationData.mesh) {
    animationData.mesh.rotation.x += 0.01 * dynamicStep;
    animationData.mesh.rotation.y += 0.01 * dynamicStep;
  }
}

      composer.render();
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      composer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      bloomPass.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [simulationType, query]);

  return <div ref={containerRef} className="w-full h-full" />;
}

// Simulation initializers and updaters

function initSolarSystem(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 25;

  // Sun
  const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
  const sunMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 1 });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);

  // Add sun light
  const sunLight = new THREE.PointLight(0xffffff, 2, 100);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  // Planets
  const planets = [
    { radius: 0.4, distance: 4, color: 0x8c7853, speed: 0.04, name: 'Mercury' },
    { radius: 0.6, distance: 6, color: 0xffc649, speed: 0.03, name: 'Venus' },
    { radius: 0.65, distance: 8, color: 0x4169e1, speed: 0.025, name: 'Earth' },
    { radius: 0.5, distance: 10, color: 0xff4500, speed: 0.02, name: 'Mars' },
    { radius: 1.2, distance: 14, color: 0xdaa520, speed: 0.015, name: 'Jupiter' },
    { radius: 1, distance: 17, color: 0xf4a460, speed: 0.01, name: 'Saturn' },
  ];

  const planetMeshes = planets.map((planet) => {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: planet.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = planet.distance;
    scene.add(mesh);

    // Add orbit line
    const curve = new THREE.EllipseCurve(0, 0, planet.distance, planet.distance, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(100);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, 0, p.y)));
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.3 });
    const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);

    return { mesh, ...planet, angle: Math.random() * Math.PI * 2 };
  });

  return { sun, planetMeshes };
}

function updateSolarSystem(data: any) {
  data.sun.rotation.y += 0.005;
  
  data.planetMeshes.forEach((planet: any) => {
    planet.angle += planet.speed;
    planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
    planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
    planet.mesh.rotation.y += 0.02;
  });
}

function initBouncingBalls(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 30;
  camera.position.y = 10;
  camera.lookAt(0, 0, 0);

  // Create floor
  const floorGeometry = new THREE.BoxGeometry(30, 0.5, 30);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -10;
  scene.add(floor);

  // Create walls
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, transparent: true, opacity: 0.3 });
  
  const walls = [
    { width: 30, height: 20, depth: 0.5, x: 0, y: 0, z: -15 },
    { width: 30, height: 20, depth: 0.5, x: 0, y: 0, z: 15 },
    { width: 0.5, height: 20, depth: 30, x: -15, y: 0, z: 0 },
    { width: 0.5, height: 20, depth: 30, x: 15, y: 0, z: 0 },
  ];

  walls.forEach(wall => {
    const geometry = new THREE.BoxGeometry(wall.width, wall.height, wall.depth);
    const mesh = new THREE.Mesh(geometry, wallMaterial);
    mesh.position.set(wall.x, wall.y, wall.z);
    scene.add(mesh);
  });

  // Create balls
  const balls = [];
  const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181, 0xaa96da, 0xfcbad3, 0xa8e6cf];
  
  for (let i = 0; i < 15; i++) {
    const radius = Math.random() * 0.8 + 0.5;
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ 
      color: colors[i % colors.length],
      metalness: 0.3,
      roughness: 0.4
    });
    const ball = new THREE.Mesh(geometry, material);
    
    ball.position.set(
      (Math.random() - 0.5) * 20,
      Math.random() * 10,
      (Math.random() - 0.5) * 20
    );
    
    scene.add(ball);
    
    balls.push({
      mesh: ball,
      velocity: {
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3,
        z: (Math.random() - 0.5) * 0.3
      },
      radius
    });
  }

  return { balls, bounds: { x: 15, y: 10, z: 15 } };
}

function updateBouncingBalls(data: any) {
  const gravity = -0.008;
  const damping = 0.98;

  data.balls.forEach((ball: any) => {
    // Apply gravity
    ball.velocity.y += gravity;

    // Update position
    ball.mesh.position.x += ball.velocity.x;
    ball.mesh.position.y += ball.velocity.y;
    ball.mesh.position.z += ball.velocity.z;

    // Bounce off walls
    if (Math.abs(ball.mesh.position.x) > data.bounds.x - ball.radius) {
      ball.velocity.x *= -damping;
      ball.mesh.position.x = Math.sign(ball.mesh.position.x) * (data.bounds.x - ball.radius);
    }
    
    if (ball.mesh.position.y - ball.radius < -data.bounds.y) {
      ball.velocity.y *= -damping;
      ball.mesh.position.y = -data.bounds.y + ball.radius;
    }
    
    if (Math.abs(ball.mesh.position.z) > data.bounds.z - ball.radius) {
      ball.velocity.z *= -damping;
      ball.mesh.position.z = Math.sign(ball.mesh.position.z) * (data.bounds.z - ball.radius);
    }

    // Add rotation
    ball.mesh.rotation.x += ball.velocity.y * 0.1;
    ball.mesh.rotation.z += ball.velocity.x * 0.1;
  });
}

function initParticleExplosion(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 30;

  const particleCount = 2000;
  const particles = [];
  const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181];

  for (let i = 0; i < particleCount; i++) {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: colors[i % colors.length] });
    const particle = new THREE.Mesh(geometry, material);
    
    scene.add(particle);
    
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const speed = Math.random() * 0.2 + 0.05;
    
    particles.push({
      mesh: particle,
      velocity: {
        x: Math.sin(phi) * Math.cos(theta) * speed,
        y: Math.sin(phi) * Math.sin(theta) * speed,
        z: Math.cos(phi) * speed
      },
      life: 1
    });
  }

  return { particles, time: 0 };
}

function updateParticleExplosion(data: any) {
  data.time += 0.01;

  data.particles.forEach((particle: any) => {
    particle.mesh.position.x += particle.velocity.x;
    particle.mesh.position.y += particle.velocity.y;
    particle.mesh.position.z += particle.velocity.z;

    particle.velocity.y -= 0.002; // Gravity

    particle.life -= 0.003;

    if (particle.life <= 0) {
      particle.mesh.position.set(0, 0, 0);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = Math.random() * 0.2 + 0.05;
      particle.velocity = {
        x: Math.sin(phi) * Math.cos(theta) * speed,
        y: Math.sin(phi) * Math.sin(theta) * speed,
        z: Math.cos(phi) * speed
      };
      particle.life = 1;
    }

    particle.mesh.scale.setScalar(particle.life);
  });
}

function initDNAHelix(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 25;
  camera.position.y = 5;

  const helixGroup = new THREE.Group();
  scene.add(helixGroup);

  const segments = 50;
  const radius = 5;
  const height = 20;
  const spheres = [];

  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 4;
    const y = (i / segments) * height - height / 2;

    // First strand
    const geometry1 = new THREE.SphereGeometry(0.3, 16, 16);
    const material1 = new THREE.MeshStandardMaterial({ color: 0x4ecdc4, emissive: 0x4ecdc4, emissiveIntensity: 0.3 });
    const sphere1 = new THREE.Mesh(geometry1, material1);
    sphere1.position.set(Math.cos(t) * radius, y, Math.sin(t) * radius);
    helixGroup.add(sphere1);

    // Second strand
    const geometry2 = new THREE.SphereGeometry(0.3, 16, 16);
    const material2 = new THREE.MeshStandardMaterial({ color: 0xff6b6b, emissive: 0xff6b6b, emissiveIntensity: 0.3 });
    const sphere2 = new THREE.Mesh(geometry2, material2);
    sphere2.position.set(Math.cos(t + Math.PI) * radius, y, Math.sin(t + Math.PI) * radius);
    helixGroup.add(sphere2);

    // Connecting line
    if (i % 3 === 0) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        sphere1.position.clone(),
        sphere2.position.clone()
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      helixGroup.add(line);
    }

    spheres.push({ sphere1, sphere2, t, y });
  }

  return { helixGroup, spheres, radius, height };
}

function updateDNAHelix(data: any) {
  data.helixGroup.rotation.y += 0.01;
}

function initGravityWells(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 30;
  camera.position.y = 15;
  camera.lookAt(0, 0, 0);

  // Create gravity wells (large spheres)
  const wells = [];
  const wellPositions = [
    { x: -8, y: 0, z: -8 },
    { x: 8, y: 0, z: -8 },
    { x: -8, y: 0, z: 8 },
    { x: 8, y: 0, z: 8 },
  ];

  wellPositions.forEach((pos, i) => {
    const geometry = new THREE.SphereGeometry(1.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ 
      color: [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3][i],
      emissive: [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3][i],
      emissiveIntensity: 0.5
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pos.x, pos.y, pos.z);
    scene.add(mesh);
    wells.push({ mesh, mass: 100 });
  });

  // Create particles
  const particles = [];
  for (let i = 0; i < 300; i++) {
    const geometry = new THREE.SphereGeometry(0.15, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const particle = new THREE.Mesh(geometry, material);
    
    particle.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 30
    );
    
    scene.add(particle);
    
    particles.push({
      mesh: particle,
      velocity: {
        x: (Math.random() - 0.5) * 0.1,
        y: (Math.random() - 0.5) * 0.1,
        z: (Math.random() - 0.5) * 0.1
      }
    });
  }

  return { wells, particles };
}

function updateGravityWells(data: any) {
  data.particles.forEach((particle: any) => {
    // Calculate gravitational forces from each well
    data.wells.forEach((well: any) => {
      const dx = well.mesh.position.x - particle.mesh.position.x;
      const dy = well.mesh.position.y - particle.mesh.position.y;
      const dz = well.mesh.position.z - particle.mesh.position.z;
      
      const distSq = dx * dx + dy * dy + dz * dz + 0.1; // Add small value to prevent division by zero
      const dist = Math.sqrt(distSq);
      const force = well.mass / distSq;
      
      particle.velocity.x += (dx / dist) * force * 0.001;
      particle.velocity.y += (dy / dist) * force * 0.001;
      particle.velocity.z += (dz / dist) * force * 0.001;
    });

    // Update position
    particle.mesh.position.x += particle.velocity.x;
    particle.mesh.position.y += particle.velocity.y;
    particle.mesh.position.z += particle.velocity.z;

    // Apply damping
    particle.velocity.x *= 0.99;
    particle.velocity.y *= 0.99;
    particle.velocity.z *= 0.99;
  });

  // Rotate wells
  data.wells.forEach((well: any) => {
    well.mesh.rotation.y += 0.02;
  });
}

function initWaveInterference(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.y = 20;
  camera.position.z = 20;
  camera.lookAt(0, 0, 0);

  const size = 50;
  const divisions = 50;
  const geometry = new THREE.PlaneGeometry(size, size, divisions, divisions);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0x4ecdc4,
    wireframe: false,
    side: THREE.DoubleSide,
    metalness: 0.3,
    roughness: 0.7
  });
  
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // Add wireframe overlay
  const wireframeGeometry = geometry.clone();
  const wireframeMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x000000,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  });
  const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
  wireframe.rotation.x = -Math.PI / 2;
  scene.add(wireframe);

  return { plane, wireframe, time: 0 };
}

function updateWaveInterference(data: any) {
  data.time += 0.05;

  const positions = data.plane.geometry.attributes.position.array as Float32Array;
  const wireframePositions = data.wireframe.geometry.attributes.position.array as Float32Array;

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const z = positions[i + 1];

    // Create interference pattern from multiple wave sources
    const wave1 = Math.sin(Math.sqrt(x * x + z * z) * 0.3 - data.time) * 2;
    const wave2 = Math.sin(Math.sqrt((x - 10) * (x - 10) + (z - 10) * (z - 10)) * 0.3 - data.time) * 2;
    const wave3 = Math.sin(Math.sqrt((x + 10) * (x + 10) + (z + 10) * (z + 10)) * 0.3 - data.time) * 2;

    const y = wave1 + wave2 + wave3;
    positions[i + 2] = y;
    wireframePositions[i + 2] = y;
  }

  data.plane.geometry.attributes.position.needsUpdate = true;
  data.wireframe.geometry.attributes.position.needsUpdate = true;
  data.plane.geometry.computeVertexNormals();
}

function initAtom(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 15;

  const atomGroup = new THREE.Group();
  scene.add(atomGroup);

  // Nucleus
  const nucleusGeometry = new THREE.SphereGeometry(1, 32, 32);
  const nucleusMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff6b6b,
    emissive: 0xff6b6b,
    emissiveIntensity: 0.5
  });
  const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
  atomGroup.add(nucleus);

  // Electron orbits
  const orbits = [
    { radius: 4, speed: 0.02, color: 0x4ecdc4 },
    { radius: 6, speed: 0.015, color: 0xffe66d },
    { radius: 8, speed: 0.01, color: 0x95e1d3 },
  ];

  const electrons = orbits.map((orbit, i) => {
    // Create orbit ring
    const orbitGeometry = new THREE.TorusGeometry(orbit.radius, 0.02, 16, 100);
    const orbitMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x444444,
      transparent: true,
      opacity: 0.3
    });
    const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbitRing.rotation.x = Math.random() * Math.PI;
    orbitRing.rotation.y = Math.random() * Math.PI;
    atomGroup.add(orbitRing);

    // Create electron
    const electronGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const electronMaterial = new THREE.MeshStandardMaterial({ 
      color: orbit.color,
      emissive: orbit.color,
      emissiveIntensity: 0.5
    });
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    atomGroup.add(electron);

    return {
      electron,
      orbitRing,
      radius: orbit.radius,
      speed: orbit.speed,
      angle: Math.random() * Math.PI * 2
    };
  });

  return { atomGroup, nucleus, electrons };
}

function updateAtom(data: any) {
  data.atomGroup.rotation.y += 0.005;
  data.nucleus.rotation.y += 0.02;

  data.electrons.forEach((e: any) => {
    e.angle += e.speed;
    
    const x = Math.cos(e.angle) * e.radius;
    const y = Math.sin(e.angle) * e.radius * Math.sin(e.orbitRing.rotation.x);
    const z = Math.sin(e.angle) * e.radius * Math.cos(e.orbitRing.rotation.x);
    
    e.electron.position.set(x, y, z);
  });
}