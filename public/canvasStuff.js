// ================================
// =============DRAWING============
// ================================
// draw on the screen
function draw() {
  // 重置transform的值
  context.setTransform(1, 0, 0, 1, 0, 0);
  // 重制画布
  context.clearRect(0, 0, canvas.width, canvas.height);

  // 调整camera
  const camX = -player.locX + canvas.width / 2;
  const camY = -player.locY + canvas.height / 2;
  // translate allows us to move the canvas around
  context.translate(camX, camY);

  // 绘制所有玩家
  players.forEach((p) => {
    context.beginPath();
    context.fillStyle = p.color;
    context.arc(p.locX, p.locY, 19, 0, Math.PI * 2);
    // context.arc(100, 100, 19, 0, Math.PI * 2);
    context.fill();
    context.lineWidth = 3;
    context.strokeStyle = "rgb(0, 255, 0)";
    context.stroke();
  });

  // 绘制所有的小球
  orbs.forEach((orb) => {
    context.beginPath();
    context.fillStyle = orb.color;
    context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2);
    context.fill();
  });

  requestAnimationFrame(draw);
}

// 监听鼠标的移动
canvas.addEventListener("mousemove", (event) => {
  // console.log(event)
  const mousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
  const angleDeg =
    (Math.atan2(
      mousePosition.y - canvas.height / 2,
      mousePosition.x - canvas.width / 2
    ) *
      180) /
    Math.PI;
  if (angleDeg >= 0 && angleDeg < 90) {
    // console.log("Mouse is in the lower right quad")
    xVector = 1 - angleDeg / 90;
    yVector = -(angleDeg / 90);
  } else if (angleDeg >= 90 && angleDeg <= 180) {
    // console.log("Mouse is in the lower left quad")
    xVector = -(angleDeg - 90) / 90;
    yVector = -(1 - (angleDeg - 90) / 90);
  } else if (angleDeg >= -180 && angleDeg < -90) {
    // console.log("Mouse is in the upper left quad")
    xVector = (angleDeg + 90) / 90;
    yVector = 1 + (angleDeg + 90) / 90;
  } else if (angleDeg < 0 && angleDeg >= -90) {
    // console.log("Mouse is in the upper right quad")
    xVector = (angleDeg + 90) / 90;
    yVector = 1 - (angleDeg + 90) / 90;
  }

  player.xVector = xVector;
  player.yVector = yVector;
  // console.log(player);
});
