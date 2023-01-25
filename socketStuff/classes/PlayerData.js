// 其他玩家需要知道的数据
class PlayerData {
  constructor(playerName, settings) {
    this.name = playerName;
    this.locX = Math.floor(settings.worldWidth * Math.random() + 100);
    this.locY = Math.floor(settings.worldHeight * Math.random() + 100);
    this.radius = settings.defaultSize;
    this.color = this.getRandomColor();
    this.score = 0;
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

module.exports = PlayerData;
