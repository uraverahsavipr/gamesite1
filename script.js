const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Player object
const player = {
    x: 50,
    y: 300,
    width: 50,
    height: 50,
    color: 'blue',
    speed: 5,
    dx: 0,
    dy: 0
};

// Opponent object
const opponent = {
    x: 700,
    y: 300,
    width: 50,
    height: 50,
    color: 'red',
    speed: 5,
    dx: 0,
    dy: 0
};

// Draw player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw opponent
function drawOpponent() {
    ctx.fillStyle = opponent.color;
    ctx.fillRect(opponent.x, opponent.y, opponent.width, opponent.height);
}

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Move player
function movePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    // Prevent player from going out of bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Move opponent
function moveOpponent() {
    opponent.x += opponent.dx;
    opponent.y += opponent.dy;

    // Prevent opponent from going out of bounds
    if (opponent.x < 0) opponent.x = 0;
    if (opponent.x + opponent.width > canvas.width) opponent.x = canvas.width - opponent.width;
    if (opponent.y < 0) opponent.y = 0;
    if (opponent.y + opponent.height > canvas.height) opponent.y = canvas.height - opponent.height;
}

// Update game state
function update() {
    clearCanvas();
    drawPlayer();
    drawOpponent();
    movePlayer();
    moveOpponent();
    requestAnimationFrame(update);
}

// Event listeners for player controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') player.dx = player.speed;
    if (e.key === 'ArrowLeft') player.dx = -player.speed;
    if (e.key === 'ArrowUp') player.dy = -player.speed;
    if (e.key === 'ArrowDown') player.dy = player.speed;

    if (e.key === 'd') opponent.dx = opponent.speed;
    if (e.key === 'a') opponent.dx = -opponent.speed;
    if (e.key === 'w') opponent.dy = -opponent.speed;
    if (e.key === 's') opponent.dy = opponent.speed;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') player.dx = 0;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') player.dy = 0;

    if (e.key === 'd' || e.key === 'a') opponent.dx = 0;
    if (e.key === 'w' || e.key === 's') opponent.dy = 0;
});

// Start the game
update();
