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
const SPACE_OBSTACLE = 22;

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

let heart1 = {
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

function drawHeart(ctx, heart) {
  drawCell(ctx, heart.position.x, heart.position.y, "heart");
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

function checkPrime(num) {
  let increment = 0;

  for (let i = 1; i <= num; i++) {
    if (num % i == 0) {
      increment++;
    }
  }
  return increment == 2 ? true : false;
}

function drawWall(ctx, wall) {
  let wl = document.getElementById("wall");
  ctx.drawImage(wl, wall.position.x, wall.position.y , 300, 20);
}

function drawObstacle(ctx, level) {
  ctx.color = 'black';

  switch (level) {
    case 2:
      for (let i=5; i<=25; i++) {
        for (let j=15; j<=15; j++) {
          ctx.fillRect(i * CELL_SIZE, CELL_SIZE*j, CELL_SIZE, CELL_SIZE);
        }
      }
    
      if (snake1.head.x >= 5 && snake1.head.x <= 25 &&
        snake1.head.y >= 15 && snake1.head.y <= 15) {
          dead();
      }
      break;
    case 3:
      for (let i=5; i<=25; i++) {
        for (let j=10; j<=10; j++) {
          ctx.fillRect(i * CELL_SIZE, CELL_SIZE*j, CELL_SIZE, CELL_SIZE);
        }
      }
    
      if (snake1.head.x >= 5 && snake1.head.x <= 25 &&
        snake1.head.y >= 10 && snake1.head.y <= 10) {
          dead();
      }
    
      for (let i=5; i<=25; i++) {
        for (let j=20; j<=20; j++) {
          ctx.fillRect(i * CELL_SIZE, CELL_SIZE*j, CELL_SIZE, CELL_SIZE);
        }
      }
    
      if (snake1.head.x >= 5 && snake1.head.x <= 25 &&
        snake1.head.y >= 20 && snake1.head.y <= 20) {
          dead();
      }
      break;
    case 4:
      for (let i=5; i<=25; i++) {
        for (let j=10; j<=10; j++) {
          ctx.fillRect(i * CELL_SIZE, CELL_SIZE*j, CELL_SIZE, CELL_SIZE);
        }
      }
    
      if (snake1.head.x >= 5 && snake1.head.x <= 25 &&
        snake1.head.y >= 10 && snake1.head.y <= 10) {
          dead();
      }
    
      for (let i=5; i<=25; i++) {
        for (let j=15; j<=15; j++) {
          ctx.fillRect(i * CELL_SIZE, CELL_SIZE*j, CELL_SIZE, CELL_SIZE);
        }
      }
    
      if (snake1.head.x >= 5 && snake1.head.x <= 25 &&
        snake1.head.y >= 15 && snake1.head.y <= 15) {
          dead();
      }
    
      for (let i=5; i<=25; i++) {
        for (let j=20; j<=20; j++) {
          ctx.fillRect(i * CELL_SIZE, CELL_SIZE*j, CELL_SIZE, CELL_SIZE);
        }
      }
    
      if (snake1.head.x >= 5 && snake1.head.x <= 25 &&
        snake1.head.y >= 20 && snake1.head.y <= 20) {
          dead();
      }
      break;
    case 5:
      ctx.fillRect(WIDTH*16, HEIGHT*5 , 20, 300);
      ctx.fillRect(WIDTH*3, HEIGHT*5 , 20, 300);

      if (snake1.head.x >= 16 && snake1.head.x <= WIDTH*16 &&
        snake1.head.y >= 20 && snake1.head.y <= 20) {

      }
      break;
  }
}

function dead() {
  let lastScore = snake1.score;
  let lastLevel = snake1.level;

  if (snake1.life <= 0) {
    alert("Game over, play again?");
    snake1 = initSnake("#DBDBDB");
    snake1.score = 0;
    snake1.level = 1;
    snake1.life = 3;
    MOVE_INTERVAL = 100;
    initGame();
    drawLevel(snake1.level);
  } else {
    snake1 = initSnake("#DBDBDB");
    snake1.score = lastScore;
    snake1.level = lastLevel;
    snake1.life -= 1;
    move(snake1);
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

    // heart
    if (checkPrime(snake1.score)) {
      drawHeart(ctx, heart1);
    }

    // 3 life
    drawLife(snake1.life);
    
    drawLevel(snake1); // level
    drawScore(snake1); // score
    drawSpeed(snake1); // speed
    //obstacle
    drawObstacle(ctx, snake1.level);
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

function eat(snake, apple, heart) {
  let eatApple = new Audio("./assets/audio/eat-apple.wav");

  let levelUp = new Audio("./assets/audio/level-up.mpeg");

  // check when snake head hit the apple
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

  // check when snake head hit the heart
  if (snake.head.x == heart.position.x && snake.head.y == heart.position.y) {
    if (snake.body.x != heart.position.x && snake.body.y != heart.position.y) {
      heart.position = initPosition();
    }

    // check snake life
    if (snake.life === 3) {
      snake.life;
      snake.score++;
    } else {
      snake.life++;
      snake.score++;
    }
  }
}

function moveLeft(snake) {
  snake.head.x--;
  teleport(snake);
  eat(snake, apple1, heart1);
  eat(snake, apple2, heart1);
}

function moveRight(snake) {
  snake.head.x++;
  teleport(snake);
  eat(snake, apple1, heart1);
  eat(snake, apple2, heart1);
}

function moveDown(snake) {
  snake.head.y++;
  teleport(snake);
  eat(snake, apple1, heart1);
  eat(snake, apple2, heart1);
}

function moveUp(snake) {
  snake.head.y--;
  teleport(snake);
  eat(snake, apple1, heart1);
  eat(snake, apple2, heart1);
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
