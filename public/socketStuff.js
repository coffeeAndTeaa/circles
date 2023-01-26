//==================================
//========用户端的socket操作==========
//==================================
let socket = io.connect("http://localhost:80");

// 当用户点击开始游戏时调用init
function init() {
  draw();
  socket.emit("init", {
    playerName: player.name,
  });
}

socket.on("initReturn", (data) => {
  orbs = data.orbs;
  //向服务器每33ms发送玩家信息
  setInterval(() => {
    socket.emit("playerDataFromClient", {
      xVector: player.xVector,
      yVector: player.yVector,
    });
  }, 33);
});

socket.on("playerDataFromServer", (data) => {
  // console.log(data);
  players = data.players;
});

socket.on("orbSwitch", (data) => {
  // 更新orbs
  orbs.splice(data.orbIndex, 1, data.newOrb);
});

socket.on("tickTock", (data) => {
  player.locX = data.playerX;
  player.locY = data.playerY;
});

socket.on("updateLeaderBoard", (data) => {
  // console.log(data);
  document.querySelector(".leader-board").innerHTML = "";
  data.forEach((curPlayer) => {
    document.querySelector(".leader-board").innerHTML += `
          <li class="leaderboard-player">${curPlayer.name} - ${curPlayer.score}</li>
      `;
  });

  // 更新当前玩家的分数
  let currOne = data.find((curPlayer) => {
    return curPlayer.name === player.name;
  });

  if (currOne) {
    document.querySelector(".player-score").innerHTML = `${currOne.score}`;
  }
});

// 提示玩家被谁杀死了
socket.on("playerDeath", (data) => {
  console.log(`Got killed: ${data.died.name}`);
  console.log(`The killer: ${data.killedBy.name}`);
  document.querySelector(
    "#game-message"
  ).innerHTML = `${data.died.name} absorbed by ${data.killedBy.name}`;
  $("#game-message").css({
    "background-color": "#00e6e6",
    opacity: 1,
  });
  $("#game-message").show();
  $("#game-message").fadeOut(5000);
});
