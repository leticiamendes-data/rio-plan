// three-particles.js
// Camada de "poeira estelar" fixa, cobrindo a página inteira o tempo todo.
// Separado da cena do hero de propósito: essa aqui não rola com a página,
// fica sempre visível, tipo um fundo.

const canvasParticulas = document.getElementById("particles-canvas");

const cenaParticulas = new THREE.Scene();

const cameraParticulas = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
cameraParticulas.position.z = 6;

const rendererParticulas = new THREE.WebGLRenderer({
  canvas: canvasParticulas,
  alpha: true,
  antialias: true,
});
rendererParticulas.setSize(window.innerWidth, window.innerHeight);
rendererParticulas.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// A nuvem de pontos
const QUANTIDADE_PARTICULAS = 250;
const geometria = new THREE.BufferGeometry();
const posicoes = new Float32Array(QUANTIDADE_PARTICULAS * 3);

for (let i = 0; i < QUANTIDADE_PARTICULAS * 3; i++) {
  posicoes[i] = (Math.random() - 0.5) * 16;
}
geometria.setAttribute("position", new THREE.BufferAttribute(posicoes, 3));

const materialParticulas = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.025,
  transparent: true,
  opacity: 0.35,
});

const particulas = new THREE.Points(geometria, materialParticulas);
cenaParticulas.add(particulas);

// Mouse: mesma lógica de sempre, guarda a posição normalizada
let mouseXParticulas = 0;
let mouseYParticulas = 0;

document.addEventListener("mousemove", (evento) => {
  mouseXParticulas = (evento.clientX / window.innerWidth) * 2 - 1;
  mouseYParticulas = (evento.clientY / window.innerHeight) * 2 - 1;
});

function animarParticulas() {
  requestAnimationFrame(animarParticulas);

  particulas.rotation.y += 0.0005;
  particulas.rotation.x += 0.0002;

  cameraParticulas.position.x += (mouseXParticulas * 0.8 - cameraParticulas.position.x) * 0.02;
  cameraParticulas.position.y += (-mouseYParticulas * 0.8 - cameraParticulas.position.y) * 0.02;
  cameraParticulas.lookAt(cenaParticulas.position);

  // No tema do Dia 11, a poeira estelar fica mais forte — é o nosso "céu estrelado"
  const temaEscuroAtivo = document.body.classList.contains("tema-rir");
  materialParticulas.opacity = temaEscuroAtivo ? 0.9 : 0.35;
  materialParticulas.size = temaEscuroAtivo ? 0.04 : 0.025;

  rendererParticulas.render(cenaParticulas, cameraParticulas);
}
animarParticulas();

window.addEventListener("resize", () => {
  cameraParticulas.aspect = window.innerWidth / window.innerHeight;
  cameraParticulas.updateProjectionMatrix();
  rendererParticulas.setSize(window.innerWidth, window.innerHeight);
});
