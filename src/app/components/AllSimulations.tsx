import * as THREE from 'three';

// This file contains all the new simulation init and update functions

export function initPendulum(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 15;
  camera.position.y = 5;

  const pivotPoint = new THREE.Vector3(0, 10, 0);
  const length = 8;
  let angle = Math.PI / 3;
  let angleVelocity = 0;
  const gravity = 0.002;

  // Pivot
  const pivotGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  const pivotMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
  const pivot = new THREE.Mesh(pivotGeometry, pivotMaterial);
  pivot.position.copy(pivotPoint);
  scene.add(pivot);

  // Bob
  const bobGeometry = new THREE.SphereGeometry(0.8, 32, 32);
  const bobMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b, metalness: 0.5 });
  const bob = new THREE.Mesh(bobGeometry, bobMaterial);
  scene.add(bob);

  // Rod
  const rodMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
  const rodGeometry = new THREE.BufferGeometry().setFromPoints([pivotPoint, bob.position]);
  const rod = new THREE.Line(rodGeometry, rodMaterial);
  scene.add(rod);

  return { pivot, bob, rod, pivotPoint, length, angle, angleVelocity, gravity };
}

export function updatePendulum(data: any) {
  const angleAcceleration = (-data.gravity / data.length) * Math.sin(data.angle);
  data.angleVelocity += angleAcceleration;
  data.angle += data.angleVelocity;
  data.angleVelocity *= 0.999; // Damping

  const x = data.pivotPoint.x + data.length * Math.sin(data.angle);
  const y = data.pivotPoint.y - data.length * Math.cos(data.angle);

  data.bob.position.set(x, y, 0);
  
  const positions = data.rod.geometry.attributes.position.array as Float32Array;
  positions[3] = x;
  positions[4] = y;
  positions[5] = 0;
  data.rod.geometry.attributes.position.needsUpdate = true;
}

export function initDoublePendulum(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 20;
  camera.position.y = 5;

  const pivotPoint = new THREE.Vector3(0, 10, 0);
  const length1 = 5;
  const length2 = 5;
  let angle1 = Math.PI / 2;
  let angle2 = Math.PI / 2;
  let angleVel1 = 0;
  let angleVel2 = 0;
  const mass1 = 1;
  const mass2 = 1;
  const gravity = 0.5;

  // Pivot
  const pivotGeometry = new THREE.SphereGeometry(0.2, 16, 16);
  const pivot = new THREE.Mesh(pivotGeometry, new THREE.MeshStandardMaterial({ color: 0x666666 }));
  pivot.position.copy(pivotPoint);
  scene.add(pivot);

  // Bob 1
  const bob1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xff6b6b })
  );
  scene.add(bob1);

  // Bob 2
  const bob2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x4ecdc4 })
  );
  scene.add(bob2);

  // Rods
  const rod1 = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([pivotPoint, bob1.position]),
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  scene.add(rod1);

  const rod2 = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([bob1.position, bob2.position]),
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  scene.add(rod2);

  // Trail
  const trailPoints: THREE.Vector3[] = [];
  const trailGeometry = new THREE.BufferGeometry();
  const trail = new THREE.Line(
    trailGeometry,
    new THREE.LineBasicMaterial({ color: 0x4ecdc4, transparent: true, opacity: 0.5 })
  );
  scene.add(trail);

  return { pivot, bob1, bob2, rod1, rod2, trail, trailPoints, pivotPoint, length1, length2, angle1, angle2, angleVel1, angleVel2, mass1, mass2, gravity };
}

export function updateDoublePendulum(data: any) {
  const { length1, length2, angle1, angle2, angleVel1, angleVel2, mass1, mass2, gravity } = data;

  const num1 = -gravity * (2 * mass1 + mass2) * Math.sin(angle1);
  const num2 = -mass2 * gravity * Math.sin(angle1 - 2 * angle2);
  const num3 = -2 * Math.sin(angle1 - angle2) * mass2;
  const num4 = angleVel2 * angleVel2 * length2 + angleVel1 * angleVel1 * length1 * Math.cos(angle1 - angle2);
  const den = length1 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * angle1 - 2 * angle2));
  const angleAcc1 = (num1 + num2 + num3 * num4) / den;

  const num5 = 2 * Math.sin(angle1 - angle2);
  const num6 = angleVel1 * angleVel1 * length1 * (mass1 + mass2);
  const num7 = gravity * (mass1 + mass2) * Math.cos(angle1);
  const num8 = angleVel2 * angleVel2 * length2 * mass2 * Math.cos(angle1 - angle2);
  const den2 = length2 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * angle1 - 2 * angle2));
  const angleAcc2 = (num5 * (num6 + num7 + num8)) / den2;

  data.angleVel1 += angleAcc1 * 0.01;
  data.angleVel2 += angleAcc2 * 0.01;
  data.angle1 += data.angleVel1 * 0.01;
  data.angle2 += data.angleVel2 * 0.01;

  const x1 = data.pivotPoint.x + length1 * Math.sin(data.angle1);
  const y1 = data.pivotPoint.y - length1 * Math.cos(data.angle1);
  const x2 = x1 + length2 * Math.sin(data.angle2);
  const y2 = y1 - length2 * Math.cos(data.angle2);

  data.bob1.position.set(x1, y1, 0);
  data.bob2.position.set(x2, y2, 0);

  // Update rods
  let positions = data.rod1.geometry.attributes.position.array as Float32Array;
  positions[3] = x1;
  positions[4] = y1;
  data.rod1.geometry.attributes.position.needsUpdate = true;

  positions = data.rod2.geometry.attributes.position.array as Float32Array;
  positions[0] = x1;
  positions[1] = y1;
  positions[3] = x2;
  positions[4] = y2;
  data.rod2.geometry.attributes.position.needsUpdate = true;

  // Trail
  data.trailPoints.push(new THREE.Vector3(x2, y2, 0));
  if (data.trailPoints.length > 500) data.trailPoints.shift();
  data.trail.geometry.setFromPoints(data.trailPoints);
}

export function initGalaxy(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 50;
  camera.position.y = 30;
  camera.lookAt(0, 0, 0);

  const stars: any[] = [];
  const starCount = 5000;

  for (let i = 0; i < starCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 30 + 2;
    const height = (Math.random() - 0.5) * (40 - radius) * 0.1;
    
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const color = i % 3 === 0 ? 0xffffff : i % 3 === 1 ? 0x4ecdc4 : 0xffe66d;
    const material = new THREE.MeshBasicMaterial({ color });
    const star = new THREE.Mesh(geometry, material);
    
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    star.position.set(x, height, z);
    
    scene.add(star);
    stars.push({ mesh: star, angle, radius, angularSpeed: 0.001 / radius });
  }

  // Central bulge
  const bulgeGeometry = new THREE.SphereGeometry(2, 32, 32);
  const bulgeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffd700,
    emissive: 0xffd700,
    emissiveIntensity: 0.8
  });
  const bulge = new THREE.Mesh(bulgeGeometry, bulgeMaterial);
  scene.add(bulge);

  return { stars, bulge };
}

export function updateGalaxy(data: any) {
  data.stars.forEach((star: any) => {
    star.angle += star.angularSpeed;
    const x = Math.cos(star.angle) * star.radius;
    const z = Math.sin(star.angle) * star.radius;
    star.mesh.position.x = x;
    star.mesh.position.z = z;
  });
  data.bulge.rotation.y += 0.005;
}

export function initBlackHole(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 30;
  camera.position.y = 15;

  // Black hole
  const bhGeometry = new THREE.SphereGeometry(2, 32, 32);
  const bhMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x000000,
    emissive: 0x000000,
    metalness: 1
  });
  const blackHole = new THREE.Mesh(bhGeometry, bhMaterial);
  scene.add(blackHole);

  // Accretion disk
  const diskGeometry = new THREE.RingGeometry(3, 8, 64);
  const diskMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff6600,
    emissive: 0xff6600,
    emissiveIntensity: 0.5,
    side: THREE.DoubleSide
  });
  const disk = new THREE.Mesh(diskGeometry, diskMaterial);
  disk.rotation.x = Math.PI / 2;
  scene.add(disk);

  // Particles being sucked in
  const particles: any[] = [];
  for (let i = 0; i < 500; i++) {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xffa500 });
    const particle = new THREE.Mesh(geometry, material);
    
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 15 + 8;
    particle.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 2,
      Math.sin(angle) * radius
    );
    
    scene.add(particle);
    particles.push({ mesh: particle, angle, radius, speed: 0.02 / radius });
  }

  return { blackHole, disk, particles };
}

export function updateBlackHole(data: any) {
  data.disk.rotation.z += 0.01;
  data.blackHole.rotation.y += 0.02;

  data.particles.forEach((p: any) => {
    p.angle += p.speed;
    p.radius -= p.speed * 2;
    
    if (p.radius < 2) {
      p.radius = Math.random() * 15 + 8;
      p.angle = Math.random() * Math.PI * 2;
    }
    
    p.mesh.position.x = Math.cos(p.angle) * p.radius;
    p.mesh.position.z = Math.sin(p.angle) * p.radius;
    p.speed = 0.02 / p.radius;
  });
}

export function initTornado(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 25;
  camera.position.y = 15;

  const particles: any[] = [];
  const particleCount = 1000;

  for (let i = 0; i < particleCount; i++) {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x888888 });
    const particle = new THREE.Mesh(geometry, material);
    
    scene.add(particle);
    
    const height = Math.random() * 30 - 5;
    const angle = Math.random() * Math.PI * 2;
    const radius = (1 - height / 30) * 5 + 1;
    
    particles.push({
      mesh: particle,
      angle,
      height,
      radius,
      angularSpeed: 0.05 + Math.random() * 0.05,
      verticalSpeed: 0.1 + Math.random() * 0.1
    });
  }

  return { particles };
}

export function updateTornado(data: any) {
  data.particles.forEach((p: any) => {
    p.angle += p.angularSpeed;
    p.height += p.verticalSpeed;
    
    if (p.height > 25) {
      p.height = -5;
      p.angle = Math.random() * Math.PI * 2;
    }
    
    p.radius = (1 - p.height / 30) * 5 + 1;
    p.mesh.position.x = Math.cos(p.angle) * p.radius;
    p.mesh.position.y = p.height;
    p.mesh.position.z = Math.sin(p.angle) * p.radius;
  });
}

export function initFire(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 15;
  camera.position.y = 5;

  const particles: any[] = [];
  const colors = [0xff0000, 0xff4500, 0xff6600, 0xffaa00, 0xffdd00];

  for (let i = 0; i < 500; i++) {
    const geometry = new THREE.SphereGeometry(0.2, 8, 8);
    const material = new THREE.MeshBasicMaterial({ 
      color: colors[Math.floor(Math.random() * colors.length)],
      transparent: true
    });
    const particle = new THREE.Mesh(geometry, material);
    
    scene.add(particle);
    
    particles.push({
      mesh: particle,
      velocity: {
        x: (Math.random() - 0.5) * 0.1,
        y: Math.random() * 0.2 + 0.1,
        z: (Math.random() - 0.5) * 0.1
      },
      life: 1,
      resetPosition: () => {
        particle.position.set(
          (Math.random() - 0.5) * 2,
          -2,
          (Math.random() - 0.5) * 2
        );
      }
    });
    
    particles[i].resetPosition();
  }

  return { particles };
}

export function updateFire(data: any) {
  data.particles.forEach((p: any) => {
    p.mesh.position.x += p.velocity.x;
    p.mesh.position.y += p.velocity.y;
    p.mesh.position.z += p.velocity.z;
    
    p.velocity.y += 0.002;
    p.life -= 0.01;
    
    if (p.life <= 0 || p.mesh.position.y > 10) {
      p.resetPosition();
      p.life = 1;
      p.velocity = {
        x: (Math.random() - 0.5) * 0.1,
        y: Math.random() * 0.2 + 0.1,
        z: (Math.random() - 0.5) * 0.1
      };
    }
    
    (p.mesh.material as THREE.MeshBasicMaterial).opacity = p.life;
    p.mesh.scale.setScalar(p.life);
  });
}

export function initRain(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 20;
  camera.position.y = 10;

  const drops: any[] = [];
  
  for (let i = 0; i < 1000; i++) {
    const geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x4ecdc4, transparent: true, opacity: 0.6 });
    const drop = new THREE.Mesh(geometry, material);
    
    drop.position.set(
      (Math.random() - 0.5) * 40,
      Math.random() * 30 + 10,
      (Math.random() - 0.5) * 40
    );
    
    scene.add(drop);
    drops.push({ mesh: drop, speed: Math.random() * 0.3 + 0.3 });
  }

  // Ground
  const groundGeometry = new THREE.PlaneGeometry(50, 50);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -5;
  scene.add(ground);

  return { drops, ground };
}

export function updateRain(data: any) {
  data.drops.forEach((drop: any) => {
    drop.mesh.position.y -= drop.speed;
    
    if (drop.mesh.position.y < -5) {
      drop.mesh.position.y = Math.random() * 30 + 10;
      drop.mesh.position.x = (Math.random() - 0.5) * 40;
      drop.mesh.position.z = (Math.random() - 0.5) * 40;
    }
  });
}

export function initSnow(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 20;
  camera.position.y = 10;

  const flakes: any[] = [];
  
  for (let i = 0; i < 500; i++) {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const flake = new THREE.Mesh(geometry, material);
    
    flake.position.set(
      (Math.random() - 0.5) * 40,
      Math.random() * 30 + 10,
      (Math.random() - 0.5) * 40
    );
    
    scene.add(flake);
    flakes.push({ 
      mesh: flake, 
      speed: Math.random() * 0.05 + 0.02,
      drift: (Math.random() - 0.5) * 0.02
    });
  }

  // Ground
  const groundGeometry = new THREE.PlaneGeometry(50, 50);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -5;
  scene.add(ground);

  return { flakes, ground };
}

export function updateSnow(data: any) {
  data.flakes.forEach((flake: any, i: number) => {
    flake.mesh.position.y -= flake.speed;
    flake.mesh.position.x += Math.sin(Date.now() * 0.001 + i) * 0.02;
    flake.mesh.position.z += flake.drift;
    
    if (flake.mesh.position.y < -5) {
      flake.mesh.position.y = Math.random() * 30 + 10;
      flake.mesh.position.x = (Math.random() - 0.5) * 40;
      flake.mesh.position.z = (Math.random() - 0.5) * 40;
    }
  });
}

export function initFireworks(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 30;
  camera.position.y = 10;

  const fireworks: any[] = [];
  
  return { fireworks, time: 0 };
}

export function updateFireworks(data: any) {
  data.time++;

  // Spawn new firework
  if (data.time % 30 === 0) {
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const startPos = new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      -10,
      (Math.random() - 0.5) * 20
    );
    
    const explodePos = new THREE.Vector3(
      startPos.x + (Math.random() - 0.5) * 5,
      Math.random() * 10 + 10,
      startPos.z + (Math.random() - 0.5) * 5
    );
    
    data.fireworks.push({
      particles: [],
      exploded: false,
      startPos,
      explodePos,
      color,
      phase: 'launch'
    });
  }

  // Update fireworks
  data.fireworks.forEach((firework: any, index: number) => {
    if (firework.phase === 'launch') {
      if (!firework.launcher) {
        const geometry = new THREE.SphereGeometry(0.2, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: firework.color });
        firework.launcher = new THREE.Mesh(geometry, material);
        firework.launcher.position.copy(firework.startPos);
        firework.scene = data.fireworks[0]?.scene || null;
        if (data.scene) {
          data.scene.add(firework.launcher);
        }
      }
      
      firework.launcher.position.lerp(firework.explodePos, 0.05);
      
      if (firework.launcher.position.distanceTo(firework.explodePos) < 0.5) {
        firework.phase = 'explode';
        if (data.scene && firework.launcher) {
          data.scene.remove(firework.launcher);
        }
        
        // Create explosion particles
        for (let i = 0; i < 100; i++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const speed = Math.random() * 0.3 + 0.1;
          
          firework.particles.push({
            position: firework.explodePos.clone(),
            velocity: new THREE.Vector3(
              Math.sin(phi) * Math.cos(theta) * speed,
              Math.sin(phi) * Math.sin(theta) * speed,
              Math.cos(phi) * speed
            ),
            life: 1
          });
        }
      }
    } else if (firework.phase === 'explode') {
      firework.particles.forEach((p: any) => {
        p.position.add(p.velocity);
        p.velocity.y -= 0.005; // Gravity
        p.life -= 0.01;
      });
      
      firework.particles = firework.particles.filter((p: any) => p.life > 0);
      
      if (firework.particles.length === 0) {
        data.fireworks.splice(index, 1);
      }
    }
  });

  // Store scene reference
  if (!data.scene && typeof scene !== 'undefined') {
    data.scene = scene;
  }
}

// Continue with remaining simulations...
export function initLightning(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 25;
  camera.position.y = 5;

  const bolts: any[] = [];
  
  return { bolts, time: 0 };
}

export function updateLightning(data: any) {
  data.time++;

  // Clear old bolts
  data.bolts.forEach((bolt: any) => {
    bolt.life--;
    if (bolt.mesh && bolt.life <= 0) {
      if (data.scene) {
        data.scene.remove(bolt.mesh);
      }
    }
  });
  data.bolts = data.bolts.filter((b: any) => b.life > 0);

  // Create new bolt occasionally
  if (data.time % 60 === 0 && Math.random() > 0.5) {
    const points: THREE.Vector3[] = [];
    let currentPos = new THREE.Vector3((Math.random() - 0.5) * 20, 15, (Math.random() - 0.5) * 20);
    points.push(currentPos.clone());
    
    for (let i = 0; i < 20; i++) {
      currentPos = currentPos.clone().add(new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        -1.5,
        (Math.random() - 0.5) * 2
      ));
      points.push(currentPos);
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 3 });
    const mesh = new THREE.Line(geometry, material);
    
    if (data.scene) {
      data.scene.add(mesh);
    }
    
    data.bolts.push({ mesh, life: 10 });
  }

  if (!data.scene && typeof scene !== 'undefined') {
    data.scene = scene;
  }
}

export function initAurora(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 30;
  camera.position.y = 10;

  const waves: any[] = [];
  
  for (let i = 0; i < 3; i++) {
    const geometry = new THREE.PlaneGeometry(50, 20, 50, 20);
    const material = new THREE.MeshBasicMaterial({
      color: [0x00ff88, 0x0088ff, 0xff0088][i],
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const wave = new THREE.Mesh(geometry, material);
    wave.position.y = 10;
    wave.position.z = -10 - i * 3;
    scene.add(wave);
    
    waves.push({ mesh: wave, offset: i * 100 });
  }

  return { waves, time: 0 };
}

export function updateAurora(data: any) {
  data.time += 0.03;

  data.waves.forEach((wave: any) => {
    const positions = wave.mesh.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const originalY = positions[i + 1];
      positions[i + 1] = originalY + Math.sin(x * 0.2 + data.time + wave.offset) * 2;
    }
    
    wave.mesh.geometry.attributes.position.needsUpdate = true;
    wave.mesh.geometry.computeVertexNormals();
  });
}

// Additional simulations continue...
// (Keeping the file reasonable in size, continuing with more simulations)

export function initFlockingBirds(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 40;
  camera.position.y = 20;

  const boids: any[] = [];
  const boidCount = 100;

  for (let i = 0; i < boidCount; i++) {
    const geometry = new THREE.ConeGeometry(0.3, 1, 4);
    const material = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 });
    const boid = new THREE.Mesh(geometry, material);
    boid.rotation.x = Math.PI / 2;
    
    boid.position.set(
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 40
    );
    
    scene.add(boid);
    
    boids.push({
      mesh: boid,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2
      )
    });
  }

  return { boids };
}

export function updateFlockingBirds(data: any) {
  const separationDist = 2;
  const alignmentDist = 5;
  const cohesionDist = 5;

  data.boids.forEach((boid: any) => {
    const separation = new THREE.Vector3();
    const alignment = new THREE.Vector3();
    const cohesion = new THREE.Vector3();
    let separationCount = 0;
    let alignmentCount = 0;
    let cohesionCount = 0;

    data.boids.forEach((other: any) => {
      if (boid === other) return;
      
      const dist = boid.mesh.position.distanceTo(other.mesh.position);
      
      if (dist < separationDist) {
        const diff = new THREE.Vector3().subVectors(boid.mesh.position, other.mesh.position);
        diff.divideScalar(dist);
        separation.add(diff);
        separationCount++;
      }
      
      if (dist < alignmentDist) {
        alignment.add(other.velocity);
        alignmentCount++;
      }
      
      if (dist < cohesionDist) {
        cohesion.add(other.mesh.position);
        cohesionCount++;
      }
    });

    if (separationCount > 0) {
      separation.divideScalar(separationCount);
      separation.multiplyScalar(0.1);
    }
    
    if (alignmentCount > 0) {
      alignment.divideScalar(alignmentCount);
      alignment.sub(boid.velocity);
      alignment.multiplyScalar(0.05);
    }
    
    if (cohesionCount > 0) {
      cohesion.divideScalar(cohesionCount);
      cohesion.sub(boid.mesh.position);
      cohesion.multiplyScalar(0.01);
    }

    boid.velocity.add(separation);
    boid.velocity.add(alignment);
    boid.velocity.add(cohesion);
    boid.velocity.clampLength(0, 0.3);

    boid.mesh.position.add(boid.velocity);

    // Wrap around
    if (Math.abs(boid.mesh.position.x) > 30) boid.mesh.position.x *= -1;
    if (Math.abs(boid.mesh.position.y) > 15) boid.mesh.position.y *= -1;
    if (Math.abs(boid.mesh.position.z) > 30) boid.mesh.position.z *= -1;

    // Orient boid
    boid.mesh.lookAt(boid.mesh.position.clone().add(boid.velocity));
  });
}

// We'll add the rest of the simulations in a minimal form to keep file size reasonable
export function initSpringSystem(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 20;
  const nodes: any[] = [];
  const springs: any[] = [];
  
  // Create a grid of nodes
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const geometry = new THREE.SphereGeometry(0.3, 16, 16);
      const material = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 });
      const node = new THREE.Mesh(geometry, material);
      node.position.set(i * 2 - 4, j * 2 - 4, 0);
      scene.add(node);
      
      nodes.push({
        mesh: node,
        velocity: new THREE.Vector3(),
        fixed: j === 4
      });
    }
  }

  return { nodes, springs };
}

export function updateSpringSystem(data: any) {
  const k = 0.01; // Spring constant
  const damping = 0.98;
  const gravity = new THREE.Vector3(0, -0.01, 0);

  data.nodes.forEach((node: any, i: number) => {
    if (node.fixed) return;
    
    node.velocity.add(gravity);
    
    // Connect to neighbors
    const row = Math.floor(i / 5);
    const col = i % 5;
    
    [[0, 1], [1, 0], [0, -1], [-1, 0]].forEach(([dr, dc]) => {
      const nRow = row + dr;
      const nCol = col + dc;
      if (nRow >= 0 && nRow < 5 && nCol >= 0 && nCol < 5) {
        const neighborIndex = nRow * 5 + nCol;
        const neighbor = data.nodes[neighborIndex];
        const diff = new THREE.Vector3().subVectors(neighbor.mesh.position, node.mesh.position);
        const dist = diff.length();
        const force = diff.multiplyScalar((dist - 2) * k);
        node.velocity.add(force);
      }
    });
    
    node.velocity.multiplyScalar(damping);
    node.mesh.position.add(node.velocity);
  });
}

export function initCloth(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 15;
  camera.position.y = 10;

  const geometry = new THREE.PlaneGeometry(10, 10, 20, 20);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0xff6b6b,
    side: THREE.DoubleSide
  });
  const cloth = new THREE.Mesh(geometry, material);
  cloth.position.y = 5;
  scene.add(cloth);

  const velocities = new Float32Array(geometry.attributes.position.count * 3);

  return { cloth, velocities, time: 0 };
}

export function updateCloth(data: any) {
  data.time += 0.05;
  const positions = data.cloth.geometry.attributes.position.array as Float32Array;

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const wave = Math.sin(x * 0.5 + data.time) * 0.5;
    positions[i + 2] = wave;
  }

  data.cloth.geometry.attributes.position.needsUpdate = true;
  data.cloth.geometry.computeVertexNormals();
}

export function initLorenzAttractor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.set(50, 30, 50);
  camera.lookAt(0, 0, 0);

  const points: THREE.Vector3[] = [];
  let x = 0.1;
  let y = 0;
  let z = 0;

  const dt = 0.01;
  const sigma = 10;
  const rho = 28;
  const beta = 8 / 3;

  for (let i = 0; i < 5000; i++) {
    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = x * y - beta * z;

    x += dx * dt;
    y += dy * dt;
    z += dz * dt;

    points.push(new THREE.Vector3(x, y, z));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ 
    color: 0x4ecdc4,
    linewidth: 2
  });
  const line = new THREE.Line(geometry, material);
  scene.add(line);

  return { line, x, y, z, sigma, rho, beta, dt, points };
}

export function updateLorenzAttractor(data: any) {
  const dx = data.sigma * (data.y - data.x);
  const dy = data.x * (data.rho - data.z) - data.y;
  const dz = data.x * data.y - data.beta * data.z;

  data.x += dx * data.dt;
  data.y += dy * data.dt;
  data.z += dz * data.dt;

  data.points.shift();
  data.points.push(new THREE.Vector3(data.x, data.y, data.z));
  data.line.geometry.setFromPoints(data.points);
}

export function initNebula(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 40;

  const particles: any[] = [];
  const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xaa96da];

  for (let i = 0; i < 2000; i++) {
    const geometry = new THREE.SphereGeometry(0.2, 8, 8);
    const material = new THREE.MeshBasicMaterial({ 
      color: colors[Math.floor(Math.random() * colors.length)],
      transparent: true,
      opacity: Math.random() * 0.5 + 0.3
    });
    const particle = new THREE.Mesh(geometry, material);
    
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const radius = Math.random() * 20 + 5;
    
    particle.position.set(
      Math.sin(phi) * Math.cos(theta) * radius,
      Math.sin(phi) * Math.sin(theta) * radius,
      Math.cos(phi) * radius
    );
    
    scene.add(particle);
    particles.push({ mesh: particle });
  }

  const group = new THREE.Group();
  scene.add(group);

  return { particles, group };
}

export function updateNebula(data: any) {
  data.group.rotation.y += 0.002;
  data.group.rotation.x += 0.001;
  
  data.particles.forEach((p: any, i: number) => {
    p.mesh.rotation.y += 0.01;
    p.mesh.scale.setScalar(1 + Math.sin(Date.now() * 0.001 + i) * 0.2);
  });
}

export function initLavaLamp(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 20;

  const blobs: any[] = [];
  const colors = [0xff6b6b, 0xff00ff, 0x00ffff];

  for (let i = 0; i < 8; i++) {
    const geometry = new THREE.SphereGeometry(1 + Math.random(), 32, 32);
    const material = new THREE.MeshStandardMaterial({ 
      color: colors[i % colors.length],
      emissive: colors[i % colors.length],
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.8
    });
    const blob = new THREE.Mesh(geometry, material);
    
    blob.position.set(
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 4
    );
    
    scene.add(blob);
    
    blobs.push({
      mesh: blob,
      velocity: (Math.random() - 0.5) * 0.02,
      phase: Math.random() * Math.PI * 2
    });
  }

  return { blobs };
}

export function updateLavaLamp(data: any) {
  data.blobs.forEach((blob: any) => {
    blob.mesh.position.y += blob.velocity;
    
    if (blob.mesh.position.y > 10 || blob.mesh.position.y < -10) {
      blob.velocity *= -1;
    }
    
    blob.phase += 0.02;
    blob.mesh.scale.setScalar(1 + Math.sin(blob.phase) * 0.2);
  });
}

export function initAsteroidField(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 40;
  camera.position.y = 20;

  const asteroids: any[] = [];

  for (let i = 0; i < 200; i++) {
    const size = Math.random() * 0.5 + 0.2;
    const geometry = new THREE.DodecahedronGeometry(size);
    const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const asteroid = new THREE.Mesh(geometry, material);
    
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 30 + 10;
    const height = (Math.random() - 0.5) * 10;
    
    asteroid.position.set(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    );
    
    scene.add(asteroid);
    
    asteroids.push({
      mesh: asteroid,
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
      },
      orbitSpeed: 0.001 / radius,
      angle
    });
  }

  return { asteroids };
}

export function updateAsteroidField(data: any) {
  data.asteroids.forEach((asteroid: any) => {
    asteroid.mesh.rotation.x += asteroid.rotationSpeed.x;
    asteroid.mesh.rotation.y += asteroid.rotationSpeed.y;
    asteroid.mesh.rotation.z += asteroid.rotationSpeed.z;
    
    asteroid.angle += asteroid.orbitSpeed;
    const radius = Math.sqrt(
      asteroid.mesh.position.x ** 2 + asteroid.mesh.position.z ** 2
    );
    asteroid.mesh.position.x = Math.cos(asteroid.angle) * radius;
    asteroid.mesh.position.z = Math.sin(asteroid.angle) * radius;
  });
}

export function initFountain(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 20;
  camera.position.y = 10;

  const drops: any[] = [];

  for (let i = 0; i < 500; i++) {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x4ecdc4 });
    const drop = new THREE.Mesh(geometry, material);
    
    scene.add(drop);
    
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.3 + 0.2;
    
    drops.push({
      mesh: drop,
      velocity: new THREE.Vector3(
        Math.cos(angle) * speed * 0.5,
        speed,
        Math.sin(angle) * speed * 0.5
      ),
      life: 1
    });
    
    drop.position.set(0, 0, 0);
  }

  return { drops };
}

export function updateFountain(data: any) {
  data.drops.forEach((drop: any) => {
    drop.velocity.y -= 0.01; // Gravity
    drop.mesh.position.add(drop.velocity);
    
    if (drop.mesh.position.y < 0) {
      drop.mesh.position.set(0, 0, 0);
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.3 + 0.2;
      drop.velocity.set(
        Math.cos(angle) * speed * 0.5,
        speed,
        Math.sin(angle) * speed * 0.5
      );
    }
  });
}

export function initSmoke(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 20;
  camera.position.y = 10;

  const particles: any[] = [];

  for (let i = 0; i < 300; i++) {
    const geometry = new THREE.SphereGeometry(0.5, 16, 16);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x888888,
      transparent: true,
      opacity: 0.5
    });
    const particle = new THREE.Mesh(geometry, material);
    
    scene.add(particle);
    
    particles.push({
      mesh: particle,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        Math.random() * 0.1 + 0.05,
        (Math.random() - 0.5) * 0.05
      ),
      life: 1,
      age: 0
    });
    
    particle.position.set(0, 0, 0);
  }

  return { particles };
}

export function updateSmoke(data: any) {
  data.particles.forEach((p: any) => {
    p.mesh.position.add(p.velocity);
    p.velocity.x += (Math.random() - 0.5) * 0.01;
    p.velocity.z += (Math.random() - 0.5) * 0.01;
    p.age += 0.01;
    
    p.mesh.scale.setScalar(1 + p.age);
    (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.5 - p.age * 0.5);
    
    if (p.age > 1 || p.mesh.position.y > 15) {
      p.mesh.position.set(
        (Math.random() - 0.5) * 2,
        0,
        (Math.random() - 0.5) * 2
      );
      p.velocity.set(
        (Math.random() - 0.5) * 0.05,
        Math.random() * 0.1 + 0.05,
        (Math.random() - 0.5) * 0.05
      );
      p.age = 0;
    }
  });
}

export function initMagneticField(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.z = 25;
  camera.position.y = 15;

  // Two magnetic poles
  const pole1 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.5 })
  );
  pole1.position.set(-8, 0, 0);
  scene.add(pole1);

  const pole2 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x0000ff, emissiveIntensity: 0.5 })
  );
  pole2.position.set(8, 0, 0);
  scene.add(pole2);

  // Field lines
  const lines: any[] = [];
  for (let i = 0; i < 20; i++) {
    const points: THREE.Vector3[] = [];
    const startAngle = (i / 20) * Math.PI * 2;
    let pos = new THREE.Vector3(
      -8 + Math.cos(startAngle) * 1.5,
      Math.sin(startAngle) * 1.5,
      0
    );
    
    for (let j = 0; j < 50; j++) {
      points.push(pos.clone());
      
      // Simple field line calculation
      const dir = new THREE.Vector3().subVectors(pole2.position, pos).normalize();
      pos.add(dir.multiplyScalar(0.4));
      
      if (pos.distanceTo(pole2.position) < 1.5) break;
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    lines.push(line);
  }

  return { pole1, pole2, lines };
}

export function updateMagneticField(data: any) {
  data.pole1.rotation.y += 0.02;
  data.pole2.rotation.y -= 0.02;
}

export function initRipples(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.y = 30;
  camera.position.z = 30;
  camera.lookAt(0, 0, 0);

  const size = 50;
  const divisions = 60;
  const geometry = new THREE.PlaneGeometry(size, size, divisions, divisions);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0x4ecdc4,
    wireframe: false,
    side: THREE.DoubleSide
  });
  
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  const ripples: any[] = [];

  return { plane, ripples, time: 0 };
}

export function updateRipples(data: any) {
  data.time += 0.05;

  // Add new ripple occasionally
  if (data.time % 2 < 0.1 && data.ripples.length < 5) {
    data.ripples.push({
      x: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 20,
      time: 0,
      amplitude: 2
    });
  }

  // Update ripples
  data.ripples.forEach((ripple: any) => {
    ripple.time += 0.1;
    ripple.amplitude *= 0.98;
  });
  
  data.ripples = data.ripples.filter((r: any) => r.amplitude > 0.1);

  const positions = data.plane.geometry.attributes.position.array as Float32Array;

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const z = positions[i + 1];
    let y = 0;

    data.ripples.forEach((ripple: any) => {
      const dx = x - ripple.x;
      const dz = z - ripple.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const wave = Math.sin(dist * 0.5 - ripple.time) * ripple.amplitude / (dist * 0.2 + 1);
      y += wave;
    });

    positions[i + 2] = y;
  }

  data.plane.geometry.attributes.position.needsUpdate = true;
  data.plane.geometry.computeVertexNormals();
}

export function initCrystalGrowth(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.set(15, 15, 15);
  camera.lookAt(0, 0, 0);

  const crystals: any[] = [];
  const colors = [0x4ecdc4, 0xff6b6b, 0xffe66d, 0xaa96da];

  // Center crystal
  const centerGeometry = new THREE.OctahedronGeometry(2);
  const centerMaterial = new THREE.MeshStandardMaterial({ 
    color: colors[0],
    emissive: colors[0],
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.8
  });
  const center = new THREE.Mesh(centerGeometry, centerMaterial);
  scene.add(center);

  crystals.push({ mesh: center, generation: 0, size: 2 });

  return { crystals, time: 0, maxGeneration: 0 };
}

export function updateCrystalGrowth(data: any) {
  data.time++;

  // Grow new crystals
  if (data.time % 60 === 0 && data.maxGeneration < 3) {
    data.maxGeneration++;
    
    const parent = data.crystals[Math.floor(Math.random() * data.crystals.length)];
    const colors = [0x4ecdc4, 0xff6b6b, 0xffe66d, 0xaa96da];
    
    for (let i = 0; i < 4; i++) {
      const size = parent.size * 0.6;
      const geometry = new THREE.OctahedronGeometry(size);
      const material = new THREE.MeshStandardMaterial({ 
        color: colors[data.maxGeneration % colors.length],
        emissive: colors[data.maxGeneration % colors.length],
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8
      });
      const crystal = new THREE.Mesh(geometry, material);
      
      const angle = (i / 4) * Math.PI * 2;
      const dist = parent.size + size;
      crystal.position.set(
        parent.mesh.position.x + Math.cos(angle) * dist,
        parent.mesh.position.y + (Math.random() - 0.5) * size,
        parent.mesh.position.z + Math.sin(angle) * dist
      );
      
      crystal.rotation.set(Math.random(), Math.random(), Math.random());
      
      if (data.scene) {
        data.scene.add(crystal);
      }
      
      data.crystals.push({ mesh: crystal, generation: data.maxGeneration, size });
    }
  }

  // Rotate all crystals
  data.crystals.forEach((crystal: any) => {
    crystal.mesh.rotation.y += 0.01;
    crystal.mesh.rotation.x += 0.005;
  });

  if (!data.scene && typeof scene !== 'undefined') {
    data.scene = scene;
  }
}
// ====================== TRAFFIC SIMULATION ======================

// ====================== TRAFFIC SIMULATION ======================

export function initTraffic(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.set(0, 25, 35);
  camera.lookAt(0, 0, 0);

  // Road
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  road.rotation.x = -Math.PI / 2;
  scene.add(road);

  // Lanes
  const lanes = [-10, 0, 10];

  lanes.forEach(x => {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.01, 60),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    line.position.set(x, 0.01, 0);
    scene.add(line);
  });

  // 🚦 SIGNAL
  const signal = new THREE.Group();

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  );
  pole.position.y = 4;

  const redLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.5),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  redLight.position.set(0, 6, 0);

  const greenLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.5),
    new THREE.MeshStandardMaterial({ color: 0x002200 })
  );
  greenLight.position.set(0, 4.5, 0);

  signal.add(pole, redLight, greenLight);
  signal.position.set(15, 0, 0);
  scene.add(signal);

  // Cars
  const cars: any[] = [];

  for (let i = 0; i < 25; i++) {
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    const maxSpeed = 0.15 + Math.random() * 0.1;

    const car = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1, 4),
      new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff })
    );

    car.position.set(lane, 0.5, Math.random() * 60 - 30);
    scene.add(car);

    cars.push({
      mesh: car,
      lane,
      speed: maxSpeed,
      currentSpeed: maxSpeed,
      laneChangeCooldown: 0
    });
  }

  return {
    cars,
    lanes,
    redLight,
    greenLight,
    signalState: "green",
    signalTimer: 0
  };
}

// UPDATE TRAFFIC

export function updateTraffic(data: any, deltaTime: number = 1 / 60) {
  const step = Math.min(deltaTime * 60, 3); // normalize to ~60fps (and cap)

  const safeDistance = 6;
  const stopLineZ = 5;
  const carLengthZ = 4; // BoxGeometry depth (center-to-center bumper approx)
  const carHalfLengthZ = carLengthZ / 2;

  data.signalTimer = (data.signalTimer || 0) + step;

  if (data.signalTimer > 200) {
    data.signalTimer = 0;
    data.signalState = data.signalState === "green" ? "red" : "green";
  }

  const isRed = data.signalState === "red";

  if (data.signalState === "red") {
    data.redLight.material.color.set(0xff0000);
    data.greenLight.material.color.set(0x002200);
  } else {
    data.redLight.material.color.set(0x220000);
    data.greenLight.material.color.set(0x00ff00);
  }

  data.cars.forEach((car: any, i: number) => {
    car.currentSpeed = car.currentSpeed ?? car.speed ?? 0;
    car.laneChangeCooldown = car.laneChangeCooldown ?? 0;
    car.laneChangeCooldown -= step;

    // 🔍 Detect front car in the same lane
    let frontGap = Infinity;
    let frontCarSpeed = car.speed ?? 0;
    for (let j = 0; j < data.cars.length; j++) {
      const other = data.cars[j];
      if (other === car) continue;
      if (car.lane !== other.lane) continue;

      const dz = other.mesh.position.z - car.mesh.position.z;
      if (dz <= 0) continue;

      const gap = dz - carLengthZ;
      if (gap >= 0 && gap < frontGap) {
        frontGap = gap;
        frontCarSpeed = other.currentSpeed ?? other.speed ?? car.speed;
      }
    }

    const shouldSlow = frontGap < safeDistance;

    // 🚗 Lane change (only when not red, and only if safe)
    if (!isRed && shouldSlow && car.laneChangeCooldown <= 0 && Math.random() < 0.02 * step) {
      const laneCandidates = data.lanes.filter((x: number) => x !== car.lane);
      for (const candidateLane of laneCandidates) {
        let candFrontGap = Infinity;
        let candRearGap = Infinity;

        for (let j = 0; j < data.cars.length; j++) {
          const other = data.cars[j];
          if (other === car) continue;
          if (other.lane !== candidateLane) continue;

          const dz = other.mesh.position.z - car.mesh.position.z;
          if (dz > 0) {
            candFrontGap = Math.min(candFrontGap, dz - carLengthZ);
          } else if (dz < 0) {
            candRearGap = Math.min(candRearGap, -dz - carLengthZ);
          }
        }

        const rearSafety = candRearGap >= safeDistance * 0.8;
        const frontSafety = candFrontGap >= safeDistance;

        if (frontSafety && rearSafety) {
          car.lane = candidateLane;
          car.laneChangeCooldown = 60; // ~1 sec at 60fps
          break;
        }
      }
    }

    // 🎯 Smooth lane shift towards target lane
    car.mesh.position.x += (car.lane - car.mesh.position.x) * 0.1 * step;

    // 🚗 Speed control with light + car-following
    let targetSpeed = car.speed ?? 0;

    if (isRed) {
      targetSpeed = 0;
    } else if (shouldSlow) {
      const ratio = frontGap === Infinity ? 1 : Math.max(0, Math.min(1, frontGap / safeDistance));
      targetSpeed = Math.min(targetSpeed, frontCarSpeed * Math.max(0.2, ratio));
    }

    car.currentSpeed += (targetSpeed - car.currentSpeed) * (0.05 * step);

    // Move
    const stopPosZ = stopLineZ - carHalfLengthZ;
    let newZ = car.mesh.position.z + car.currentSpeed * step;

    // 🚦 Stop at stop line (no frame-rate dependence)
    if (isRed && newZ > stopPosZ) {
      newZ = stopPosZ;
      car.currentSpeed = 0;
    }

    car.mesh.position.z = newZ;

    // slight steering tilt (visual)
    car.mesh.rotation.z = (car.lane - car.mesh.position.x) * 0.05;

    // LOOP
    if (car.mesh.position.z > 30) {
      car.mesh.position.z = -30;
      car.currentSpeed = car.speed ?? car.currentSpeed;
    }
  });
}

export function initCity(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  camera.position.set(100, 90, 100);
  camera.lookAt(0, 0, 0);

  scene.background = new THREE.Color(0xbfdfff);

  // LIGHT
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(100, 150, 100);
  scene.add(sun);

  // GROUND
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({ color: 0x2f2f2f })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // ROADS
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });

  const hRoad = new THREE.Mesh(new THREE.PlaneGeometry(200, 12), roadMat);
  hRoad.rotation.x = -Math.PI / 2;
  scene.add(hRoad);

  const vRoad = new THREE.Mesh(new THREE.PlaneGeometry(12, 200), roadMat);
  vRoad.rotation.x = -Math.PI / 2;
  scene.add(vRoad);

  // LANE MARKINGS
  const laneMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  for (let i = -90; i < 90; i += 6) {
    const line1 = new THREE.Mesh(new THREE.BoxGeometry(3, 0.05, 0.2), laneMat);
    line1.position.set(i, 0.05, 0);
    scene.add(line1);

    const line2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 3), laneMat);
    line2.position.set(0, 0.05, i);
    scene.add(line2);
  }

  // ZEBRA CROSSING
  const zebraMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  for (let i = -5; i <= 5; i += 2) {
    const z1 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.05, 0.5), zebraMat);
    z1.position.set(i, 0.05, 6);
    scene.add(z1);

    const z2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 2), zebraMat);
    z2.position.set(6, 0.05, i);
    scene.add(z2);
  }

  // BUILDINGS
  const buildings: any[] = [];
  for (let x = -40; x <= 40; x += 10) {
    for (let z = -40; z <= 40; z += 10) {
      if (Math.abs(x) < 10 || Math.abs(z) < 10) continue;

      const h = Math.random() * 25 + 10;

      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(6, h, 6),
        new THREE.MeshStandardMaterial({ color: 0xb0bec5 })
      );

      mesh.position.set(x, h / 2, z);
      scene.add(mesh);
      buildings.push(mesh);
    }
  }

  // 🚦 TRAFFIC LIGHT SYSTEM (4 SIDES)
  const createLight = (x: number, z: number) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 4, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    );
    mesh.position.set(x, 2, z);
    scene.add(mesh);
    return { mesh };
  };

  const lights = {
    ns: createLight(3, -3), // north-south
    ew: createLight(-3, 3)  // east-west
  };

  // 🚗 CARS
  const cars: any[] = [];
  const dirs = ["right", "left", "up", "down"];

  for (let i = 0; i < 30; i++) {
    const dir = dirs[i % 4];
    const maxSpeed = 0.05;

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 1, 5),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5)
      })
    );

    if (dir === "right") mesh.position.set(-90, 0.5, -3);
    if (dir === "left") mesh.position.set(90, 0.5, 3);
    if (dir === "up") mesh.position.set(3, 0.5, -90);
    if (dir === "down") mesh.position.set(-3, 0.5, 90);

    scene.add(mesh);

    cars.push({
      mesh,
      dir,
      speed: maxSpeed,
      currentSpeed: maxSpeed
    });
  }

  // 🚶 PEOPLE
  const people: any[] = [];

  for (let i = 0; i < 20; i++) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 1.8),
      new THREE.MeshStandardMaterial({ color: 0xffcc80 })
    );

    mesh.position.set(-6, 0.9, Math.random() * 10 - 5);
    scene.add(mesh);

    people.push({
      mesh,
      crossing: true,
      speed: 0.02
    });
  }

  return {
    cars,
    people,
    lights,
    phase: 0,
    timer: 0,
    time: 0
  };
}
export function updateCity(data: any, camera: THREE.PerspectiveCamera, deltaTime: number = 1 / 60) {
  if (!data) return;

  const step = Math.min(deltaTime * 60, 3); // normalize to ~60fps (and cap)

  data.time += 0.02 * step;
  data.timer = (data.timer || 0) + step;

  // 🚦 SWITCH LIGHTS
  if (data.timer > 200) {
    data.phase = 1 - data.phase;
    data.timer = 0;
  }

  const nsGreen = data.phase === 0;

  // UPDATE LIGHT COLORS
  if (data.lights?.ns?.mesh?.material) {
    data.lights.ns.mesh.material.color.set(nsGreen ? 0x00ff00 : 0xff0000);
  }

  if (data.lights?.ew?.mesh?.material) {
    data.lights.ew.mesh.material.color.set(!nsGreen ? 0x00ff00 : 0xff0000);
  }

  // 🚗 CARS
  const intersectionHalf = 6;
  const carHalfWidthX = 2.5 / 2; // BoxGeometry width (x-axis)
  const carHalfDepthZ = 5 / 2; // BoxGeometry depth (z-axis)
  const carLengthX = carHalfWidthX * 2;
  const carLengthZ = carHalfDepthZ * 2;
  const stopLineX = intersectionHalf - carHalfWidthX; // ~4.75
  const stopLineZ = intersectionHalf - carHalfDepthZ; // ~3.5
  const safeDistance = 10;
  const laneMatchEps = 0.6;

  for (let car of data.cars || []) {
    if (!car?.mesh?.position) continue;

    const m = car.mesh;
    car.currentSpeed = car.currentSpeed ?? car.speed ?? 0;

    const eastWest = car.dir === "left" || car.dir === "right";
    const stopForLight = eastWest ? nsGreen : !nsGreen;

    // 🔍 Front car detection (same dir + same lane coordinate)
    let frontGap = Infinity;
    let frontCarSpeed = car.speed ?? 0;
    for (let j = 0; j < data.cars.length; j++) {
      const other = data.cars[j];
      if (other === car) continue;
      if (other.dir !== car.dir) continue;

      if (eastWest) {
        if (Math.abs(other.mesh.position.z - m.position.z) > laneMatchEps) continue;

        if (car.dir === "right" && other.mesh.position.x > m.position.x) {
          const gap = other.mesh.position.x - m.position.x - carLengthX;
          if (gap >= 0 && gap < frontGap) {
            frontGap = gap;
            frontCarSpeed = other.currentSpeed ?? other.speed ?? frontCarSpeed;
          }
        }
        if (car.dir === "left" && other.mesh.position.x < m.position.x) {
          const gap = m.position.x - other.mesh.position.x - carLengthX;
          if (gap >= 0 && gap < frontGap) {
            frontGap = gap;
            frontCarSpeed = other.currentSpeed ?? other.speed ?? frontCarSpeed;
          }
        }
      } else {
        if (Math.abs(other.mesh.position.x - m.position.x) > laneMatchEps) continue;

        if (car.dir === "up" && other.mesh.position.z > m.position.z) {
          const gap = other.mesh.position.z - m.position.z - carLengthZ;
          if (gap >= 0 && gap < frontGap) {
            frontGap = gap;
            frontCarSpeed = other.currentSpeed ?? other.speed ?? frontCarSpeed;
          }
        }
        if (car.dir === "down" && other.mesh.position.z < m.position.z) {
          const gap = m.position.z - other.mesh.position.z - carLengthZ;
          if (gap >= 0 && gap < frontGap) {
            frontGap = gap;
            frontCarSpeed = other.currentSpeed ?? other.speed ?? frontCarSpeed;
          }
        }
      }
    }

    const shouldSlow = frontGap < safeDistance;

    // Desired speed
    let targetSpeed = car.speed ?? 0;
    if (stopForLight) {
      targetSpeed = 0;
    } else if (shouldSlow) {
      const ratio = frontGap === Infinity ? 1 : Math.max(0, Math.min(1, frontGap / safeDistance));
      targetSpeed = Math.min(targetSpeed, frontCarSpeed * Math.max(0.2, ratio));
    }

    // Smooth accel/decel
    car.currentSpeed += (targetSpeed - car.currentSpeed) * (0.2 * step);

    // Move
    if (car.dir === "right") m.position.x += car.currentSpeed * step;
    if (car.dir === "left") m.position.x -= car.currentSpeed * step;
    if (car.dir === "up") m.position.z += car.currentSpeed * step;
    if (car.dir === "down") m.position.z -= car.currentSpeed * step;

    // 🚦 Clamp at stop lines (before intersection)
    if (stopForLight) {
      if (car.dir === "right" && m.position.x > stopLineX) {
        m.position.x = stopLineX;
        car.currentSpeed = 0;
      }
      if (car.dir === "left" && m.position.x < -stopLineX) {
        m.position.x = -stopLineX;
        car.currentSpeed = 0;
      }
      if (car.dir === "up" && m.position.z > stopLineZ) {
        m.position.z = stopLineZ;
        car.currentSpeed = 0;
      }
      if (car.dir === "down" && m.position.z < -stopLineZ) {
        m.position.z = -stopLineZ;
        car.currentSpeed = 0;
      }
    }

    // LOOP
    if (m.position.x > 100) m.position.x = -100;
    if (m.position.x < -100) m.position.x = 100;
    if (m.position.z > 100) m.position.z = -100;
    if (m.position.z < -100) m.position.z = 100;
  }

  // 🚶 PEOPLE CROSS ONLY WHEN SAFE (and only when east-west is red)
  for (let p of data.people || []) {
    if (!p?.mesh?.position) continue;

    const eastWestCarsNearIntersection = (data.cars || []).some((car: any) => {
      if (!car?.mesh?.position) return false;
      if (car.dir !== "left" && car.dir !== "right") return false;
      if (!nsGreen) return false; // only allow pedestrians on east-west red

      const sameLane = Math.abs(car.mesh.position.z - p.mesh.position.z) < 1.6;
      const near = Math.abs(car.mesh.position.x) < 8;
      return sameLane && near;
    });

    const canCross = nsGreen && !eastWestCarsNearIntersection;
    if (canCross) {
      p.mesh.position.x += p.speed * step;

      if (p.mesh.position.x > 6) {
        p.mesh.position.x = -6;
        p.mesh.position.z = Math.random() * 10 - 5;
      }
    }
  }

  // 🎥 CAMERA ROTATION
  camera.position.x = Math.sin(data.time * 0.2) * 120;
  camera.position.z = Math.cos(data.time * 0.2) * 120;
  camera.lookAt(0, 0, 0);
}