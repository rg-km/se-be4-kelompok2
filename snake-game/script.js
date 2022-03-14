const CELL_SIZE = 20;
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
const LIFE = 22;

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

function initSnake(life) {
  return {
    color: "#DBDBDB",
    ...initHeadAndBody(),
    direction: initDirection(),
    score: 0,
    level: 1,
    life: life,
    speed: MOVE_INTERVAL,
  };
}

let snake1 = initSnake(3);

let apple1 = {
  position: initPosition(),
};

let apple2 = {
  position: initPosition(),
};

function clearScreen(ctx) {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function drawCell(ctx, x, y, snakeId, cellW = CELL_SIZE, cellH = CELL_SIZE) {
  let img = document.getElementById(snakeId);
  ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, cellW, cellH);
}

function drawCellWithoutCtx(snake, getId, message, value, font) {
  let id;
  if (snake.color == snake1.color) {
    id = document.getElementById(getId);
  }

  let ctx = id.getContext("2d");

  clearScreen(ctx);
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.fillText(
    `${message} : ${value}`,
    id.scrollWidth / 2,
    id.scrollHeight / 2 + 5
  );
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
  drawCell(ctx, apple.position.x, apple.position.y, "apple", CELL_SIZE + 10);
}

function drawScore(snake) {
  drawCellWithoutCtx(snake, "score1Board", "Score", snake.score, "20px Arial");
}

function drawSpeed(snake) {
  drawCellWithoutCtx(snake, "speed-board", "Speed", snake.speed, "15px Arial");
}

function drawLevel(snake) {
  drawCellWithoutCtx(snake, "rank-board", "Level", snake.level, "20px Arial");
}

function drawLife(totalLife) {
  let lifeCanvas = document.getElementById("life-board");
  let ctx = lifeCanvas.getContext("2d");
  let space = CELL_SIZE;
  let img = document.getElementById("life");

  clearScreen(ctx);

  for (let i = 0; i < totalLife; i++) {
    ctx.drawImage(img, space + 45, 20, 20, 20);
    space = space + LIFE;
  }
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

    // 3 life
    drawLife(snake1.life);
    
    drawLevel(snake1); // level
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
  let eatApple = new Audio("./assets/audio/eat-apple.wav");
  let levelUp = new Audio("assets/audio/level-up.mpeg");
  if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
    // make apple doesn't appear inside the body
    if (snake.body.x != apple.position.x && snake.body.y != apple.position.y) {
      apple.position = initPosition();
    }

    snake.score++;
    snake.body.push({ x: snake.head.x, y: snake.head.y });
    eatApple.play(); // play sound when eat

    // check score
    if (snake.score != 0 && snake.score % 5 == 0) {
      // set maksimum level to 5
      if (snake.level == 5) {
        snake.level;
      } else {
        levelUp.play();
        snake.level++;
      }
      snake.speed -= 2; // increase speed
    }
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
  let gameOver = new Audio("assets/audio/game-over.wav");

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
    snake1.life -= 1;

    // check life point
    if (snake1.life == 0) {
      alert("Game over");

      snake1 = initSnake(3);
    } else {
      snake1;
    }
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
