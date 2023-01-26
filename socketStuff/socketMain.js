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
  defaultOrgs: 50,
  defaultSpeed: 6,
  defaultSize: 6,
  // 当一个球球变大时，zoom的值需要相应的变大
  defaultZoom: 1.5,
  worldWidth: 200,
  worldHeight: 200,
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

setInterval(() => {
  if (players.length > 0) {
    io.to("game").emit("playerDataFromServer", {
      players,
    });
  }
}, 33);

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
    // 每33ms发送当前玩家信息到客户端
    setInterval(() => {
      socket.emit("tickTock", {
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
    // 很关键的一个条件，避免进入死循环
    if (data.xVector && data.yVector) {
      // 更新玩家的数据
      speed = player.playerConfig.speed;
      xV = player.playerConfig.xVector = data.xVector;
      yV = player.playerConfig.yVector = data.yVector;

      if (
        (player.playerData.locX < 5 && player.playerData.xVector < 0) ||
        (player.playerData.locX > settings.worldWidth && xV > 0)
      ) {
        player.playerData.locY -= speed * yV;
      } else if (
        (player.playerData.locY < 5 && yV > 0) ||
        (player.playerData.locY > settings.worldHeight && yV < 0)
      ) {
        player.playerData.locX += speed * xV;
      } else {
        player.playerData.locX += speed * xV;
        player.playerData.locY -= speed * yV;
      }
      let capturedOrb = checkForOrbCollisions(
        player.playerData,
        player.playerConfig,
        orbs,
        settings
      );

      capturedOrb
        .then((data) => {
          // 说明玩家碰到了某块宝石
          const orbData = {
            orbIndex: data,
            newOrb: orbs[data],
          };
          // 更新积分榜
          io.sockets.emit("updateLeaderBoard", getLeaderBoard());
          io.sockets.emit("orbSwitch", orbData);
        })
        .catch(() => {});

      let playerDeath = checkForPlayerCollisions(
        player.playerData,
        player.playerConfig,
        players,
        player.socketId
      );
      playerDeath
        .then((data) => {
          // console.log("Player collision!!!")
          // 更新积分榜
          io.sockets.emit("updateLeaderBoard", getLeaderBoard());
          // 发送死亡信息
          io.sockets.emit("playerDeath", data);
        })
        .catch(() => {
          // console.log("No player collision")
        });
    }
  });

  // 玩家断开连接后删除玩家
  socket.on("disconnect", (data) => {
    if (player.playerData) {
      players.forEach((currPlayer, i) => {
        // if they match...
        if (currPlayer.uid == player.playerData.uid) {
          // 从玩家队列中删除玩家
          players.splice(i, 1);
          io.sockets.emit("updateLeaderBoard", getLeaderBoard());
        }
      });
    }
  });
});

function getLeaderBoard() {
  // sort players in desc order
  players.sort((a, b) => {
    return b.score - a.score;
  });
  let leaderBoard = players.map((curPlayer) => {
    return {
      name: curPlayer.name,
      score: curPlayer.score,
    };
  });
  return leaderBoard;
}

module.exports = io;
