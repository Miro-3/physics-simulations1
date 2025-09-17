// Physics constants
const g = 9.81; // m/s²

// Get canvas and context
const canvas = document.getElementById("incline-canvas");
const ctx = canvas.getContext("2d");

// Simulation parameters
let animationId;
let posX = 50; // start x
let posY = 200; // start y
const rampLength = 300; // pixels
let a = 0, v = 0, time = 0;
let dt = 0.02; // time step in seconds

// Draw ramp and block
function drawInclineBlock(progress) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw ramp
    const angleDeg = parseFloat(document.getElementById("incline-angle").value);
    const angleRad = angleDeg * Math.PI / 180;
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(50 + rampLength * Math.cos(angleRad), 250 - rampLength * Math.sin(angleRad));
    ctx.stroke();

    // Block position along ramp
    const blockX = 50 + rampLength * Math.cos(angleRad) * progress;
    const blockY = 250 - rampLength * Math.sin(angleRad) * progress;

    // Draw block
    ctx.fillStyle = "red";
    ctx.fillRect(blockX - 15, blockY - 15, 30, 30);
}

// Run simulation
function runInclineSimulation() {
    cancelAnimationFrame(animationId);
    posX = 50;
    posY = 200;

    // Read inputs
    const angleDeg = parseFloat(document.getElementById("incline-angle").value);
    const mass = parseFloat(document.getElementById("incline-mass").value);
    const friction = parseFloat(document.getElementById("incline-friction").value);

    // Compute acceleration
    const angleRad = angleDeg * Math.PI / 180;
    a = g * Math.sin(angleRad) - friction * g * Math.cos(angleRad);
    if(a < 0) a = 0; // prevent negative acceleration

    // Compute ramp length
    const rampLengthM = 1; // assume 1 meter for calculations
    v = Math.sqrt(2 * a * rampLengthM);
    time = v / a;

    let progress = 0;
    let totalTime = time; // seconds
    let elapsed = 0;

    function animate() {
        elapsed += dt;
        progress = elapsed / totalTime;
        if(progress > 1) progress = 1;
        drawInclineBlock(progress);

        // Display results
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

    let comparisonHTML = `<ul>`;
    comparisonHTML += `<li>Acceleration: predicted = ${predAcc || '-'} m/s², simulated = ${a.toFixed(2)}</li>`;
    comparisonHTML += `<li>Final velocity: predicted = ${predVel || '-'} m/s, simulated = ${v.toFixed(2)}</li>`;
    comparisonHTML += `<li>Time to bottom: predicted = ${predTime || '-'} s, simulated = ${time.toFixed(2)}</li>`;
    comparisonHTML += `</ul>`;

    document.getElementById("incline-comparison").innerHTML = `<h4>Comparison Results</h4>` + comparisonHTML;
}

// Reset inputs
function resetIncline() {
    cancelAnimationFrame(animationId);
    drawInclineBlock(0);
    document.getElementById("incline-comparison").innerHTML = `<h4>Comparison Results</h4><p>Enter predictions and run simulation to see comparison here.</p>`;
}
