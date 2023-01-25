// =====================================================
// =====================服务器上socket的操作===============
// =====================================================
const io = require("../servers").io;
const Orb = require("./classes/Orbs");

const checkForOrbCollisions =
  require("./checkCollisions").checkForOrbCollisions;
const checkForPlayerCollisions =
  require("./checkCollisions").checkForPlayerCollisions;

// =====================import classes ==================
const PlayerConfig = require("./classes/PlayerConfig");
const PlayerData = require("./classes/PlayerData");
const Player = require("./classes/Player");
// ======================================================

// 游戏的基础设置
let settings = {
  defaultOrgs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  // 当一个球球变大时，zoom的值需要相应的变大
  defaultZoom: 1.5,
  worldWidth: 1000,
  worldHeight: 1000,
};
// 服务器保存的宝石信息
let orbs = [];
// 服务器保存的玩家信息
let players = [];

function initGame() {
  //创建宝石
  for (let i = 0; i < settings.defaultOrgs; i++) {
    orbs.push(new Orb(settings));
  }
}

initGame();

io.sockets.on("connect", (socket) => {
  let player = {};
  // 玩家已经连接到服务器了
  socket.on("init", ({ playerName }) => {
    // 添加玩家到game Namespace中
    socket.join("game");
    // 服务器收到玩家发送的姓名,生成新的玩家
    let playerConfig = new PlayerConfig(settings);
    let playerData = new PlayerData(playerName, settings);
    player = new Player(socket.id, playerConfig, playerData);
    console.log(player);
    // 每33ms发送一次玩家信息到所有连接的socket
    setInterval(() => {
      io.to("game").emit("playerDataFromServer", {
        players,
        playerX: player.playerData.locX,
        playerY: player.playerData.locY,
      });
    }, 33);

    // 服务器向玩家发送宝石信息
    socket.emit("initReturn", {
      orbs,
    });

    players.push(playerData);
  });
  // 接受client发送的玩家信息
  socket.on("playerDataFromClient", (data) => {
    if (data.xVector && data.yVector) {
      // 更新玩家的数据
      speed = player.playerConfig.speed;
      xV = player.playerConfig.xVector = data.xVector;
      yV = player.playerConfig.yVector = data.yVector;

      if (
        (player.playerData.locX < 5 && player.playerData.xVector < 0) ||
        (player.playerData.locX > 500 && xV > 0)
      ) {
        player.playerData.locY -= speed * yV;
      } else if (
        (player.playerData.locY < 5 && yV > 0) ||
        (player.playerData.locY > 500 && yV < 0)
      ) {
        player.playerData.locX += speed * xV;
      } else {
        player.playerData.locX += speed * xV;
        player.playerData.locY -= speed * yV;
      }
    }
  });
});

module.exports = io;
