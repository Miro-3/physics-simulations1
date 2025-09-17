let canvas, ctx, animationId;
const g = 9.81; // m/s²
let rampLength = 300; // pixels
let a = 0, v = 0, time = 0;
let dt = 0.02; // simulation time step

// Initialize canvas and draw initial block
window.onload = function() {
    canvas = document.getElementById("incline-canvas");
    ctx = canvas.getContext("2d");

    drawInclineBlock(0);
};

// Draw block on ramp
function drawInclineBlock(progress) {
    if (!ctx) return; // safety check

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const angleDeg = parseFloat(document.getElementById("incline-angle").value);
    const angleRad = angleDeg * Math.PI / 180;

    // Draw ramp
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(50 + rampLength * Math.cos(angleRad), 250 - rampLength * Math.sin(angleRad));
    ctx.stroke();

    // Block position
    const blockX = 50 + rampLength * Math.cos(angleRad) * progress;
    const blockY = 250 - rampLength * Math.sin(angleRad) * progress;

    ctx.fillStyle = "red";
    ctx.fillRect(blockX - 15, blockY - 15, 30, 30);
}

// Run Inclined Plane Simulation
function runInclineSimulation() {
    cancelAnimationFrame(animationId);

    const angleDeg = parseFloat(document.getElementById("incline-angle").value);
    const friction = parseFloat(document.getElementById("incline-friction").value);

    const angleRad = angleDeg * Math.PI / 180;

    // Acceleration (m/s²)
    a = g * Math.sin(angleRad) - friction * g * Math.cos(angleRad);
    if (a < 0) a = 0;

    // Assume ramp length = 1 m for calculation
    const rampLengthM = 1;
    v = Math.sqrt(2 * a * rampLengthM);
    time = a === 0 ? 0 : v / a;

    let progress = 0;
    let elapsed = 0;
    let totalTime = time;

    function animate() {
        elapsed += dt;
        progress = totalTime > 0 ? elapsed / totalTime : 1;
        if(progress > 1) progress = 1;
        drawInclineBlock(progress);

        // Display values
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.fillText(`Acceleration: ${a.toFixed(2)} m/s²`, 10, 20);
        ctx.fillText(`Final velocity: ${v.toFixed(2)} m/s`, 10, 40);
        ctx.fillText(`Time to bottom: ${time.toFixed(2)} s`, 10, 60);

        if(progress < 1) {
            animationId = requestAnimationFrame(animate);
        }
    }

    animate();
}

// Compare predictions
function compareIncline() {
    const predAcc = parseFloat(document.getElementById("incline-pred-acc").value);
    const predVel = parseFloat(document.getElementById("incline-pred-vel").value);
    const predTime = parseFloat(document.getElementById("incline-pred-time").value);

    let html = `<ul>`;
    html += `<li>Acceleration: predicted = ${predAcc || '-'} m/s², simulated = ${a.toFixed(2)}</li>`;
    html += `<li>Final velocity: predicted = ${predVel || '-'} m/s, simulated = ${v.toFixed(2)}</li>`;
    html += `<li>Time to bottom: predicted = ${predTime || '-'} s, simulated = ${time.toFixed(2)}</li>`;
    html += `</ul>`;

    document.getElementById("incline-comparison").innerHTML = `<h4>Comparison Results</h4>` + html;
}

// Reset simulation
function resetIncline() {
    cancelAnimationFrame(animationId);
    drawInclineBlock(0);
    document.getElementById("incline-comparison").innerHTML =
        `<h4>Comparison Results</h4><p>Enter predictions and run simulation to see comparison here.</p>`;
}

// Placeholder Pulley 2 Masses
function runPulley2Simulation() { alert("Pulley2 simulation coming soon!"); }
function comparePulley2() { alert("Pulley2 compare coming soon!"); }
function resetPulley2() { alert("Pulley2 reset coming soon!"); }

// Placeholder Pulley + Surface
function runPulleySurfaceSimulation() { alert("Pulley+Surface simulation coming soon!"); }
function comparePulleySurface() { alert("Pulley+Surface compare coming soon!"); }
function resetPulleySurface() { alert("Pulley+Surface reset coming soon!"); }
