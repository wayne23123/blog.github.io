const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
//getContext() method會回傳一個canvas的drawing context
//drawing context可以用來在canvas畫圖
const unit = 20;
const row = canvas.height / unit;
//320 / 20 = 16
const column = canvas.width / unit;
//320 / 20 = 16

let snake = []; //array中的每個元素,都是一個物件
function createSnake() {
  //物件儲存身體的x,y座標
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

//做果實做一個物件
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  newLocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}
// 做初始的蛇
createSnake();
let myFruit = new Fruit();

// 蛇改方向
window.addEventListener("keydown", changeDirection);
let direction = "Right";
function changeDirection(e) {
  // console.log(e);
  if (e.key == "ArrowRight" && direction != "Left") {
    // console.log("你正在按向右鍵");
    direction = "Right";
  } else if (e.key == "ArrowDown" && direction != "Up") {
    // console.log("你正在按向下鍵");
    direction = "Down";
  } else if (e.key == "ArrowLeft" && direction != "Right") {
    // console.log("你正在按向左鍵");
    direction = "Left";
  } else if (e.key == "ArrowUp" && direction != "Down") {
    // console.log("你正在按向上鍵");
    direction = "Up";
  }

  // 不讓方向180度快速切換,每次按下上下左右後,在下一幀書出來之前,不接受任何keydown事件
  window.removeEventListener("keydown", changeDirection);
}

let highestScore;
loadHighestScore();
let score = 0;

document.getElementById("myScore").innerHTML = "遊戲分數:" + score;
document.getElementById("myScore2").innerHTML = "最高分數:" + highestScore;

function draw() {
  //每次畫圖之前，確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      // console.log("撞到自己了");
      clearInterval(myGame);
      alert("遊戲結束");
    }
  }
  // 背景全設定為黑色
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  console.log("正在執行畫蛇draw");

  // 弄完class後畫出果實
  myFruit.drawFruit();
  // 劃出蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";
    //   ctx.fillStyle = "lightblue";

    //-----------------------------------------------------------------------------------------------------------
    // 劃出蛇之前先把座標更正
    // x >= width  --> x = 0
    // x < 0       --> x = width - unit
    // y >= height --> y = 0
    // y < 0       --> y = height - unit

    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }

    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }

    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }

    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    //-----------------------------------------------------------------------------------------------------------

    // 設定接下來要填滿的是甚麼
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    // 畫實心的長方形x, y, width, height
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  //以目前的direction變數方向來決定蛇下一數幀數放在哪個座標
  let snakeX = snake[0].x; //snake[0]是一個物件,但snakeX是個number
  let snakeY = snake[0].y;
  if (direction == "Left") {
    snakeX -= unit;
  } else if (direction == "Up") {
    snakeY -= unit;
  } else if (direction == "Right") {
    snakeX += unit;
  } else if (direction == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // 確認蛇是否吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.newLocation();
    score++;
    setHighScore(score);
    document.getElementById("myScore").innerHTML = "遊戲分數:" + score;
    document.getElementById("myScore2").innerHTML = "最高分數:" + highestScore;
    // 重新定義一個新的隨機位置
    //劃出新果實
    //更新分數
    console.log("吃到果實了");
  } else {
    snake.pop();
  }
  // snake.pop();
  // console.log(snake.length);
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

// Window setInterval()
let myGame = setInterval(draw, 100);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
