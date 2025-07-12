import { TAMX, PROB_ENEMY_SHIP, ENEMY_SHIP_SPEED_MAX, ENEMY_SHIP_SPEED_MIN  } from "./config.js"
import { space } from "./space.js"
import { speedMultiplier } from "./game.js"

class EnemyShip {
  constructor() {
    this.element = document.createElement("img")
    this.element.className = "enemy-ship"
    this.element.src = "../img/assets/png/enemyShip.png"
    this.element.style.top = "-20px"
    this.element.style.left = `${parseInt(Math.random() * TAMX)}px`
    space.element.appendChild(this.element)

    this.speed = ENEMY_SHIP_SPEED_MIN + Math.random() * (ENEMY_SHIP_SPEED_MAX - ENEMY_SHIP_SPEED_MIN)
  }
  move() {
    this.element.style.top = `${parseInt(this.element.style.top) + this.speed * speedMultiplier}px`

  }
  remove(){
    this.element.remove()
  }
}

const enemyShips = []

export const createRandomEnemyShip = () => {
  if (Math.random() < PROB_ENEMY_SHIP) enemyShips.push(new EnemyShip())
}

export const moveEnemyShips = () => {
 enemyShips.forEach((enemyShip, enemyIndex) => {
        enemyShip.move()
        const rect = enemyShip.element.getBoundingClientRect()

        if(
            rect.top > window.innerHeight || 
            rect.left < 0 ||
            rect.right > window.innerHeight
        ){
            enemyShip.remove()
            enemyShips.splice(enemyIndex, 1);
        }
    })
}

export { enemyShips }