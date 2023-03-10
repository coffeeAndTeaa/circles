// 创建app 和 io这两个对象
const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
const socketio = require("socket.io");
const expressServer = app.listen(80);
const io = socketio(expressServer);
const helmet = require("helmet");
app.use(helmet());
console.log("Express and socketio are listening on port 80");

module.exports = {
  app,
  io,
};
