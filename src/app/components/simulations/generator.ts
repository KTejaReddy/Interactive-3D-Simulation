import * as THREE from "three";

export function generateFromJSON(scene: THREE.Scene, data: any) {
  const results: any[] = [];

  data.objects.forEach((obj: any, index: number) => {
    const result = createObject(scene, obj);

    // 🔥 Auto positioning (spread objects)
    if (result.group) {
      result.group.position.x = index * 6 - (data.objects.length * 3);
    }

    results.push(result);
  });

  return results;
}

/* ---------- HELPERS ---------- */

function getColor(color: string) {
  switch (color) {
    case "red": return 0xff0000;
    case "green": return 0x00ff00;
    case "blue": return 0x0000ff;
    case "yellow": return 0xffff00;
    default: return 0x00ffff;
  }
}

function getScale(size: string) {
  if (size === "large") return 2;
  if (size === "small") return 0.7;
  return 1;
}

/* ---------- OBJECTS ---------- */
function createObject(scene: THREE.Scene, data: any) {
  switch (data.type) {
    case "car": return createCar(scene, data);
    case "tree": return createTree(scene, data);
    case "house": return createHouse(scene, data);
    case "robot": return createRobot(scene, data);
    default: return createAbstract(scene);
  }
}

function createCar(scene: THREE.Scene, data: any) {
  const group = new THREE.Group();
  const scale = getScale(data.size);
  const color = getColor(data.color);

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(4, 1, 2),
    new THREE.MeshStandardMaterial({ color })
  );

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 2),
    new THREE.MeshStandardMaterial({ color })
  );
  top.position.y = 1;

  group.add(body, top);

  // Wheels (AI controlled 🔥)
  const wheelCount = data.wheels || 4;
  for (let i = 0; i < wheelCount; i++) {
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16),
      new THREE.MeshStandardMaterial({ color: 0x000000 })
    );
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set((i - wheelCount/2), -0.5, i % 2 === 0 ? -1 : 1);
    group.add(wheel);
  }

  group.scale.set(scale, scale, scale);
  scene.add(group);

  return { group };
}

function createTree(scene: THREE.Scene, data: any) {
  const group = new THREE.Group();
  const scale = getScale(data.size);

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 4),
    new THREE.MeshStandardMaterial({ color: 0x8b4513 })
  );

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(2),
    new THREE.MeshStandardMaterial({ color: getColor(data.color) })
  );

  leaves.position.y = 3;

  group.add(trunk, leaves);
  group.scale.set(scale, scale, scale);

  scene.add(group);
  return { group };
}

function createHouse(scene: THREE.Scene, data: any) {
  const group = new THREE.Group();
  const scale = getScale(data.size);

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3, 4),
    new THREE.MeshStandardMaterial({ color: getColor(data.color) })
  );

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3, 2, 4),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );

  roof.position.y = 3;

  group.add(base, roof);
  group.scale.set(scale, scale, scale);

  scene.add(group);
  return { group };
}

function createRobot(scene: THREE.Scene, data: any) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2, 3, 1),
    new THREE.MeshStandardMaterial({ color: getColor(data.color) })
  );

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
  );

  head.position.y = 2.5;

  group.add(body, head);
  scene.add(group);

  return { group };
}

function createAbstract(scene: THREE.Scene) {
  const mesh = new THREE.Mesh(
    new THREE.TorusKnotGeometry(3, 1),
    new THREE.MeshStandardMaterial({ color: 0x00ffff })
  );

  scene.add(mesh);
  return { mesh };
}