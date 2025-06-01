import { space } from "./space.js";
import {  TAMX, METEOR_BIG_SPEED_MAX, METEOR_BIG_SPEED_MIN, METEOR_SMALL_SPEED_MAX, METEOR_SMALL_SPEED_MIN} from "./config.js";
import { speedMultiplier } from "./game.js";
export class Meteor {
  constructor(type = "small") {
    this.type = type;
    this.element = document.createElement("img");

    if (type === "small") {
      
      this.element.src = "./assets/png/meteorSmall.png";
      this.width = 30;
      this.height = 30;
      this.speedY = METEOR_SMALL_SPEED_MIN + Math.random() * (METEOR_SMALL_SPEED_MAX - METEOR_SMALL_SPEED_MIN);
      this.speedX = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random());
    
    } else if (type === "big") {
      this.element.src = "./assets/png/meteorBig.png";
      this.width = 60;
      this.height = 60;
      this.speedY = METEOR_BIG_SPEED_MIN + Math.random() * (METEOR_BIG_SPEED_MAX - METEOR_BIG_SPEED_MIN);
      this.speedX = (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random());
    }

    this.element.className = "meteor";
    this.element.style.position = "absolute";
    this.element.style.top = "-60px";
    this.element.style.left = `${Math.floor(Math.random() * TAMX)}px`;
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;

    space.element.appendChild(this.element);
  }

  move() {
    
    const top = parseFloat(this.element.style.top);
    const left = parseFloat(this.element.style.left);

    this.element.style.top = `${top + this.speedY * speedMultiplier}px`;
    this.element.style.left = `${left + this.speedX * speedMultiplier}px`;
  }

  remove() {
    this.element.remove();
  }
}

export const meteors = []


export const createRandomMeteor = () => {
  if (Math.random() < 0.01) {
    const type = Math.random() < 0.20 ? "small" : "big"; 
    meteors.push(new Meteor(type));
  }
};

export function moveMeteors() {
  meteors.forEach((meteor, i) => {
    meteor.move();
    const rect = meteor.element.getBoundingClientRect();

    if (
      rect.top > window.innerHeight ||
      rect.left < 0 ||
      rect.right > window.innerWidth
    ) {
      meteor.remove();
      meteors.splice(i, 1);
    }
  });
}

