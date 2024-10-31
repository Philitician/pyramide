// Globale variabler
let scene, camera, renderer, pyramid, controls, grid;

// Konfigurasjon for rotasjon
const rotationConfig = {
  xSpeed: 0.01,
  ySpeed: 0.01,
  zSpeed: 0.01,
};

// Initialisering
function init() {
  // Scene oppsett
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  // Kamera oppsett
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);

  // Renderer oppsett
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("scene-container").appendChild(renderer.domElement);

  // Lys oppsett
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // Lag pyramiden
  createPyramid();

  // Sett opp OrbitControls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Sett opp GUI
  setupGUI();

  // Håndter vindu-størrelse endringer
  window.addEventListener("resize", onWindowResize, false);

  // Legg til rutenett
  createGrid();
}

// Opprett pyramide med BufferGeometry
function createPyramid() {
  const geometry = new THREE.BufferGeometry();

  // Definerer vertices for pyramiden
  const vertices = new Float32Array([
    // Base
    -1,
    0,
    1, // 0
    1,
    0,
    1, // 1
    1,
    0,
    -1, // 2
    -1,
    0,
    -1, // 3
    // Topp
    0,
    2,
    0, // 4
  ]);

  // Definerer faces (triangler)
  const indices = new Uint16Array([
    // Base
    0,
    1,
    2,
    0,
    2,
    3,
    // Sider
    0,
    4,
    1, // Front
    1,
    4,
    2, // Høyre
    2,
    4,
    3, // Bak
    3,
    4,
    0, // Venstre
  ]);

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();

  // Material med phong shading
  const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    specular: 0x666666,
    shininess: 30,
    side: THREE.DoubleSide,
  });

  pyramid = new THREE.Mesh(geometry, material);
  scene.add(pyramid);
}

// GUI oppsett
function setupGUI() {
  const gui = new dat.GUI();

  const rotationFolder = gui.addFolder("Rotasjonshastighet");
  rotationFolder.add(rotationConfig, "xSpeed", -0.1, 0.1).name("X-akse");
  rotationFolder.add(rotationConfig, "ySpeed", -0.1, 0.1).name("Y-akse");
  rotationFolder.add(rotationConfig, "zSpeed", -0.1, 0.1).name("Z-akse");
  rotationFolder.open();
}

// Håndter vindu-størrelse endringer
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animasjonsløkke
function animate() {
  requestAnimationFrame(animate);

  // Roter pyramiden
  pyramid.rotation.x += rotationConfig.xSpeed;
  pyramid.rotation.y += rotationConfig.ySpeed;
  pyramid.rotation.z += rotationConfig.zSpeed;

  // Oppdater controls
  controls.update();

  renderer.render(scene, camera);
}

// Ny funksjon for å lage rutenett
function createGrid() {
  // Hovedrutenett
  const size = 20;
  const divisions = 20;
  const gridHelper = new THREE.GridHelper(size, divisions, 0x444444, 0x444444);
  scene.add(gridHelper);

  // X-akse (rød)
  const xAxis = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-size / 2, 0, 0),
      new THREE.Vector3(size / 2, 0, 0),
    ]),
    new THREE.LineBasicMaterial({ color: 0xff0000 })
  );
  scene.add(xAxis);

  // Z-akse (blå)
  const zAxis = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -size / 2),
      new THREE.Vector3(0, 0, size / 2),
    ]),
    new THREE.LineBasicMaterial({ color: 0x0000ff })
  );
  scene.add(zAxis);

  // Y-akse (grønn)
  const yAxis = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -size / 2, 0),
      new THREE.Vector3(0, size / 2, 0),
    ]),
    new THREE.LineBasicMaterial({ color: 0x00ff00 })
  );
  scene.add(yAxis);
}

// Start applikasjonen
init();
animate();
