import * as THREE from "./vendor/three.module.js";

const canvas = document.querySelector("[data-three-hero]");
const hero = canvas ? canvas.closest(".hero") : null;

if (canvas && hero && window.matchMedia("(prefers-reduced-motion: reduce)").matches === false) {
  let renderer = null;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    });
  } catch (error) {
    canvas.hidden = true;
  }

  if (renderer) {
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.25, 9.4);

  const root = new THREE.Group();
  scene.add(root);

  const warm = new THREE.Color(0xf0a14e);
  const ember = new THREE.Color(0xd2762f);
  const steel = new THREE.Color(0x8b95a1);
  const blueSteel = new THREE.Color(0x465464);
  const darkSteel = new THREE.Color(0x222a34);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x3a4654,
    transparent: true,
    opacity: 0.58,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const leakLineMaterial = new THREE.LineBasicMaterial({
    color: 0xd2762f,
    transparent: true,
    opacity: 0.86,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const nodeMaterial = new THREE.MeshBasicMaterial({
    color: 0x8b95a1,
    transparent: true,
    opacity: 0.64,
    depthWrite: false
  });

  const leakNodeMaterial = new THREE.MeshBasicMaterial({
    color: 0xf0a14e,
    transparent: true,
    opacity: 0.94,
    depthWrite: false
  });

  const nodeGeometry = new THREE.SphereGeometry(0.035, 14, 14);
  const leakGeometry = new THREE.SphereGeometry(0.052, 18, 18);

  const sourceNodes = [
    [-4.8, 1.5, -0.8], [-4.45, 0.72, 0.1], [-4.95, -0.08, -0.45],
    [-4.25, -0.88, 0.3], [-4.72, -1.62, -0.2]
  ];
  const causeNodes = [
    [-1.7, 1.08, 0.2], [-1.15, 0.24, -0.25], [-1.55, -0.72, 0.12],
    [-0.72, -1.38, -0.4]
  ];
  const evidenceNodes = [
    [1.25, 1.18, -0.15], [1.75, 0.22, 0.2], [1.15, -0.9, -0.25]
  ];
  const findingNode = [3.45, 0.1, 0.15];

  function makeCurve(a, b, lift) {
    const start = new THREE.Vector3(...a);
    const end = new THREE.Vector3(...b);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += lift;
    mid.z -= 0.35;
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }

  const curves = [];
  sourceNodes.forEach((src, i) => {
    causeNodes.forEach((cause, j) => {
      if ((i + j) % 2 === 0 || j === 1) {
        curves.push({ curve: makeCurve(src, cause, (j - 1.5) * 0.14), leak: i === 2 || j === 1 });
      }
    });
  });
  causeNodes.forEach((cause, i) => {
    evidenceNodes.forEach((ev, j) => {
      if (i === j || j === 1 || i === 0) {
        curves.push({ curve: makeCurve(cause, ev, (i - j) * 0.1), leak: i === 1 || i === 2 });
      }
    });
  });
  evidenceNodes.forEach((ev, i) => {
    curves.push({ curve: makeCurve(ev, findingNode, (i - 1) * 0.16), leak: i !== 2 });
  });

  curves.forEach(({ curve, leak }) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(44));
    const line = new THREE.Line(geometry, leak ? leakLineMaterial : lineMaterial);
    root.add(line);
  });

  [...sourceNodes, ...causeNodes, ...evidenceNodes].forEach((position, i) => {
    const node = new THREE.Mesh(nodeGeometry, i % 4 === 2 ? leakNodeMaterial : nodeMaterial);
    node.position.set(...position);
    root.add(node);
  });

  const finding = new THREE.Mesh(leakGeometry, leakNodeMaterial);
  finding.position.set(...findingNode);
  root.add(finding);

  const particleCount = 90;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);
  const particleData = [];

  for (let i = 0; i < particleCount; i += 1) {
    const item = curves[i % curves.length];
    const color = item.leak ? warm : steel;
    particleColors[i * 3] = color.r;
    particleColors[i * 3 + 1] = color.g;
    particleColors[i * 3 + 2] = color.b;
    particleData.push({
      curve: item.curve,
      leak: item.leak,
      speed: 0.045 + Math.random() * 0.055,
      offset: Math.random()
    });
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  root.add(particles);

  const fieldCount = 360;
  const fieldPositions = new Float32Array(fieldCount * 3);
  const fieldColors = new Float32Array(fieldCount * 3);

  for (let i = 0; i < fieldCount; i += 1) {
    fieldPositions[i * 3] = (Math.random() - 0.5) * 10.5;
    fieldPositions[i * 3 + 1] = (Math.random() - 0.5) * 5.2;
    fieldPositions[i * 3 + 2] = -1.8 - Math.random() * 1.7;
    const color = Math.random() > 0.88 ? ember : (Math.random() > 0.55 ? blueSteel : darkSteel);
    fieldColors[i * 3] = color.r;
    fieldColors[i * 3 + 1] = color.g;
    fieldColors[i * 3 + 2] = color.b;
  }

  const fieldGeometry = new THREE.BufferGeometry();
  fieldGeometry.setAttribute("position", new THREE.BufferAttribute(fieldPositions, 3));
  fieldGeometry.setAttribute("color", new THREE.BufferAttribute(fieldColors, 3));

  const field = new THREE.Points(fieldGeometry, new THREE.PointsMaterial({
    size: 0.026,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
  root.add(field);

  let width = 1;
  let height = 1;
  let frameId = 0;
  let running = true;
  const clock = new THREE.Clock();

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const compact = width < 760;
    root.scale.setScalar(compact ? 0.78 : 1);
    root.position.x = compact ? 0.42 : 0.95;
    root.position.y = compact ? -0.22 : -0.03;
  }

  function updateParticles(elapsed) {
    for (let i = 0; i < particleCount; i += 1) {
      const datum = particleData[i];
      const t = (datum.offset + elapsed * datum.speed) % 1;
      const point = datum.curve.getPointAt(t);
      particlePositions[i * 3] = point.x;
      particlePositions[i * 3 + 1] = point.y;
      particlePositions[i * 3 + 2] = point.z;
    }
    particleGeometry.attributes.position.needsUpdate = true;
  }

  function render() {
    if (!running) return;
    const elapsed = clock.getElapsedTime();
    updateParticles(elapsed);
    root.rotation.y = Math.sin(elapsed * 0.18) * 0.055;
    root.rotation.x = Math.sin(elapsed * 0.13) * 0.025;
    finding.scale.setScalar(1 + Math.sin(elapsed * 2.1) * 0.12);
    field.rotation.z = elapsed * 0.01;
    renderer.render(scene, camera);
    frameId = window.requestAnimationFrame(render);
  }

  const observer = new IntersectionObserver((entries) => {
    running = entries[0] ? entries[0].isIntersecting : true;
    if (running && frameId === 0) {
      clock.start();
      render();
    } else if (!running && frameId) {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    }
  }, { threshold: 0.01 });

  window.addEventListener("resize", resize, { passive: true });
  resize();
  render();
  observer.observe(hero);
  canvas.dataset.rendered = "true";
  } else {
    canvas.dataset.rendered = "false";
  }
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches === false) {
  createHotpathFlow();
  createScrollEvidenceField();
  createSectionEffect("forensics-flow", "rails");
  createSectionEffect("leaks", "radar");
  createSectionEffect("deployment-scope", "rails");
  createSectionEffect("compare-map", "rails");
  createSectionEffect("compare-questions", "radar");
}

function createHotpathFlow() {
  const effectCanvas = document.querySelector("[data-three-hotpath]");
  if (!effectCanvas) return;

  const section = effectCanvas.closest(".diagram-stage") || effectCanvas.closest(".hotpath-stage") || effectCanvas.closest(".live-architecture");
  if (!section) return;

  const renderer = createRenderer(effectCanvas);
  if (!renderer) {
    effectCanvas.dataset.rendered = "false";
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 3, -3, 0.1, 20);
  camera.position.z = 10;

  const root = new THREE.Group();
  scene.add(root);

  const warm = new THREE.Color(0xf0a14e);
  const ember = new THREE.Color(0xd2762f);
  const steel = new THREE.Color(0x8b95a1);
  const slate = new THREE.Color(0x364353);

  function curve(points) {
    return new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  }

  const paths = [
    { curve: curve([[-4.15, 0.92, -1], [-2.2, 1.14, -1], [-0.42, 0.55, -1]]), color: steel, speed: 0.12, size: 0.045 },
    { curve: curve([[-4.2, -0.05, -1], [-2.1, 0.05, -1], [-0.34, -0.04, -1]]), color: steel, speed: 0.13, size: 0.045 },
    { curve: curve([[-4.05, -0.96, -1], [-2.15, -1.08, -1], [-0.42, -0.55, -1]]), color: steel, speed: 0.115, size: 0.045 },
    { curve: curve([[0.42, 0.48, -1], [2.05, 1.04, -1], [4.1, 0.8, -1]]), color: steel, speed: 0.105, size: 0.045 },
    { curve: curve([[0.42, -0.04, -1], [2.1, 0.05, -1], [4.1, 0.02, -1]]), color: steel, speed: 0.12, size: 0.045 },
    { curve: curve([[4.15, -0.58, -1], [2.24, -1.56, -1], [0.42, -0.72, -1], [2.05, -0.32, -1], [4.12, -0.2, -1]]), color: warm, speed: 0.155, size: 0.058, hot: true },
    { curve: curve([[0.05, -0.85, -1], [0.24, -1.85, -1], [1.08, -2.32, -1], [2.8, -2.12, -1]]), color: warm, speed: 0.09, size: 0.05, evidence: true }
  ];

  function makeLine(path, opacity) {
    const material = new THREE.LineBasicMaterial({
      color: path.color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(path.curve.getPoints(96)), material);
    root.add(line);
    return line;
  }

  paths.forEach((path) => makeLine(path, path.hot ? 0.34 : (path.evidence ? 0.26 : 0.18)));

  const particleCount = 112;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);
  const particleData = [];

  for (let i = 0; i < particleCount; i += 1) {
    const path = paths[i % paths.length];
    const color = path.color;
    particleColors[i * 3] = color.r;
    particleColors[i * 3 + 1] = color.g;
    particleColors[i * 3 + 2] = color.b;
    particleSizes[i] = path.size;
    particleData.push({
      path,
      offset: (i * 0.61803398875) % 1,
      speed: path.speed * (0.72 + ((i % 9) / 14))
    });
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

  const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({
    size: 0.062,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
  root.add(particles);

  const ringGroup = new THREE.Group();
  root.add(ringGroup);
  const ringGeometry = new THREE.RingGeometry(0.5, 0.515, 96);
  const rings = [
    { x: 0, y: 0, scale: 1, color: warm, opacity: 0.22 },
    { x: 4.1, y: -0.18, scale: 0.85, color: ember, opacity: 0.28 },
    { x: 2.55, y: -2.16, scale: 0.72, color: warm, opacity: 0.2 }
  ].map((item) => {
    const mesh = new THREE.Mesh(ringGeometry, new THREE.MeshBasicMaterial({
      color: item.color,
      transparent: true,
      opacity: item.opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    }));
    mesh.position.set(item.x, item.y, -1);
    mesh.scale.setScalar(item.scale);
    ringGroup.add(mesh);
    return { mesh, ...item };
  });

  const nodeGeometry = new THREE.CircleGeometry(0.07, 32);
  [
    [-4.12, 0.92, steel], [-4.2, -0.05, steel], [-4.05, -0.96, steel],
    [0, 0, warm], [4.1, 0.8, steel], [4.1, 0.02, steel], [4.12, -0.2, ember],
    [2.8, -2.12, warm]
  ].forEach(([x, y, color]) => {
    const node = new THREE.Mesh(nodeGeometry, new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: color === ember ? 0.9 : 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));
    node.position.set(x, y, -1);
    root.add(node);
  });

  const gridMaterial = new THREE.LineBasicMaterial({
    color: slate,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  for (let y = -2.55; y <= 2.55; y += 0.85) {
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-5.4, y, -1.4),
      new THREE.Vector3(5.4, y, -1.4)
    ]), gridMaterial));
  }

  let frameId = 0;
  let running = true;
  let width = 1;
  let height = 1;
  const clock = new THREE.Clock();

  function resize() {
    const rect = section.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.left = -5.2 * aspect;
    camera.right = 5.2 * aspect;
    camera.top = 3;
    camera.bottom = -3;
    camera.updateProjectionMatrix();
    root.scale.setScalar(width < 720 ? 0.78 : 1);
    root.position.y = width < 720 ? -0.08 : 0.2;
  }

  function render() {
    if (!running) return;
    const elapsed = clock.getElapsedTime();

    for (let i = 0; i < particleCount; i += 1) {
      const datum = particleData[i];
      const t = (datum.offset + elapsed * datum.speed) % 1;
      const point = datum.path.curve.getPointAt(t);
      const jitter = datum.path.hot ? Math.sin(elapsed * 8 + i) * 0.018 : 0;
      particlePositions[i * 3] = point.x;
      particlePositions[i * 3 + 1] = point.y + jitter;
      particlePositions[i * 3 + 2] = point.z;
    }
    particleGeometry.attributes.position.needsUpdate = true;

    rings.forEach((item, index) => {
      const pulse = 1 + ((elapsed * (0.42 + index * 0.08) + index * 0.31) % 1);
      item.mesh.scale.setScalar(item.scale * pulse);
      item.mesh.material.opacity = item.opacity * (2 - pulse);
      item.mesh.rotation.z = elapsed * (index % 2 ? -0.16 : 0.12);
    });

    root.rotation.z = Math.sin(elapsed * 0.12) * 0.006;
    renderer.render(scene, camera);
    frameId = window.requestAnimationFrame(render);
  }

  const observer = new IntersectionObserver((entries) => {
    running = entries[0] ? entries[0].isIntersecting : true;
    if (running && frameId === 0) {
      clock.start();
      render();
    } else if (!running && frameId) {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    }
  }, { threshold: 0.01 });

  window.addEventListener("resize", resize, { passive: true });
  resize();
  render();
  observer.observe(section);
  effectCanvas.dataset.rendered = "true";
}

function createScrollEvidenceField() {
  if (!document.querySelector("[data-three-hero]") || document.querySelector("[data-scroll-three]")) return;

  const effectCanvas = document.createElement("canvas");
  effectCanvas.className = "scroll-three";
  effectCanvas.setAttribute("aria-hidden", "true");
  effectCanvas.dataset.scrollThree = "evidence-graph";
  document.body.prepend(effectCanvas);

  const renderer = createRenderer(effectCanvas);
  if (!renderer) {
    effectCanvas.dataset.rendered = "false";
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 3, -3, 0.1, 20);
  camera.position.z = 10;

  const root = new THREE.Group();
  scene.add(root);

  const warm = new THREE.Color(0xf0a14e);
  const ember = new THREE.Color(0xd2762f);
  const steel = new THREE.Color(0x8b95a1);
  const muted = new THREE.Color(0x364353);

  const count = 138;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const state = [];
  const targets = [];

  function seeded(index, salt) {
    const n = Math.sin(index * 91.73 + salt * 37.19) * 10000;
    return n - Math.floor(n);
  }

  function targetFor(index, mode) {
    const r1 = seeded(index, 1);
    const r2 = seeded(index, 2);
    const r3 = seeded(index, 3);
    if (mode === 0) {
      return [(r1 - 0.5) * 12.2, (r2 - 0.5) * 5.6, -1];
    }
    if (mode === 1) {
      const lane = (index % 5) - 2;
      const x = -5.8 + ((index % 28) / 27) * 11.6;
      return [x, lane * 0.52 + Math.sin(x * 0.9 + index) * 0.08, -1];
    }
    if (mode === 2) {
      const row = Math.floor(index / 18) % 7;
      const col = index % 18;
      return [-5.4 + col * 0.63, 1.9 - row * 0.55 + (r2 - 0.5) * 0.05, -1];
    }
    if (mode === 3) {
      const angle = r1 * Math.PI * 2;
      const radius = 0.55 + r2 * 2.9;
      return [Math.cos(angle) * radius, Math.sin(angle) * radius, -1];
    }
    const lane = (index % 3) - 1;
    return [-5.5 + r1 * 11, lane * 0.72 + (r3 - 0.5) * 0.09, -1];
  }

  for (let i = 0; i < count; i += 1) {
    const start = targetFor(i, 0);
    positions[i * 3] = start[0];
    positions[i * 3 + 1] = start[1];
    positions[i * 3 + 2] = start[2];
    state.push(new THREE.Vector3(...start));
    targets.push([0, 1, 2, 3, 4].map((mode) => new THREE.Vector3(...targetFor(i, mode))));
    const color = i % 9 === 0 || i % 17 === 0 ? warm : (i % 5 === 0 ? muted : steel);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.74,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
  root.add(particles);

  function makeLine(points, color, opacity) {
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);
    root.add(line);
    return line;
  }

  const pathLines = [];
  for (let lane = -2; lane <= 2; lane += 1) {
    const points = [];
    for (let i = 0; i <= 72; i += 1) {
      const x = -5.8 + (i / 72) * 11.6;
      points.push(new THREE.Vector3(x, lane * 0.52 + Math.sin(x * 0.9 + lane) * 0.09, -1));
    }
    pathLines.push(makeLine(points, lane === 0 ? ember : muted, lane === 0 ? 0.28 : 0.16));
  }

  const ledgerLines = [];
  for (let row = 0; row < 7; row += 1) {
    const y = 1.9 - row * 0.55;
    ledgerLines.push(makeLine([
      new THREE.Vector3(-5.6, y, -1),
      new THREE.Vector3(5.6, y, -1)
    ], row === 2 ? ember : muted, row === 2 ? 0.2 : 0.11));
  }

  const radarGroup = new THREE.Group();
  root.add(radarGroup);
  [0.85, 1.55, 2.25, 2.95].forEach((radius) => {
    const points = [];
    for (let i = 0; i <= 96; i += 1) {
      const angle = (Math.PI * 2 * i) / 96;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, -1));
    }
    radarGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({
      color: muted,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })));
  });
  const radarSweep = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -1), new THREE.Vector3(3.35, 0, -1)]),
    new THREE.LineBasicMaterial({
      color: ember,
      transparent: true,
      opacity: 0.26,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  radarGroup.add(radarSweep);

  const sections = [
    { id: "top", mode: 0 },
    { id: "forensics-flow", mode: 1 },
    { id: "product-evidence", mode: 2 },
    { id: "leaks", mode: 3 },
    { id: "deployment-scope", mode: 4 },
    { id: "proof-substitute", mode: 2 }
  ];

  let width = 1;
  let height = 1;
  let mode = 0;
  let frameId = 0;
  const clock = new THREE.Clock();

  function resize() {
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.left = -5 * aspect;
    camera.right = 5 * aspect;
    camera.top = 3;
    camera.bottom = -3;
    camera.updateProjectionMatrix();
    root.scale.setScalar(width < 720 ? 0.9 : 1);
  }

  function nearestMode() {
    const viewportCenter = window.scrollY + window.innerHeight * 0.5;
    let best = { distance: Infinity, mode: 0 };
    sections.forEach((item) => {
      const el = item.id === "top" ? document.querySelector(".hero") : document.getElementById(item.id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const center = window.scrollY + rect.top + rect.height * 0.5;
      const distance = Math.abs(center - viewportCenter);
      if (distance < best.distance) best = { distance, mode: item.mode };
    });
    return best.mode;
  }

  function setGroupOpacity(group, opacity) {
    group.traverse((child) => {
      if (child.material) child.material.opacity = opacity;
    });
  }

  function render() {
    const elapsed = clock.getElapsedTime();
    const targetMode = nearestMode();
    mode += (targetMode - mode) * 0.045;
    const lowerMode = Math.floor(mode);
    const upperMode = Math.min(4, lowerMode + 1);
    const mix = mode - lowerMode;

    for (let i = 0; i < count; i += 1) {
      const target = targets[i][lowerMode].clone().lerp(targets[i][upperMode], mix);
      target.y += Math.sin(elapsed * 0.55 + i * 0.37) * 0.018;
      state[i].lerp(target, 0.075);
      positions[i * 3] = state[i].x;
      positions[i * 3 + 1] = state[i].y;
      positions[i * 3 + 2] = state[i].z;
    }
    particleGeometry.attributes.position.needsUpdate = true;

    const pathOpacity = Math.max(0.08, 0.3 - Math.abs(mode - 1) * 0.16);
    pathLines.forEach((line, index) => {
      line.material.opacity = pathOpacity * (index === 2 ? 1.2 : 0.62);
    });
    const ledgerOpacity = Math.max(0, 0.22 - Math.abs(mode - 2) * 0.16);
    ledgerLines.forEach((line, index) => {
      line.material.opacity = ledgerOpacity * (index === 2 ? 1.2 : 0.72);
    });
    setGroupOpacity(radarGroup, Math.max(0, 0.28 - Math.abs(mode - 3) * 0.19));
    radarSweep.rotation.z = elapsed * 0.18;
    root.rotation.z = Math.sin(elapsed * 0.08) * 0.01;
    root.position.x = width < 720 ? 0 : 0.55;

    renderer.render(scene, camera);
    frameId = window.requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();
  render();
  effectCanvas.dataset.rendered = "true";

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frameId) {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    } else if (!document.hidden && frameId === 0) {
      clock.start();
      render();
    }
  });
}

function createRenderer(effectCanvas) {
  try {
    const renderer = new THREE.WebGLRenderer({
      canvas: effectCanvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    return renderer;
  } catch (error) {
    effectCanvas.hidden = true;
    return null;
  }
}

function createSectionEffect(sectionId, mode) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const effectCanvas = document.createElement("canvas");
  effectCanvas.className = "section-three";
  effectCanvas.setAttribute("aria-hidden", "true");
  effectCanvas.dataset.threeSection = mode;
  section.prepend(effectCanvas);

  const renderer = createRenderer(effectCanvas);
  if (!renderer) {
    effectCanvas.dataset.rendered = "false";
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 3, -3, 0.1, 20);
  camera.position.z = 10;

  const root = new THREE.Group();
  scene.add(root);

  const warm = new THREE.Color(0xf0a14e);
  const ember = new THREE.Color(0xd2762f);
  const steel = new THREE.Color(0x8b95a1);
  const muted = new THREE.Color(0x364353);

  const animated = [];

  if (mode === "rails") {
    buildRails(root, animated, warm, ember, steel, muted);
  } else {
    buildRadar(root, animated, warm, ember, steel, muted);
  }

  let frameId = 0;
  let running = true;
  const clock = new THREE.Clock();

  function resize() {
    const rect = section.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.left = -5 * aspect;
    camera.right = 5 * aspect;
    camera.top = 3;
    camera.bottom = -3;
    camera.updateProjectionMatrix();
    root.scale.setScalar(width < 720 ? 0.82 : 1);
  }

  function render() {
    if (!running) return;
    const elapsed = clock.getElapsedTime();
    animated.forEach((item) => item(elapsed));
    renderer.render(scene, camera);
    frameId = window.requestAnimationFrame(render);
  }

  const observer = new IntersectionObserver((entries) => {
    running = entries[0] ? entries[0].isIntersecting : true;
    if (running && frameId === 0) {
      clock.start();
      render();
    } else if (!running && frameId) {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    }
  }, { threshold: 0.01 });

  window.addEventListener("resize", resize, { passive: true });
  resize();
  render();
  observer.observe(section);
  effectCanvas.dataset.rendered = "true";
}

function buildRails(root, animated, warm, ember, steel, muted) {
  const railMaterial = new THREE.LineBasicMaterial({
    color: muted,
    transparent: true,
    opacity: 0.42,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const hotMaterial = new THREE.LineBasicMaterial({
    color: ember,
    transparent: true,
    opacity: 0.56,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const rails = [
    { y: 1.82, lift: 0.14, hot: false },
    { y: 0.72, lift: -0.08, hot: true },
    { y: -0.18, lift: 0.12, hot: false },
    { y: -1.48, lift: -0.16, hot: true },
    { y: -2.12, lift: 0.1, hot: false }
  ];

  const curves = rails.map((rail, index) => {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-6.4, rail.y, -1),
      new THREE.Vector3(-2.2, rail.y + rail.lift, -1),
      new THREE.Vector3(1.6, rail.y - rail.lift, -1),
      new THREE.Vector3(6.4, rail.y + (index % 2 ? 0.18 : -0.12), -1)
    );
    root.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(96)),
      rail.hot ? hotMaterial : railMaterial
    ));
    return { curve, hot: rail.hot };
  });

  const nodeGeometry = new THREE.SphereGeometry(0.04, 14, 14);
  const beaconGeometry = new THREE.SphereGeometry(0.022, 10, 10);
  for (let x = -5.4; x <= 5.4; x += 1.08) {
    const beacon = new THREE.Mesh(beaconGeometry, new THREE.MeshBasicMaterial({
      color: x > 0.4 && x < 2.8 ? warm : steel,
      transparent: true,
      opacity: x > 0.4 && x < 2.8 ? 0.36 : 0.18,
      depthWrite: false
    }));
    beacon.position.set(x, Math.sin(x * 1.4) * 0.16, -1);
    root.add(beacon);
  }

  const particleGeometry = new THREE.BufferGeometry();
  const count = 62;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const particles = [];

  for (let i = 0; i < count; i += 1) {
    const rail = curves[i % curves.length];
    const color = rail.hot ? warm : steel;
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    particles.push({ curve: rail.curve, speed: 0.035 + Math.random() * 0.035, offset: Math.random() });
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const points = new THREE.Points(particleGeometry, new THREE.PointsMaterial({
    size: 0.052,
    vertexColors: true,
    transparent: true,
    opacity: 0.82,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  }));
  root.add(points);

  [-4.2, -1.35, 1.35, 4.2].forEach((x, index) => {
    const node = new THREE.Mesh(nodeGeometry, new THREE.MeshBasicMaterial({
      color: index === 2 ? warm : steel,
      transparent: true,
      opacity: index === 2 ? 0.72 : 0.42,
      depthWrite: false
    }));
    node.position.set(x, index % 2 ? -0.54 : 0.76, -1);
    root.add(node);
  });

  animated.push((elapsed) => {
    particles.forEach((particle, index) => {
      const point = particle.curve.getPointAt((particle.offset + elapsed * particle.speed) % 1);
      positions[index * 3] = point.x;
      positions[index * 3 + 1] = point.y;
      positions[index * 3 + 2] = point.z;
    });
    particleGeometry.attributes.position.needsUpdate = true;
    root.rotation.z = Math.sin(elapsed * 0.08) * 0.015;
  });
}

function buildRadar(root, animated, warm, ember, steel, muted) {
  const ringMaterial = new THREE.LineBasicMaterial({
    color: muted,
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const sweepMaterial = new THREE.LineBasicMaterial({
    color: ember,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  [0.9, 1.65, 2.42, 3.2].forEach((radius) => {
    const points = [];
    for (let i = 0; i <= 96; i += 1) {
      const a = (Math.PI * 2 * i) / 96;
      points.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, -1));
    }
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), ringMaterial));
  });

  const spokes = new THREE.Group();
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI * 2 * i) / 6;
    const points = [
      new THREE.Vector3(Math.cos(angle) * 0.4, Math.sin(angle) * 0.4, -1),
      new THREE.Vector3(Math.cos(angle) * 3.45, Math.sin(angle) * 3.45, -1)
    ];
    spokes.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), ringMaterial));
  }
  root.add(spokes);

  const sweep = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(3.65, 0, -1)
    ]),
    sweepMaterial
  );
  root.add(sweep);

  const dotGeometry = new THREE.BufferGeometry();
  const count = 34;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.65 + Math.random() * 3.1;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius;
    positions[i * 3 + 2] = -1;
    const color = i % 5 === 0 ? warm : steel;
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  dotGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  dotGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  root.add(new THREE.Points(dotGeometry, new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.78,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })));

  root.position.set(0, -0.2, 0);
  animated.push((elapsed) => {
    sweep.rotation.z = elapsed * 0.22;
    spokes.rotation.z = Math.sin(elapsed * 0.1) * 0.08;
    root.rotation.z = Math.sin(elapsed * 0.06) * 0.035;
  });
}
