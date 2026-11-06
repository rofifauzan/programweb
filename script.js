
/* =====================================
   GALAXY 3D BACKGROUND - THREE.JS
===================================== */

const container = document.getElementById("webgl-container");

if (window.THREE && container) {

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030611, 0.008);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 5, 38);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 1.7)
  );

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x030611, 1);

  container.appendChild(renderer.domElement);

  /* =====================================
     1. PLANET PARTIKEL
  ===================================== */

  const planetCount = 30000;

  const planetGeometry = new THREE.BufferGeometry();

  const planetPositions =
    new Float32Array(planetCount * 3);

  const planetColors =
    new Float32Array(planetCount * 3);

  const blue = new THREE.Color(0x00d2ff);
  const white = new THREE.Color(0xffffff);
  const darkBlue = new THREE.Color(0x244cff);

  for (let i = 0; i < planetCount; i++) {

    const u = Math.random();
    const v = Math.random();

    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);

    const radius = 6.5 + (Math.random() - 0.5) * 0.3;

    const x =
      radius * Math.sin(phi) * Math.cos(theta);

    const y =
      radius * Math.sin(phi) * Math.sin(theta);

    const z =
      radius * Math.cos(phi);

    planetPositions[i * 3] = x;
    planetPositions[i * 3 + 1] = y;
    planetPositions[i * 3 + 2] = z;

    const color = blue.clone().lerp(
      Math.random() > 0.7 ? white : darkBlue,
      Math.random() * 0.6
    );

    planetColors[i * 3] = color.r;
    planetColors[i * 3 + 1] = color.g;
    planetColors[i * 3 + 2] = color.b;
  }

  planetGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(planetPositions, 3)
  );

  planetGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(planetColors, 3)
  );

  const planetMaterial = new THREE.PointsMaterial({
    size: 0.09,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const planet = new THREE.Points(
    planetGeometry,
    planetMaterial
  );

  scene.add(planet);

  /* =====================================
     2. CINCIN PLANET
  ===================================== */

  const ringCount = 35000;

  const ringGeometry = new THREE.BufferGeometry();

  const ringPositions =
    new Float32Array(ringCount * 3);

  const ringColors =
    new Float32Array(ringCount * 3);

  const cyan = new THREE.Color(0x00f0ff);
  const ringBlue = new THREE.Color(0x0044ff);
  const gold = new THREE.Color(0xffaa00);

  for (let i = 0; i < ringCount; i++) {

    const radius =
      THREE.MathUtils.lerp(
        9,
        18,
        Math.pow(Math.random(), 1.5)
      );

    const angle = Math.random() * Math.PI * 2;

    const x = Math.cos(angle) * radius;

    const y =
      (Math.random() - 0.5) *
      (0.8 * radius / 18);

    const z = Math.sin(angle) * radius;

    ringPositions[i * 3] = x;
    ringPositions[i * 3 + 1] = y;
    ringPositions[i * 3 + 2] = z;

    let color;

    if (radius < 12) {
      color = ringBlue.clone().lerp(cyan, Math.random());
    } else if (radius < 16) {
      color = cyan.clone().lerp(white, Math.random() * 0.5);
    } else {
      color = cyan.clone().lerp(gold, Math.random() * 0.5);
    }

    ringColors[i * 3] = color.r;
    ringColors[i * 3 + 1] = color.g;
    ringColors[i * 3 + 2] = color.b;
  }

  ringGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(ringPositions, 3)
  );

  ringGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(ringColors, 3)
  );

  const ringMaterial = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const ring = new THREE.Points(
    ringGeometry,
    ringMaterial
  );

  ring.rotation.x = Math.PI / 7;
  ring.rotation.z = -Math.PI / 10;

  scene.add(ring);

  /* =====================================
     3. BINTANG LATAR BELAKANG
  ===================================== */

  const starCount = 7000;

  const starGeometry = new THREE.BufferGeometry();

  const starPositions =
    new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {

    starPositions[i * 3] =
      (Math.random() - 0.5) * 150;

    starPositions[i * 3 + 1] =
      (Math.random() - 0.5) * 100;

    starPositions[i * 3 + 2] =
      (Math.random() - 0.5) * 120;
  }

  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(starPositions, 3)
  );

  const starMaterial = new THREE.PointsMaterial({
    size: 0.08,
    color: 0xffffff,
    transparent: true,
    opacity: 0.65
  });

  const stars = new THREE.Points(
    starGeometry,
    starMaterial
  );

  scene.add(stars);

  /* =====================================
     4. NEBULA GALAXY
  ===================================== */

  function createNebula(color, x, y, z, size) {

    const canvas = document.createElement("canvas");

    canvas.width = 256;
    canvas.height = 256;

    const ctx = canvas.getContext("2d");

    const gradient = ctx.createRadialGradient(
      128, 128, 5,
      128, 128, 128
    );

    gradient.addColorStop(0, color);
    gradient.addColorStop(0.35, "rgba(40,100,255,0.15)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const sprite = new THREE.Sprite(material);

    sprite.position.set(x, y, z);
    sprite.scale.set(size, size, 1);

    scene.add(sprite);
  }

  createNebula(
    "rgba(30,100,255,0.5)",
    -18, 10, -20, 35
  );

  createNebula(
    "rgba(130,50,255,0.4)",
    20, -10, -25, 38
  );

  createNebula(
    "rgba(0,210,255,0.3)",
    0, 18, -35, 30
  );

  /* =====================================
     5. ANIMASI GALAXY
  ===================================== */

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener("pointermove", (e) => {

    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;

    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

  }, { passive: true });

  function animate() {

    requestAnimationFrame(animate);

    planet.rotation.y += 0.0015;

    ring.rotation.y += 0.002;

    stars.rotation.y -= 0.0002;

    camera.position.x +=
      (mouseX * 1.2 - camera.position.x) * 0.01;

    camera.position.y +=
      (5 - mouseY * 0.6 - camera.position.y) * 0.01;

    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  /* RESPONSIVE */

  window.addEventListener("resize", () => {

    camera.aspect =
      window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  });
}


/* =====================================
   6. NAVIGASI SLIDE PRESENTASI
===================================== */

const slides = document.querySelectorAll(".slide");

const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

const number = document.getElementById("number");
const bar = document.getElementById("bar");

const fullscreen = document.getElementById("fullscreen");

let currentSlide = 0;

function showSlide(index) {

  if (index < 0 || index >= slides.length) {
    return;
  }

  slides.forEach((slide, i) => {

    slide.classList.toggle(
      "active",
      i === index
    );

  });

  currentSlide = index;

  number.textContent =
    String(index + 1).padStart(2, "0");

  bar.style.width =
    ((index + 1) / slides.length * 100) + "%";

  prevButton.disabled = index === 0;

  nextButton.disabled =
    index === slides.length - 1;
}

prevButton.addEventListener("click", () => {
  showSlide(currentSlide - 1);
});

nextButton.addEventListener("click", () => {
  showSlide(currentSlide + 1);
});


/* =====================================
   7. KEYBOARD CONTROL
===================================== */

document.addEventListener("keydown", (e) => {

  if (e.key === "ArrowRight" || e.key === "PageDown") {

    showSlide(currentSlide + 1);

  }

  if (e.key === "ArrowLeft" || e.key === "PageUp") {

    showSlide(currentSlide - 1);

  }

  if (e.key.toLowerCase() === "f") {

    toggleFullscreen();

  }

  if (e.key === "Home") {
    showSlide(0);
  }

  if (e.key === "End") {
    showSlide(slides.length - 1);
  }

});


/* =====================================
   8. FULLSCREEN
===================================== */

function toggleFullscreen() {

  if (!document.fullscreenElement) {

    document.documentElement.requestFullscreen?.();

  } else {

    document.exitFullscreen?.();

  }

}

fullscreen.addEventListener("click", toggleFullscreen);


/* =====================================
   9. SWIPE HP
===================================== */

let touchStart = 0;

document.addEventListener("touchstart", (e) => {

  touchStart = e.changedTouches[0].screenX;

}, { passive: true });

document.addEventListener("touchend", (e) => {

  const touchEnd = e.changedTouches[0].screenX;

  const distance = touchEnd - touchStart;

  if (Math.abs(distance) > 60) {

    if (distance < 0) {
      showSlide(currentSlide + 1);
    } else {
      showSlide(currentSlide - 1);
    }

  }

}, { passive: true });


/* =====================================
   10. MULAI PRESENTASI
===================================== */

showSlide(0);
