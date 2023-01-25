// =====================服务器上socket的操作===============
const io = require("../servers").io;
const Orb = require("./classes/Orbs");

// =====================import classes ==================
const PlayerConfig = require("./classes/PlayerConfig");
const PlayerData = require("./classes/PlayerData");
const Player = require("./classes/Player");
// ======================================================

let settings = {
  defaultOrgs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  // 当一个球球变大时，zoom的值需要相应的变大
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500,
};

function initGame() {
  //创建宝石
  for (let i = 0; i < settings.defaultOrgs; i++) {
    orbs.push(new Orb(settings));
  }
}

let orbs = [];

initGame();

io.sockets.on("connect", (socket) => {
  socket.emit("init", {
    orbs,
  });
});

module.exports = io;
