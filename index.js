
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const levelInput = document.getElementById('levelInput');
const setLevelButton = document.getElementById('setLevel');
const gameOverModal = document.getElementById('gameOverModal');
const restartGameButton = document.getElementById('restartGame');
const snakeSize = 20;
let snake = [{x: 160, y: 160}];
let direction = 'right';
let food = {x: 0, y: 0};
let score = 0;
let level = 1;
let speed = 200;
let gameInterval;

// Function to generate random food position
function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
    food.y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
}

// Function to draw the snake
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        const part = snake[i];
        ctx.fillStyle = `hsl(${i * 10}, 100%, 50%)`;
        ctx.fillRect(part.x, part.y, snakeSize, snakeSize);
    }
}

// Function to draw the food
function drawFood() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(food.x + snakeSize / 2, food.y + snakeSize / 2, snakeSize / 2, 0, Math.PI * 2);
    ctx.fill();
}

// Function to move the snake
function moveSnake() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'right':
            head.x += snakeSize;
            break;
        case 'left':
            head.x -= snakeSize;
            break;
        case 'up':
            head.y -= snakeSize;
            break;
        case 'down':
            head.y += snakeSize;
            break;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

// Function to check for collisions
function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        showGameOver();
        return true;
    }
    for (let i = 4; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            showGameOver();
            return true;
        }
    }
    return false;
}

// Function to update the game state
function updateGame() {
    if (checkCollision()) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();
}

// Function to handle keyboard input
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
    }
});

// Function to handle button input
document.querySelector('.up').addEventListener('click', () => {
    if (direction !== 'down') direction = 'up';
});
document.querySelector('.left').addEventListener('click', () => {
    if (direction !== 'right') direction = 'left';
});
document.querySelector('.right').addEventListener('click', () => {
    if (direction !== 'left') direction = 'right';
});
document.querySelector('.down').addEventListener('click', () => {
    if (direction !== 'up') direction = 'down';
});

// Function to start the game
function startGame() {
    speed = 200 - (level - 1) * 30;
    levelDisplay.textContent = level;
    snake = [{x: 160, y: 160}];
    direction = 'right';
    score = 0;
    scoreDisplay.textContent = score;
    generateFood();
    gameInterval = setInterval(updateGame, speed);
}

// Function to show the game over modal
function showGameOver() {
    clearInterval(gameInterval);
    gameOverModal.style.display = 'flex';
}

// Function to restart the game
restartGameButton.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    startGame();
});

// Set level and restart game
setLevelButton.addEventListener('click', () => {
    level = Math.min(Math.max(parseInt(levelInput.value), 1), 6);
    speed = 200 - (level - 1) * 30;
    levelDisplay.textContent = level;
    snake = [{x: 160, y: 160}];
    direction = 'right';
    score = 0;
    scoreDisplay.textContent = score;
    generateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, speed);
});

canvas.width = 400;
canvas.height = 400;
startGame();
