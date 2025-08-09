const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const mazeSize = 10;
const cellSize = canvas.width / mazeSize;
let player = { x: 0, y: 0 };
let end = { x: mazeSize - 1, y: mazeSize - 1 };
const maze = [
    [0,1,0,0,0,1,0,0,0,0],
    [0,1,0,1,0,1,0,1,1,0],
    [0,0,0,1,0,0,0,1,0,0],
    [1,1,0,1,1,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,1,0,0],
    [0,1,1,1,1,1,0,1,1,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,0]
];
const factsList = [
    "The last eight years were the hottest on record.",
    "Oceans absorb 90% of the heat caused by climate change.",
    "Arctic sea ice has decreased by 13% per decade since 1979.",
    "Sea levels have risen by about 8 inches since 1900.",
    "Melting glaciers contribute 30% of sea level rise.",
    "Coral reefs are bleaching due to warmer oceans.",
    "Hurricanes are getting stronger because of warmer seas.",
    "Heatwaves kill more people annually than any other extreme weather.",
    "Flooding events are becoming more frequent.",
    "Droughts now last longer and cover wider areas.",
    "Burning fossil fuels is the main cause of climate change.",
    "Coal is the dirtiest fossil fuel, emitting the most CO₂.",
    "Renewable energy like wind and solar is now cheaper than coal in many places.",
    "Deforestation adds huge amounts of CO₂ to the air.",
    "Methane is 25 times more powerful than CO₂ over 100 years.",
    "Cows produce large amounts of methane.",
    "Transportation makes up about 14% of global greenhouse gas emissions.",
    "Cement production causes 8% of global CO₂ emissions.",
    "If food waste were a country, it would be the 3rd largest emitter of greenhouse gases.",
    "Planting trees helps absorb CO₂ from the atmosphere.",
    "Eating less meat lowers your carbon footprint.",
    "Recycling reduces the need for energy-intensive production.",
    "Rooftop gardens help reduce urban heat and absorb CO₂.",
    "Electric cars emit less CO₂ over their lifetime than gas cars.",
    "The ocean produces over 50% of the world’s oxygen.",
    "Oceans absorb about 30% of the CO₂ humans produce.",
    "Coral reefs support about 25% of all marine life.",
    "Mangroves store five times more carbon than most forests.",
    "Seaweed farming can help absorb CO₂.",
    "The ocean’s circulation system is slowing down due to melting ice.",
    "Jellyfish populations are growing in some areas because of warming waters.",
    "Humans release over 36 billion tons of CO₂ each year.",
    "We lose 11 football fields of rainforest every minute.",
    "Only about 9% of plastic waste is recycled.",
    "By 2050, climate change could force 1 billion people to migrate.",
    "Every year, 8 million tons of plastic enter the ocean.",
    "Climate disasters cost the global economy over $250 billion in 2021.",
    "Thawing permafrost can release ancient viruses.",
    "Climate change can make coffee plants less productive.",
    "Wine quality may drop as grapes struggle with heat.",
    "Some flowers now bloom earlier than pollinators arrive.",
    "Lightning strikes are expected to increase with global warming.",
    "Cities can be up to 5°C hotter than surrounding areas.",
    "Warmer winters let more pests survive to damage crops.",
    "Climate change is lengthening allergy seasons."
];
let timeLeft = 180;
const timerElement = document.getElementById("timer");
const factsElement = document.getElementById("facts");
let timerInterval;
function drawMaze() {
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            ctx.fillStyle = maze[y][x] === 1 ? "#2c3e50" : "#ffffff";
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
    ctx.fillStyle = "green";
    ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
    ctx.fillStyle = "red";
    ctx.fillRect(end.x * cellSize, end.y * cellSize, cellSize, cellSize);
}
function movePlayer(dx, dy) {
    let newX = player.x + dx;
    let newY = player.y + dy;
    if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize && maze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
        drawMaze();
        checkWin();
    }
}
function checkWin() {
    if (player.x === end.x && player.y === end.y) {
        clearInterval(timerInterval);
        showFacts();
    }
}
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerElement.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerElement.textContent = "Time's up!";
        }
    }, 1000);
}
function showFacts() {
    let selectedFacts = [];
    while (selectedFacts.length < 3) {
        let randomFact = factsList[Math.floor(Math.random() * factsList.length)];
        if (!selectedFacts.includes(randomFact)) {
            selectedFacts.push(randomFact);
        }
    }
    factsElement.innerHTML = "<h2>🌱 Climate Facts</h2><ul>" + selectedFacts.map(f => `<li>${f}</li>`).join("") + "</ul>";
}
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") movePlayer(0, -1);
    if (e.key === "ArrowDown") movePlayer(0, 1);
    if (e.key === "ArrowLeft") movePlayer(-1, 0);
    if (e.key === "ArrowRight") movePlayer(1, 0);
});
drawMaze();
startTimer();
