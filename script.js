<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Incline Block Simulation</title>
  <style>
    body { background: #111; color: #eee; font-family: monospace; }
    canvas { background: #222; display: block; margin: 20px auto; border: 2px solid #555; }
    #info { text-align: center; }
  </style>
</head>
<body>
  <canvas id="simCanvas" width="800" height="500"></canvas>
  <div id="info"></div>

  <script>
    const canvas = document.getElementById("simCanvas");
    const ctx = canvas.getContext("2d");

    // Simulation parameters
    const inclineAngle = 25 * Math.PI / 180; // radians
    const blockSize = 40;
    const g = 9.8; // m/s^2
    const frictionCoeff = 0.1;

    // Incline geometry
    const inclineLength = 500;
    const inclineX0 = 150;
    const inclineY0 = 400;
    const inclineX1 = inclineX0 + inclineLength * Math.cos(inclineAngle);
    const inclineY1 = inclineY0 - inclineLength * Math.sin(inclineAngle);

    // Block state
    let pos = 0; // distance along incline (m, scaled to px)
    let vel = 0;
    let acc = 0;

    const pixelsPerMeter = 50;

    function updatePhysics(dt) {
      const weight = g;
      const parallel = weight * Math.sin(inclineAngle);
      const normal = weight * Math.cos(inclineAngle);
      const friction = frictionCoeff * normal;
      const net = parallel - friction;

      acc = net;
      vel += acc * dt;
      pos += vel * dt + 0.5 * acc * dt * dt;
    }

    function getBlockCoords() {
      const x = inclineX0 + pos * Math.cos(inclineAngle) * pixelsPerMeter;
      const y = inclineY0 - pos * Math.sin(inclineAngle) * pixelsPerMeter;
      return {x, y};
    }

    function drawIncline() {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(inclineX0, inclineY0);
      ctx.lineTo(inclineX1, inclineY1);
      ctx.stroke();
    }

    function drawBlock(x, y) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-inclineAngle);
      ctx.fillStyle = "#4CAF50";
      ctx.fillRect(-blockSize/2, -blockSize/2, blockSize, blockSize);
      ctx.restore();
    }

    function drawVector(x, y, angle, mag, color) {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + mag * Math.cos(angle), y + mag * Math.sin(angle));
      ctx.stroke();
    }

    function drawForces(x, y) {
      const scale = 15;
      const weight = g * scale;
      const normal = g * Math.cos(inclineAngle) * scale;
      const friction = frictionCoeff * g * Math.cos(inclineAngle) * scale;
      const parallel = g * Math.sin(inclineAngle) * scale;

      // Weight (downward)
      drawVector(x, y, Math.PI/2, weight, "red");
      // Normal (perpendicular to incline)
      drawVector(x, y, -Math.PI/2 + inclineAngle, normal, "cyan");
      // Friction (up incline)
      drawVector(x, y, Math.PI - inclineAngle, friction, "orange");
      // Net force (down incline)
      drawVector(x, y, -inclineAngle, parallel - friction, "yellow");
    }

    function drawInfo() {
      document.getElementById("info").innerHTML =
        `pos = ${pos.toFixed(2)} m | vel = ${vel.toFixed(2)} m/s | acc = ${acc.toFixed(2)} m/s²`;
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawIncline();

      const {x, y} = getBlockCoords();
      drawBlock(x, y);
      drawForces(x, y);
      drawInfo();

      updatePhysics(0.016);
      requestAnimationFrame(loop);
    }

    loop();
  </script>
</body>
</html>
