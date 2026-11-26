import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

const canvas = document.getElementById("plantCanvas");

if (!canvas) {
  console.error("Canvas plantCanvas не найден");
} else {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 3.2, 8);
  camera.lookAt(0, 2, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // LIGHTS
  scene.add(new THREE.AmbientLight(0xffffff, 2));

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(5, 8, 5);
  scene.add(light);

  const greenLight = new THREE.PointLight(0xb9d8a0, 20);
  greenLight.position.set(-3, 3, 3);
  scene.add(greenLight);

  const plant = new THREE.Group();
  scene.add(plant);

  // POT
  const potMaterial = new THREE.MeshStandardMaterial({
    color: 0xe7dfd0,
    roughness: 0.8
  });

  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.65, 0.48, 0.9, 40),
    potMaterial
  );

  pot.position.y = 0.45;
  plant.add(pot);

  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.65, 0.12, 40),
    potMaterial
  );

  rim.position.y = 0.9;
  plant.add(rim);

  const soil = new THREE.Mesh(
    new THREE.CylinderGeometry(0.57, 0.57, 0.08, 40),
    new THREE.MeshStandardMaterial({
      color: 0x3c3024
    })
  );

  soil.position.y = 0.96;
  plant.add(soil);

  // STEM
  const stemMaterial = new THREE.MeshStandardMaterial({
    color: 0x547b42
  });

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.06, 2.5, 16),
    stemMaterial
  );

  stem.position.y = 2.2;
  plant.add(stem);

  // LEAVES
  const leafColors = [
    0x355d39,
    0x547c46,
    0x73995a,
    0x284c32,
    0x8eaa70
  ];

  const leaves = [];

  function makeLeaf(x, y, z, angle, scale, colorIndex) {
    const group = new THREE.Group();

    const material = new THREE.MeshStandardMaterial({
      color: leafColors[colorIndex % leafColors.length],
      roughness: 0.55
    });

    const leaf = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 24),
      material
    );

    leaf.scale.set(0.38 * scale, 0.12 * scale, 0.85 * scale);

    group.add(leaf);

    group.position.set(x, y, z);
    group.rotation.y = angle;
    group.rotation.z = 0.45;

    plant.add(group);
    leaves.push(group);
  }

  makeLeaf(-0.2, 1.3, 0, 0.4, 1.3, 0);
  makeLeaf(0.2, 1.5, 0, 2.5, 1.4, 1);
  makeLeaf(-0.1, 1.8, 0, 4.5, 1.4, 2);
  makeLeaf(0.1, 2.0, 0, 5.7, 1.3, 3);

  makeLeaf(-0.15, 2.3, 0, 1.1, 1.2, 4);
  makeLeaf(0.1, 2.5, 0, 3.4, 1.3, 0);
  makeLeaf(-0.1, 2.7, 0, 5.0, 1.1, 1);
  makeLeaf(0.1, 2.9, 0, 0.2, 1.1, 2);

  makeLeaf(-0.2, 1.7, 0, 0.8, 1.0, 3);
  makeLeaf(0.2, 1.9, 0, 3.0, 1.0, 4);

  // FLOWER
  const flower = new THREE.Group();
  flower.position.y = 3.6;
  plant.add(flower);

  const flowerStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.035, 0.8, 12),
    stemMaterial
  );

  flowerStem.position.y = -0.4;
  flower.add(flowerStem);

  const petalsMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1e9d8,
    roughness: 0.5
  });

  for (let i = 0; i < 6; i++) {
    const petal = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 24, 24),
      petalsMaterial
    );

    petal.scale.set(1, 0.65, 1.4);

    petal.position.set(
      Math.cos(i * Math.PI / 3) * 0.32,
      0.08,
      Math.sin(i * Math.PI / 3) * 0.32
    );

    petal.rotation.y = -i * Math.PI / 3;

    flower.add(petal);
  }

  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0xcda45d
    })
  );

  center.position.y = 0.1;
  flower.add(center);

  // GROUND
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(2.5, 48),
    new THREE.MeshBasicMaterial({
      color: 0xdce6d5,
      transparent: true,
      opacity: 0.35
    })
  );

  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  plant.add(ground);

  // RESIZE
  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (width <= 0 || height <= 0) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
  }

  resize();

  window.addEventListener("resize", resize);

  // ANIMATION
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    plant.rotation.y = time * 0.5;
    plant.position.y = Math.sin(time) * 0.08;

    flower.rotation.z = Math.sin(time * 1.5) * 0.08;

    leaves.forEach((leaf, i) => {
      leaf.rotation.z = 0.45 + Math.sin(time + i) * 0.04;
    });

    renderer.render(scene, camera);
  }

  animate();
}