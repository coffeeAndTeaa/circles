let wHeight = $(window).height();
let wWidth = $(window).width();

// 用户端储存的数据
let player = {};
let orbs = [];
let players = [];

let canvas = document.querySelector("#the-canvas");
let context = canvas.getContext("2d");
canvas.width = wWidth;
canvas.height = wHeight;

// 用户打开网页后显示登录
$(window).load(() => {
  $("#loginModal").modal("show");
});

// 设置用户信息
$(".name-form").submit((event) => {
  event.preventDefault();
  player.name = document.querySelector("#name-input").value;
  $("#loginModal").modal("hide");
  $("#spawnModal").modal("show");
  document.querySelector(".player-name").innerHTML = player.name;
});

$(".start-game").click((event) => {
  $(".modal").modal("hide");
  $(".hiddenOnStart").removeAttr("hidden");
  // 当玩家点击开始游戏后，init函数被执行
  init();
});
