// 玩家的个人配置信息
class PlayerConfig {
  constructor(settings) {
    this.xVector = 0; // 玩家将要移动的位置
    this.yVector = 0;
    this.speed = settings.defaultSpeed;
    this.zoom = settings.defaultZoom;
  }
}

module.exports = PlayerConfig;
