//==================================
//========用户端的socket操作==========
//==================================

let socket = io.connect("http://localhost:80");

socket.on("init", (data) => {
  orbs = data.orbs;
});
