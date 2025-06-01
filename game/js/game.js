import { FPS, TAMX } from "./config.js"
import { space } from "./space.js"
import { ship, updateHUD } from "./ship.js"
import { createRandomEnemyShip, moveEnemyShips, enemyShips } from "./enemyShip.js"
import { createRandomMeteor, moveMeteors, meteors } from "./meteor.js"
import { createRandomUFO, moveUFOs, ufos } from "./UFO.js"
function init() {
  setInterval(run, 1000 / FPS)
}

export let speedMultiplier = 1;
const SPEED_INCREASE_PERCENT = 0.1; // aumenta 10% a cada minuto, você pode ajustar
let elapsedSeconds = 0;

window.gameStarted = false;
window.isPaused = true

function recomecarJogo() {
  const gameOverScreen = document.getElementById("game-over-screen");
  if (gameOverScreen) {
    gameOverScreen.style.display = "none";
  }

  window.gameOver = false;
  window.isPaused = true;
  window.gameStarted = false;

  ship.vidas = 3;
  ship.pontos = 0;
  ship.element.style.left = `${TAMX/2 - 50}px`
  updateHUD(ship.vidas, ship.pontos);

  enemyShips.forEach(e => e.element.remove());
  enemyShips.length = 0;

  ship.tiros.forEach(b => b.remove());
  ship.tiros.length = 0;

  meteors.forEach(m => m.remove());
  meteors.length = 0;
//
  ufos.forEach(u => u.destroy());
  ufos.length = 0;
}

document.getElementById("restart-btn").addEventListener("click", () => {
  const gameOverScreen = document.getElementById("game-over-screen");
  gameOverScreen.style.display = "none";

  window.gameOver = false;

  ship.vidas = 3;
  ship.pontos = 0;
  updateHUD(ship.vidas, ship.pontos);

  enemyShips.forEach(e => e.element.remove());
  enemyShips.length = 0;

  ship.tiros.forEach(b => b.remove());
  ship.tiros.length = 0;

  meteors.forEach(m => m.remove());
  meteors.length = 0;
//
  ufos.forEach(u => u.destroy());
  ufos.length = 0;

});


window.addEventListener("keydown", (e) => {
  if (!window.gameStarted && e.code === "Space"){
      e.preventDefault()
      window.gameStarted = true;
      window.isPaused = false;
      document.getElementById("start-screen").style.display = "none"
      document.getElementById("pause-screen").style.display = "none"
  }
  if (e.code === "Space") {
    e.preventDefault();
    
    if (!window.isPaused) ship.atirar();
  }

  if (e.code === "KeyP") {
    if (!window.gameStarted) {
      window.gameStarted = true;
      window.isPaused = false;
      document.getElementById("pause-screen").style.display = "none";

    } else {
      window.isPaused = !window.isPaused;
      document.getElementById("pause-screen").style.display = window.isPaused ? "block" : "none";

    }
  }

  if (e.code === "KeyR") {
    e.preventDefault();
    document.getElementById("start-screen").style.display = "block"
    recomecarJogo();
  }

  if (!window.isPaused) {
    if (e.key === "ArrowLeft") ship.changeDirection(-1);
    if (e.key === "ArrowRight") ship.changeDirection(+1);
  }
});

function startGameLoop() {
  if (gameLoopInterval === null) {
    gameLoopInterval = setInterval(run, 1000 / FPS);
  }
}

function stopGameLoop() {
  if (gameLoopInterval !== null) {
    clearInterval(gameLoopInterval);
    gameLoopInterval = null;
  }
}

function run() {
  updateHUD(ship.vidas, ship.pontos)

  if (window.isPaused || window.gameOver|| !window.gameStarted) return;

  elapsedSeconds += 1 / FPS;

  if (elapsedSeconds >= 60) {
    elapsedSeconds = 0;
    speedMultiplier += speedMultiplier * SPEED_INCREASE_PERCENT;
  }

  space.move()
  ship.move()
  createRandomEnemyShip()
  moveEnemyShips()
  createRandomMeteor()
  moveMeteors()
  createRandomUFO()
  moveUFOs()
  ship.colisao()
  ship.atualizaTiros()
}

setInterval(run, 1000/FPS)