const canvas = document.getElementById('canvas');
const contexto = canvas.getContext('2d');
const points = document.getElementById('points');

// jogador
const player = {
    x: (window.innerWidth - 40) / 2,
    y: window.innerHeight - 40,
    width: 40,
    height: 40,
}

const settings = {
    moveSpd: 4, // jogador vai andar 4px
    spawnDelay: 5000,
    gravity: 1,
}

const spawnState = {
    lastSpawn: 0,
    lastDate: 0,
}

const gameState = {
    points: 0,
}

let objectsArray = [];

// Função para dar start no jogo
function init(){
    resizeCanvas();
    attachEventListeners();
    window.requestAnimationFrame(gameLoop);
}

function attachEventListeners(){
    window.addEventListener('keydown', (e) => {
        if(e.code === "ArrowLeft"){
            // Andar para a esquerda
            movePlayer(-settings.moveSpd);
        }else if(e.code === "ArrowRight"){
            // Andar para a direita
            movePlayer(settings.moveSpd);
        }
    });

    document.getElementById('btn-wrapper').addEventListener('click', (e) => {
        e.target.parentElement.style.display = 'none';
        gameState.isGameStarted = true;
    })
}

// função que renderiza a página a cada alteração
function gameLoop(){
    resizeCanvas();
    resetCanvas();
    drawPlayer();
    spawnObject();
    updateObjectPosition();
    drawObjects();
    checkForCollisions();
  
    window.requestAnimationFrame(gameLoop);
}

// cor de fundo do canvas
function resetCanvas(){
    contexto.fillStyle = "rgb(0, 0, 0)";
    contexto.fillRect(0, 0, canvas.width, canvas.height); // desenhando retângulo preto 
    // contexto.clearRect();
}

function resetGame(){
    player = {
        x: (window.innerWidth - 40) / 2,
        y: window.innerHeight - 40,
        width: 40,
        height: 40,
    }

    spawnState = {
        lastSpawn: 0,
        lastDate: 0,
    }

    gameState = {
        points: 0,
        isGameStarted: false,
    }

    points.innerHTML = '0';

    objectsArray = [];

    document.getElementById('btn-wrapper').style.display = 'block';
    resetCanvas();
    drawPlayer();
}

function movePlayer(val){
    const nextPlayerPosition = player.x + val;
    if(nextPlayerPosition > canvas.width - player.width || nextPlayerPosition < 0){
        return;
    }
    player.x = nextPlayerPosition;
}

function drawPlayer(){
    contexto.fillStyle = "rgb(255, 255, 255)";
    contexto.fillRect(player.x, player.y, player.width, player.height);
}

function spawnObject(){
    if(spawnState.lastSpawn > settings.spawnDelay){
        objectsArray.push({
            id: new Date().getTime(),
            x: Math.floor(Math.random() * (canvas.width - 40)),
            y: 0,
            width: 40,
            height: 40,
        });
        console.log('Spawn');
        spawnState.lastSpawn = 0;
    }
    const now = new Date().getTime(); // retorna a hora atual em milisegundos
    spawnState.lastSpawn += now - spawnState.lastDate;
    spawnState.lastDate = now;
}

function updateObjectPosition(){
    objectsArray.forEach(object => {
        object.y += settings.gravity;
    });

    // removendo o objeto
    objectsArray = objectsArray.filter(object => object.y < canvas.height); 
}

function checkForCollisions(){
    objectsArray.forEach(object => {
        if(
            object.x < player.x + player.width &&
            object.x + object.width > player.x &&
            object.y < player.y + player.height &&
            object.y + object.height > player.y 
            ){
            
                objectsArray = objectsArray.filter(obj => obj.id !== object.id );
                gameState.points++;
                points.innerHTML = gameState.points;
            }
    });
}

function drawObjects(){ // desenhando todos os objetos
    objectsArray.forEach(object => {
        contexto.fillStyle = "rgb(0, 0, 200)";
        contexto.fillRect(object.x, object.y, object.width, object.height);
    });

}

// função que altera a largura e altura do canvas
function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

init();