const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
let mazeSize = 10;
const cellSize = canvas.width / mazeSize;
let maze = [];
let player = { x: 0, y: 0 };
let end = { x: mazeSize - 1, y: mazeSize - 1 };
let hazards = [];
let collectibles = [];
let timeLeft = 60;
let level = 1;
let timerInterval;
const factsElement = document.getElementById("facts");
const progressBar = document.getElementById("progress-bar");
const factsList = [
    "The last eight years were the hottest on record.",
    "Oceans absorb 90% of the heat caused by climate change.",
    "Planting trees helps absorb CO₂ from the atmosphere.",
    "Renewable energy is now cheaper than coal in many places.",
    "By 2050, climate change could force 1 billion people to migrate."
];

// Generate procedural maze
function generateMaze(size) {
    let grid = Array.from({ length: size }, () => Array(size).fill(1));
    function carve(x, y) {
        const dirs = [[0,-1],[0,1],[-1,0],[1,0]].sort(() => Math.random() - 0.5);
        for (let [dx, dy] of dirs) {
            let nx = x + dx*2, ny = y + dy*2;
            if (ny > 0 && ny < size && nx > 0 && nx < size && grid[ny][nx] === 1) {
                grid[ny][nx] = 0;
                grid[y + dy][x + dx] = 0;
                carve(nx, ny);
            }
        }
    }
    grid[1][0] = 0;
    grid[size-2][size-1] = 0;
    grid[0][0] = 0;
    carve(0,0);
    return grid;
}

// Place hazards & collectibles
function placeHazardsAndCollectibles() {
    hazards = [];
    collectibles = [];
    for (let i = 0; i < Math.floor(mazeSize/2); i++) {
        hazards.push({ x: rand(mazeSize), y: rand(mazeSize) });
    }
    for (let i = 0; i < Math.floor(mazeSize/2); i++) {
        collectibles.push({ x: rand(mazeSize), y: rand(mazeSize) });
    }
}
function rand(max) { return Math.floor(Math.random() * max); }

// Draw game
function drawMaze() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            ctx.fillStyle = maze[y][x] === 1 ? "#2c3e50" : "#ffffff";
            ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
        }
    }
    // Hazards
    ctx.fillStyle = "rgba(200,0,0,0.7)";
    hazards.forEach(h => ctx.fillRect(h.x*cellSize, h.y*cellSize, cellSize, cellSize));
    // Collectibles
    ctx.fillStyle = "green";
    collectibles.forEach(c => ctx.fillRect(c.x*cellSize, c.y*cellSize, cellSize, cellSize));
    // Player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x*cellSize, player.y*cellSize, cellSize, cellSize);
    // End
    ctx.fillStyle = "gold";
    ctx.fillRect(end.x*cellSize, end.y*cellSize, cellSize, cellSize);
}

function movePlayer(dx, dy) {
    let newX = player.x + dx;
    let newY = player.y + dy;
    if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize && maze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
        checkCollectible();
        checkHazard();
        checkWin();
        drawMaze();
    }
}

function checkCollectible() {
    collectibles = collectibles.filter(c => {
        if (c.x === player.x && c.y === player.y) {
            timeLeft += 5;
            showFactPopup();
            return false;
        }
        return true;
    });
}
function checkHazard() {
    hazards.forEach(h => {
        if (h.x === player.x && h.y === player.y) {
            timeLeft -= 5;
        }
    });
}
function showFactPopup() {
    let fact = factsList[Math.floor(Math.random() * factsList.length)];
    factsElement.innerHTML = `<p><strong>🌱 Fact:</strong> ${fact}</p>`;
}

function checkWin() {
    if (player.x === end.x && player.y === end.y) {
        clearInterval(timerInterval);
        if (level < 3) {
            level++;
            mazeSize += 5;
            startLevel();
        } else {
            victory();
        }
    }
}

function victory() {
    factsElement.innerHTML = "<h2>🎉 You Won!</h2><p>You're a climate hero!</p>";
    confettiEffect();
}
function confettiEffect() {
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            ctx.fillStyle = `hsl(${Math.random()*360},100%,50%)`;
            ctx.fillRect(rand(mazeSize)*cellSize, rand(mazeSize)*cellSize, cellSize, cellSize);
        }, i*20);
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        let progress = (timeLeft / 60) * 100;
        progressBar.style.width = `${progress}%`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            factsElement.innerHTML = "<h2>⏳ Time's up!</h2>";
        }
    }, 1000);
}

function startLevel() {
    maze = generateMaze(mazeSize);
    player = { x: 0, y: 0 };
    end = { x: mazeSize - 1, y: mazeSize - 1 };
    placeHazardsAndCollectibles();
    drawMaze();
    timeLeft = 60;
    startTimer();
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") movePlayer(0,-1);
    if (e.key === "ArrowDown") movePlayer(0,1);
    if (e.key === "ArrowLeft") movePlayer(-1,0);
    if (e.key === "ArrowRight") movePlayer(1,0);
});

startLevel();
