// bullet.js
import { space } from "./space.js";

export class Bullet {
  constructor(x, y) {
    this.element = document.createElement("img");
    this.element.src = "assets/png/laserRed.png";
    this.element.className = "bullet";
    this.element.style.position = "absolute";
    this.element.style.left = `${x}px`;
    this.element.style.top  = `${y}px`;

    space.element.appendChild(this.element);
  }
  move() {
    this.element.style.top = `${parseInt(this.element.style.top) - 3}px`;
  }
  remove() {
    this.element.remove();
  }
}
