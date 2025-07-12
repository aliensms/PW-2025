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
  document.getElementById("game-over-screen").style.display = "none";
  document.getElementById("pause-screen").style.display = "none";
  document.getElementById("start-screen").style.display = "flex";
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

async function handleGameOver() {
  // Ensure this runs only once
  if (window.gameOver) return;
  window.gameOver = true;

  const finalScore = ship.pontos;
  const gameOverScreen = document.getElementById("game-over-screen");
  const pontuacaoFinalElement = document.getElementById("pontuacao-final");

  // Display the final score and show the game over screen
  pontuacaoFinalElement.textContent = `your score: ${finalScore}`;
  gameOverScreen.style.display = "flex";

  // Send the score to the backend server
  try {
    const response = await fetch('/ranking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score: finalScore }),
    });

    if (response.ok) {
      console.log('Score saved successfully!');
    } else {
      const errorData = await response.json();
      console.error('Failed to save score:', errorData.message);
    }
  } catch (error) {
    console.error('Error sending score to server:', error);
  }
}

document.getElementById("restart-btn").addEventListener("click", recomecarJogo);

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

    } else if (window.gameStarted && !window.gameOver) {
      window.isPaused = !window.isPaused;
      document.getElementById("pause-screen").style.display = window.isPaused ? "flex" : "none";
    }
  }

  if (e.code === "KeyR") {
    e.preventDefault();
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