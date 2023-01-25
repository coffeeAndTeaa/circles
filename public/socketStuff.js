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
  console.log(data);
  players = data.players;
  player.locX = data.playerX;
  player.locY = data.playerY;
});
