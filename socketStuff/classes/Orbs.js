class Orb {
  constructor(settings) {
    this.color = this.getRandomColor();
    this.locX = this.getRandomNumber(0, settings.worldWidth);
    this.locY = this.getRandomNumber(0, settings.worldHeight);
    this.radius = 5;
  }

  getRandomColor() {
    let r = this.getRandomNumber(50, 200);
    let g = this.getRandomNumber(50, 200);
    let b = this.getRandomNumber(50, 200);
    return `rgb(${r},${g},${b})`;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

module.exports = Orb;
