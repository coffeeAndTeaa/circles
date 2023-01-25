// =====================服务器上socket的操作===============
const io = require("../servers").io;
const Orb = require("./classes/Orbs");

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
  worldWidth: 500,
  worldHeight: 500,
};

let orbs = [];

function initGame() {
  //创建宝石
  for (let i = 0; i < settings.defaultOrgs; i++) {
    orbs.push(new Orb(settings));
  }
}

initGame();

io.sockets.on("connect", (socket) => {
  // 玩家已经连接到服务器了
  socket.on("init", ({ playerName }) => {
    // 服务器收到玩家发送的姓名,生成新的玩家
    let playerConfig = new PlayerConfig(settings);
    let playerData = new PlayerData(playerName, settings);
    let palyer = new Player(socket.id, playerConfig, playerData);
    // 服务器向玩家发送宝石信息
    socket.emit("initReturn", {
      orbs,
    });
  });
});

module.exports = io;
