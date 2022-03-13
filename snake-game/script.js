const CELL_SIZE = 20;
// 1. board game
const CANVAS_SIZE = 400;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};
const MOVE_INTERVAL = 100;

function initPosition() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  };
}

function initHeadAndBody() {
  let head = initPosition();
  let body = [{ x: head.x, y: head.y }];
  return {
    head: head,
    body: body,
  };
}

function initDirection() {
  return Math.floor(Math.random() * 4);
}

function initSnake(color) {
  return {
    color: color,
    ...initHeadAndBody(),
    direction: initDirection(),
    score: 0,
    level: 1,
    speed: MOVE_INTERVAL,
  };
}
let snake1 = initSnake("#DBDBDB");

let apple1 = {
  position: initPosition(),
};

let apple2 = {
  position: initPosition(),
};

function clearScreen(ctx) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function drawCell(ctx, x, y, snakeId) {
  let img = document.getElementById(snakeId);
  ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawSnake(ctx, snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      drawCell(ctx, snake.head.x, snake.head.y, "snake-head-left");
      break;
    case DIRECTION.RIGHT:
      drawCell(ctx, snake.head.x, snake.head.y, "snake-head-right");
      break;
    case DIRECTION.DOWN:
      drawCell(ctx, snake.head.x, snake.head.y, "snake-head-down");
      break;
    case DIRECTION.UP:
      drawCell(ctx, snake.head.x, snake.head.y, "snake-head-top");
      break;
  }

  for (let i = 1; i < snake.body.length; i++) {
    let part = snake.body[i];
    drawCell(ctx, part.x, part.y, "snake-body");
  }
}

function drawApple(ctx, apple) {
  let img = document.getElementById("apple");

  ctx.drawImage(
    img,
    apple.position.x * CELL_SIZE,
    apple.position.y * CELL_SIZE,
    CELL_SIZE + 10,
    CELL_SIZE
  );
}

function drawScore(snake) {
  let scoreCanvas;
  if (snake.color == snake1.color) {
    scoreCanvas = document.getElementById("score1Board");
  }

  let scoreCtx = scoreCanvas.getContext("2d");

  clearScreen(scoreCtx);
  scoreCtx.font = "20px Arial";
  scoreCtx.textAlign = "center";
  scoreCtx.fillText(
    "Score : " + snake.score,
    scoreCanvas.scrollWidth / 2,
    scoreCanvas.scrollHeight / 2 + 5
  );
}

function drawSpeed(snake) {
  let speedCanvas;
  if (snake.color == snake1.color) {
    speedCanvas = document.getElementById("speed-board");
  }

  let ctx = speedCanvas.getContext("2d");

  clearScreen(ctx);
  ctx.font = "15px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    "Speed : " + snake.speed,
    speedCanvas.scrollWidth / 2,
    speedCanvas.scrollHeight / 2 + 5
  );
}

function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    clearScreen(ctx);

    // snake 1
    drawSnake(ctx, snake1);

    // apple 1
    drawApple(ctx, apple1);

    // apple 2
    drawApple(ctx, apple2);

    drawScore(snake1); // score
    drawSpeed(snake1); // speed
  }, REDRAW_INTERVAL);
}

function teleport(snake) {
  if (snake.head.x < 0) {
    snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.x >= WIDTH) {
    snake.head.x = 0;
  }
  if (snake.head.y < 0) {
    snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.y >= HEIGHT) {
    snake.head.y = 0;
  }
}

function eat(snake, apple) {
  var snakeEat = new Audio("./assets/audio/eat-apple.wav");
  if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
    apple.position = initPosition();
    snake.score++;
    snake.body.push({ x: snake.head.x, y: snake.head.y });
    snakeEat.play(); // play sound when eat
    snake.speed -= 2; // increase speed
  }
}

function moveLeft(snake) {
  snake.head.x--;
  teleport(snake);
  eat(snake, apple1);
  eat(snake, apple2);
}

function moveRight(snake) {
  snake.head.x++;
  teleport(snake);
  eat(snake, apple1);
  eat(snake, apple2);
}

function moveDown(snake) {
  snake.head.y++;
  teleport(snake);
  eat(snake, apple1);
  eat(snake, apple2);
}

function moveUp(snake) {
  snake.head.y--;
  teleport(snake);
  eat(snake, apple1);
  eat(snake, apple2);
}

function checkCollision(snakes) {
  let isCollide = false;
  let gameOver = new Audio();
  gameOver.src = "assets/audio/game-over.wav";

  for (let i = 0; i < snakes.length; i++) {
    for (let j = 0; j < snakes.length; j++) {
      for (let k = 1; k < snakes[j].body.length; k++) {
        if (
          snakes[i].head.x == snakes[j].body[k].x &&
          snakes[i].head.y == snakes[j].body[k].y
        ) {
          isCollide = true;
        }
      }
    }
  }

  if (isCollide) {
    gameOver.play();
    alert("Game over");

    snake1 = initSnake("#DBDBDB");
  }

  return isCollide;
}

function move(snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      moveLeft(snake);
      break;
    case DIRECTION.RIGHT:
      moveRight(snake);
      break;
    case DIRECTION.DOWN:
      moveDown(snake);
      break;
    case DIRECTION.UP:
      moveUp(snake);
      break;
  }
  moveBody(snake);
  if (!checkCollision([snake1])) {
    setTimeout(function () {
      move(snake);
    }, snake.speed);
  } else {
    initGame();
  }
}

function moveBody(snake) {
  snake.body.unshift({ x: snake.head.x, y: snake.head.y });
  snake.body.pop();
}

function turn(snake, direction) {
  const oppositeDirections = {
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.DOWN]: DIRECTION.UP,
    [DIRECTION.UP]: DIRECTION.DOWN,
  };

  if (direction !== oppositeDirections[snake.direction]) {
    snake.direction = direction;
  }
}

document.addEventListener("keydown", function (event) {
  // player 1
  if (event.key === "a") {
    turn(snake1, DIRECTION.LEFT);
  } else if (event.key === "d") {
    turn(snake1, DIRECTION.RIGHT);
  } else if (event.key === "w") {
    turn(snake1, DIRECTION.UP);
  } else if (event.key === "s") {
    turn(snake1, DIRECTION.DOWN);
  }
});

function initGame() {
  move(snake1);
}

initGame();
