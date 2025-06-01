// ufo.js
import { space } from "./space.js";
import { TAMX, TAMY, UFO_SPEED_MAX, UFO_SPEED_MIN } from "./config.js";
import { speedMultiplier } from "./game.js";

export class UFO {
  constructor() {
    this.element = document.createElement("img");
    this.element.src = "./assets/png/enemyUFO.png";  
    this.element.className = "ufo";
    this.element.style.position = "absolute";

    // velocidades aleatórias
    this.baseSpeedY = UFO_SPEED_MIN + Math.random() * (UFO_SPEED_MAX - UFO_SPEED_MIN);
    this.baseSpeedX = UFO_SPEED_MIN + Math.random() * (UFO_SPEED_MAX - UFO_SPEED_MIN);


    this.element.style.top  = "-20px"
    this.element.style.left = `${parseInt(Math.random() * TAMX)}px`

    space.element.appendChild(this.element)


    this.element.onload = () => {
      this.boundWidth  = this.element.width
      this.boundRightX = TAMX - this.boundWidth
    }
  }

    move(){
        const top  = parseFloat(this.element.style.top);
        const left = parseFloat(this.element.style.left);

        const deltaY = this.baseSpeedY * speedMultiplier;
        const deltaX = this.baseSpeedX * speedMultiplier;

        let newLeft = left + deltaX;
        let newTop  = top  + deltaY;

        const maxRight = TAMX - (this.boundWidth || this.element.width || 50); 

        if (newLeft <= 0) {
            newLeft = 0;
            this.baseSpeedX = Math.abs(this.baseSpeedX); 
        } else if (newLeft >= maxRight) {
            newLeft = maxRight;
            this.baseSpeedX = -Math.abs(this.baseSpeedX); 
        }

        this.element.style.left = `${newLeft}px`;
        this.element.style.top  = `${newTop}px`;
    }


  outOfBounds(){
    return parseFloat(this.element.style.top) > TAMY
  }

  destroy(){
    this.element.remove()
  }
}

const ufos = [];

export const createRandomUFO = () => {
  if (Math.random() < 0.01) {
    ufos.push(new UFO());
  }
};

export const moveUFOs = () => {
  for (let i = ufos.length - 1; i >= 0; i--) {
    const u = ufos[i]
    u.move()

    if (u.outOfBounds()) {
      u.destroy()
      ufos.splice(i,1)
    }
  }
}

export { ufos }