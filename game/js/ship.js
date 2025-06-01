import { TAMX } from "./config.js"
import { space } from "./space.js"
import { enemyShips } from "./enemyShip.js"
import { Bullet } from "./bullet.js"
import { meteors } from "./meteor.js"
import { ufos } from "./UFO.js"

const directions = [
  "assets/png/playerLeft.png",
  "assets/png/player.png",
  "assets/png/playerRight.png",
  "assets/png/playerDamaged.png"
]

class Ship {
  constructor() {
    this.element = document.createElement("img")
    this.element.id = "ship"
    this.direction = 1
    this.element.src = directions[this.direction]
    this.element.style.bottom = "20px"
    this.element.style.left = `${TAMX / 2 - 50}px`
    this.vidas = 3;   
    this.pontos = 0;
    this.levouDano = false;
    this.imunidade = false;
    this.tiros = []
    space.element.appendChild(this.element)

    
  }
  changeDirection(giro) { // -1 +1
    if (this.direction + giro >= 0 && this.direction + giro <= 2)
      this.direction = this.direction + giro
    this.element.src = directions[this.direction]
  }
  move() {
    const parentRect = this.element.parentElement.getBoundingClientRect();
    const rect = this.element.getBoundingClientRect();
    const relativeLeft = rect.left - parentRect.left;

    const leftLimit = 0;
    const rightLimit = TAMX - rect.width;

    if (this.direction === 0 && relativeLeft > leftLimit) {
      this.element.style.left = `${relativeLeft - 3}px`;
    } if (this.direction === 2 && relativeLeft < rightLimit) {
        this.element.style.left = `${relativeLeft + 3}px`;
    }  
  }

  adicionaPontuacao(pontos) {
    this.pontos += pontos;
    console.log("Pontos:", this.pontos);
    updateHUD(this.vidas, this.pontos);
  }

  levarDano(){
    if (this.imunidade) return;

    this.danificado = true;
    this.imunidade = true;
    this.element.src = directions[3]; // Bota o shipDamaged
    
    setTimeout(() => {
      this.imunidade = false;
      this.danificado = false;
      this.element.src = directions[this.direction];
    }, 3000);
  }

  tirarVida(){
    if (this.imunidade) return;

    this.vidas -= 1;
    updateHUD(this.vidas, this.pontos);
    
    this.levarDano()
    
    if (this.vidas <= 0) {
      const gameOverScreen = document.getElementById("game-over-screen");
      const pontuacaoFinal = document.getElementById("pontuacao-final");
      pontuacaoFinal.textContent = `Pontuação final: ${this.pontos}`;
      gameOverScreen.style.display = "block";
      window.gameOver = true;
    }
  }

  colisao(){
    enemyShips.forEach((enemy, index) => {
      const shipRect = this.element.getBoundingClientRect();
      const enemyRect = enemy.element.getBoundingClientRect();

      if (
          shipRect.left < enemyRect.right &&
          shipRect.right > enemyRect.left &&
          shipRect.top < enemyRect.bottom &&
          shipRect.bottom > enemyRect.top
      ) {
          enemy.element.remove();
          enemyShips.splice(index, 1);
          this.tirarVida();
      }
    });
    const shipRect = this.element.getBoundingClientRect();

        meteors.forEach((meteor, meteorIndex) => {
            const meteorRect = meteor.element.getBoundingClientRect();

            
            if (
                shipRect.left < meteorRect.right &&
                shipRect.right > meteorRect.left &&
                shipRect.top < meteorRect.bottom &&
                shipRect.bottom > meteorRect.top
            ) {
                meteor.remove();
                meteors.splice(meteorIndex, 1);
                this.tirarVida();
            }
        });
    for (let i = ufos.length - 1; i >= 0; i--) {
        const ufo   = ufos[i];
        const shipRect = this.element.getBoundingClientRect();
        const ufoRect  = ufo.element.getBoundingClientRect();

        if (
          shipRect.left   < ufoRect.right &&
          shipRect.right  > ufoRect.left  &&
          shipRect.top    < ufoRect.bottom&&
          shipRect.bottom > ufoRect.top
        ) {
          ufo.destroy();       
          ufos.splice(i, 1);   
          this.tirarVida();     
        }
      } 
  }

  atirar() {

    console.log("Tiro disparado!");
    const shipRect = this.element.getBoundingClientRect();

    const bulletWidth = 8;
    const bulletHeight = 24;

    const x = shipRect.left - this.element.parentElement.getBoundingClientRect().left + shipRect.width / 2 - bulletWidth / 2;
    const y = shipRect.top - this.element.parentElement.getBoundingClientRect().top - bulletHeight;

    this.tiros.push(new Bullet(x, y));
  }

  atualizaTiros() {
    this.tiros.forEach((tiro, i) => {
      tiro.move();
      const tiroDisparado = tiro.element.getBoundingClientRect();

      if (tiroDisparado.bottom <= 0) {
        tiro.remove();
        this.tiros.splice(i, 1);
        return;
      }

      enemyShips.forEach((enemy, enemyIndex) => {
        const enemyRect = enemy.element.getBoundingClientRect();

        if (
          tiroDisparado.left < enemyRect.right &&
          tiroDisparado.right > enemyRect.left &&
          tiroDisparado.top < enemyRect.bottom &&
          tiroDisparado.bottom > enemyRect.top
        ) {
          tiro.remove();
          this.tiros.splice(i, 1);

          enemy.element.remove();
          enemyShips.splice(enemyIndex, 1);
                    
          this.adicionaPontuacao(50); // adiciona 10 pontos por inimigo destruído
                    
          }

        });
      meteors.forEach((meteor, meteorIndex) => {
        const meteorRect = meteor.element.getBoundingClientRect();
        if (
            tiroDisparado.left < meteorRect.right &&
            tiroDisparado.right > meteorRect.left &&
            tiroDisparado.top < meteorRect.bottom &&
            tiroDisparado.bottom > meteorRect.top
            ) {
              tiro.remove();
              this.tiros.splice(i, 1);
                        
              meteor.remove();
              meteors.splice(meteorIndex, 1);

                        // Pontos diferentes dependendo do tipo
              if (meteor.type === "small") {
                  this.adicionaPontuacao(100);
              } 
              else if (meteor.type === "big") {
                  this.adicionaPontuacao(10);
              }
            }
        })
        for (let ufoIndex = ufos.length - 1; ufoIndex >= 0; ufoIndex--) {
          const ufo = ufos[ufoIndex];
          const ufoRect = ufo.element.getBoundingClientRect();

          if (
              tiroDisparado.left   < ufoRect.right &&
              tiroDisparado.right  > ufoRect.left  &&
              tiroDisparado.top    < ufoRect.bottom&&
              tiroDisparado.bottom > ufoRect.top
          ) {
              tiro.remove();
              this.tiros.splice(i, 1);

              ufo.destroy();
              ufos.splice(ufoIndex, 1);

              this.adicionaPontuacao(20);  // ajuste os pontos como desejar
                      
              break;  // sai do loop de UFOS
          }
        }
    })
  } 
}

export function updateHUD(vidas, pontos) {
  const vidasContainer = document.getElementById("vidas-container");
  const pontosEl = document.getElementById("pontos");

  // Limpa vidas antigas
  vidasContainer.innerHTML = "";

  for (let i = 0; i < vidas; i++) {
    const img = document.createElement("img");
    img.src = "assets/png/life.png"; 
    img.style.width = "24px";
    img.style.height = "24px";
    img.style.marginRight = "5px";
    vidasContainer.appendChild(img);
  }

  if (pontosEl) {
    pontosEl.textContent = `Pontos: ${pontos}`;
  }
}

export const ship = new Ship()