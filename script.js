//Elementos del Html 
const world = document.getElementById('world');
const scoreBoard = document.getElementById('scoreboard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameover');

//Configuracion de juego
const worldsize = 10;
const gamespeed = 200;
const squaretypes= {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2,
}
const directions={
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1,
}

//variables 

let snake;
let score;
let direction;
let worldSquares;
let emptySquares;
let moveInterval;

const drawSnake = () => {
    snake.forEach( square => drawSquare(square, 'snakeSquare'));
}


const drawSquare = (square,type) => {
    const [ row, column ] = square.split('');
    worldSquares [row][column] = squaretypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class',`square ${type}`);

    if(type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        if(emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }

    }

}

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction])
        .padStart(2, '0');
    const [row,column] = newSquare.split('');


    if( newSquare < 0 || 
        newSquare > worldsize * worldsize  ||
        (direction === 'ArrowRight' && column == 0) ||
        (direction === 'ArrowLeft' && column == 9 ||
        worldSquares[row][column] === squaretypes.snakeSquare) ) {
        gameOver();
    } else {
        snake.push(newSquare);
        if(worldSquares[row][column] === squaretypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
}

const addFood = () =>{
    score++;
    updateScore();
    createRandomFood();
}

const gameOver = () => {
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval)
    startButton.disabled = false;
}
    
const setDirection = newDirection =>{
    direction = newDirection;
}

const directionEvent = key =>{
    switch (key.code){
        case 'ArrowUp':
            direction !='ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)
            break;
    }
    
}

const createRandomFood= () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random()*emptySquares.length)];
    drawSquare(randomEmptySquare,'foodSquare');
}

const updateScore = () => {
     scoreBoard.innerText =score;
}

const createworld = () => {
    worldSquares.forEach( (row,rowIndex) => {
       row.forEach( (column, columnndex) => {
        const squarevalue =  `${rowIndex}${columnndex}`;
        const squareelement = document.createElement('div');
        squareelement.setAttribute('class','square emptySquare');
        squareelement.setAttribute('id',squarevalue);
        world.appendChild(squareelement);
        emptySquares.push(squarevalue);

       })
    })
}




const setGame = () =>{
    snake = ['00','01','02','03'];
    score = snake.length;
    direction = 'ArrowRight';
    worldSquares = Array.from(Array(worldsize), () => new Array(worldsize).fill(squaretypes.emptySquares));
    console.log(worldSquares)
    world.innerHTML ='';
    emptySquares = [];
    createworld();
}

const startGame = () =>{
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener('keydown',directionEvent);
    moveInterval = setInterval( () => moveSnake(),gamespeed);
}

startButton.addEventListener('click', startGame);