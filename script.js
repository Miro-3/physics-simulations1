// Physics constant
const g = 9.81; // m/s²

// Canvas for incline
const canvas = document.getElementById("incline-canvas");
const ctx = canvas.getContext("2d");

let animationId;
let rampLength = 300; // pixels
let a = 0, v = 0, time = 0;
let dt = 0.02; // seconds

// Draw block on ramp (progress from 0 to 1)
function drawInclineBlock(progress) {
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

// Run simulation
function runInclineSimulation() {
    cancelAnimationFrame(animationId);

    const angleDeg = parseFloat(document.getElementById("incline-angle").value);
    const friction = parseFloat(document.getElementById("incline-friction").value);

    const angleRad = angleDeg * Math.PI / 180;

    // Acceleration
    a = g * Math.sin(angleRad) - friction * g * Math.cos(angleRad);
    if(a < 0) a = 0;

    // Assume ramp length = 1 m for calculation
    const rampLengthM = 1;
    v = Math.sqrt(2 * a * rampLengthM);
    time = v / a;

    let progress = 0;
    let elapsed = 0;
    let totalTime = time;

    function animate() {
        elapsed += dt;
        progress = elapsed / totalTime;
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

// Initial draw on page load
window.onload = function() {
    drawInclineBlock(0);
};

// Placeholder Pulley functions (to expand later)
function runPulley2Simulation() { alert("Pulley2 simulation coming soon!"); }
function comparePulley2() { alert("Pulley2 compare coming soon!"); }
function resetPulley2() { alert("Pulley2 reset coming soon!"); }

function runPulleySurfaceSimulation() { alert("Pulley+Surface simulation coming soon!"); }
function comparePulleySurface() { alert("Pulley+Surface compare coming soon!"); }
function resetPulleySurface() { alert("Pulley+Surface reset coming soon!"); }
