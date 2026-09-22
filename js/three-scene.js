// three-scene.js

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
