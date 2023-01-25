// 玩家的所有信息将会被存储在这里
class Player {
  constructor(socketId, playerConfig, playerData) {
    this.socketId = socketId;
    this.playerConfig = playerConfig;
    this.playerData = playerData;
  }
}

module.exports = Player;
