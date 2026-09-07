// three-scene.js
// Cena 3D só do hero: a esfera de vidro posicionada dentro do "O" de "RIO".
// Rola junto com a página (diferente das partículas, que ficam fixas).

const canvas = document.getElementById("hero-canvas");
const heroEl = document.querySelector(".hero");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  50,
  heroEl.clientWidth / heroEl.clientHeight,
  0.1,
  100
);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(heroEl.clientWidth, heroEl.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(luzAmbiente);
const luzPonto = new THREE.PointLight(0xffffff, 0.8);
luzPonto.position.set(5, 5, 5);
scene.add(luzPonto);

// ===================================================
// Esfera de vidro — posicionada pra ficar dentro do "O" de "RIO"
// ===================================================
// ATENÇÃO: esses valores de x/y são um ponto de partida. Como a posição do
// "O" depende do tamanho da tela, pode ser que você precise ajustar um
// pouco: x negativo move a esfera pra ESQUERDA, x positivo pra DIREITA.
// y positivo move pra CIMA, y negativo move pra BAIXO.
const geometriaEsfera = new THREE.SphereGeometry(0.37, 32, 32);
const materialEsfera = new THREE.MeshPhongMaterial({
  color: 0x7FE7E2,
  transparent: true,
  opacity: 0.55,
  shininess: 100,
});
const esferaVidro = new THREE.Mesh(geometriaEsfera, materialEsfera);
esferaVidro.position.set(-3.2, 1.10, 0.5); // <- ajuste esses 3 números se precisar
scene.add(esferaVidro);

// Contorno fino por cima, reforçando a silhueta de vidro
const materialContorno = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
  transparent: true,
  opacity: 0.5,
});
const contornoEsfera = new THREE.Mesh(geometriaEsfera, materialContorno);
contornoEsfera.scale.set(1.05, 1.05, 1.05);
esferaVidro.add(contornoEsfera);

// Mouse: mesmo esquema das partículas
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (evento) => {
  mouseX = (evento.clientX / window.innerWidth) * 2 - 1;
  mouseY = (evento.clientY / window.innerHeight) * 2 - 1;
});

function animar() {
  requestAnimationFrame(animar);

  esferaVidro.rotation.y += 0.004;

  camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.03;
  camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.03;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}
animar();

window.addEventListener("resize", () => {
  camera.aspect = heroEl.clientWidth / heroEl.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(heroEl.clientWidth, heroEl.clientHeight);
});
