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
});

socket.on("playerDataFromServer", (data) => {
  players = data.players;
});
