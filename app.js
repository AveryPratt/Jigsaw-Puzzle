'use strict';

// DOM variables
var style = document.createElement('style');
style.type = 'text/css';

var nav = document.getElementById('nav');
var gameForm = document.getElementById('gameForm');
var playerNameInputEl = document.getElementById('playerName');
var canvasEl = document.getElementById('canvas');
var ctx = canvasEl.getContext('2d');

// global variables
var nameReplayInputEl;
var nameReplayLabelEl;
var saveName;
var currentPiece = null;
var currentDropPiece = null;
var currentPieceLocation = null;
var currentDropPieceLocation = null;
var xDimension = 2;
var yDimension = 2;
var count = 0;
var minCount;
var stopWatch = new GameTimer(nav);
var mouse = {
  x: 0,
  y: 0
};
var pieces = [];
var gameArray = [];
var currentScore;

//adapted from http://jsbin.com/xayezotalo/edit?html,js,output
function GameTimer(elem, options) {
  var timer = createTimer(),
    offset,
    clock,
    interval;

  options = options || {};
  options.delay = options.delay || 1;

  elem.appendChild(timer);

  reset();

  function createTimer() {
    var timerDomElJS = document.createElement('span');
    timerDomElJS.setAttribute('id', 'timerDomEl');
    return timerDomElJS;
  }

  function start() {
    if (!interval) {
      offset = Date.now();
      interval = setInterval(update, options.delay);
    }
  }

  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function reset() {
    clock = 0;
    render(0);
  }

  function update() {
    clock += delta();
    render();
  }

  function render() {
    timer.innerHTML = clock / 1000;
  }

  function delta() {
    var now = Date.now(),
      d = now - offset;

    offset = now;
    return d;
  }

  this.start = start;
  this.stop = stop;
  this.reset = reset;
};

// constructors
function Piece(source) {
  this.img = new Image();
  this.img.src = source;
  this.img.setAttribute('style', 'border: 1px solid #000000;');
  this.yPieceIndex = source.slice(14, 15);
  this.xPieceIndex = source.slice(16, 17);
};

function ArrayLocation(yLocationIndex, xLocationIndex) {
  this.yLocationIndex = yLocationIndex;
  this.xLocationIndex = xLocationIndex;
}

function Score(name, time){
  this.name = name;
  this.time = time;
}

// functions
function comparePieces(piece1, piece2){
  if(piece1.xPieceIndex === piece2.xPieceIndex && piece1.yPieceIndex === piece2.yPieceIndex){
    return true;
  } else {
    return false;
  }
}

function generateRandLocation(minY, maxY, minX, maxX) {
  var randY = Math.round(Math.random(minY, maxY));
  var randX = Math.round(Math.random(minX, maxX));
  return new ArrayLocation(randY, randX);
}

function generateNewLocation(locationsUsed, yIndex, xIndex) {
  var currentLocation = generateRandLocation(0, yDimension, 0, xDimension);
  if (checkUsedLocations(currentLocation, locationsUsed)) {
    if (checkCurrentLocation(currentLocation, yIndex, xIndex)) {
      return currentLocation;
    }
  }
  return generateNewLocation(locationsUsed, yIndex, xIndex);
}

function checkUsedLocations(currentLocation, locationsUsed) {
  for (var i = 0; i < locationsUsed.length; i++) {
    if (currentLocation.yLocationIndex === locationsUsed[i].yLocationIndex && currentLocation.xLocationIndex === locationsUsed[i].xLocationIndex) {
      return false;
    }
  }
  return true;
}

function checkCurrentLocation(currentLocation, yIndex, xIndex) {
  if (yIndex === yDimension - 1 && xIndex === xDimension - 1) {
    return true;
  }
  if (currentLocation.xLocationIndex === xIndex && currentLocation.yLocationIndex === yIndex) {
    return false;
  } else return true;
}

function populatePieces() {
  var locationsUsed = [];
  for (var i = 0; i < yDimension; i++) {
    pieces[i] = [];
    for (var j = 0; j < xDimension; j++) {
      var myLocation = generateNewLocation(locationsUsed, i, j);
      pieces[i][j] = new Piece('img/easy/logo-' + myLocation.yLocationIndex + '-' + myLocation.xLocationIndex + '.png');
      locationsUsed.push(myLocation);
    }
  }
}

function drawCanvas() {
  for (var i = 0; i < pieces.length; i++) {
    for (var j = 0; j < pieces[i].length; j++) {
      ctx.drawImage(pieces[i][j].img, j * (canvasEl.width / xDimension), i * (canvasEl.height / yDimension), canvasEl.width / xDimension, canvasEl.height / yDimension);
      ctx.strokeRect(j * (canvasEl.width / xDimension), i * (canvasEl.height / yDimension), canvasEl.width / xDimension, canvasEl.height / yDimension);
    }
  }
}

function checkFinished() {
  var isFinished = true;
  for (var i = 0; i < pieces.length; i++) {
    for (var j = 0; j < pieces[i].length; j++) {
      if (parseInt(pieces[i][j].yPieceIndex) === i && parseInt(pieces[i][j].xPieceIndex) === j) {
        continue;
      } else {
        isFinished = false;
      }
    }
  }
  return isFinished;
}

function getMousePosition(event) {
  mouse.x = event.layerX;
  mouse.y = event.layerY;
}

function swapPieces(currentPiece, currentDropPiece) {
  var temp = currentPiece;
  pieces[currentPieceLocation.yLocationIndex][currentPieceLocation.xLocationIndex] = currentDropPiece;
  pieces[currentDropPieceLocation.yLocationIndex][currentDropPieceLocation.xLocationIndex] = temp;
  drawCanvas();
  count += 1;
  if (checkFinished()) {
    endGame(true);
  } else if (count >= minCount) {
    endGame(false);
  }
}

function findMinimumMoves() {
  var areas = [];
  for (var i = 0; i < pieces.length; i++) { // i = y index
    for (var j = 0; j < pieces[i].length; j++) { // j = x index
      if (checkLocationsInAreas(areas, pieces[i][j]) === false) {
        var currentArea = generateArea([], pieces[i][j]);
        areas.push(currentArea);
      }
    }
  }
  return xDimension * yDimension - areas.length;
}

function checkLocationsInAreas(areas, piece) {
  for (var i = 0; i < areas.length; i++) {
    for (var j = 0; j < areas[i].length; j++) {
      if (areas[i][j].xPieceIndex === piece.xPieceIndex && areas[i][j].yPieceIndex === piece.yPieceIndex) {
        return true;
      }
    }
  }
  return false;
}

function generateArea(pieceArr, piece, firstPiece) {
  if (!firstPiece) {
    firstPiece = piece;
    pieceArr.push(piece);
  } else if (firstPiece.yPieceIndex === piece.yPieceIndex && firstPiece.xPieceIndex === piece.xPieceIndex) {
    return pieceArr;
  } else {
    pieceArr.push(piece);
  }
  var newPiece = pieces[piece.yPieceIndex][piece.xPieceIndex];
  return generateArea(pieceArr, newPiece, firstPiece);
}

function endGame(won) {
  stopWatch.stop();
  var myTime = document.getElementById('timerDomEl').textContent;
  if (won) {
    console.log('You won!');
    gameForm.textContent = 'Congratulations ' + playerNameInputEl.value + ', you won! It took you ' + myTime + ' seconds to complete!';
    currentScore = new Score(playerNameInputEl.value, myTime);
    gameArray.push(currentScore);
    var gameArrayStringified = JSON.stringify(gameArray);
    localStorage.setItem('gameArrayEl', gameArrayStringified);
  } else {
    console.log('You lost!');
    gameForm.textContent = 'Congratulations ' + playerNameInputEl.value + ', you lost! It took you ' + myTime + ' seconds to fail!';
  }
  nameReplayLabelEl = document.createElement('label');
  nameReplayLabelEl.setAttribute('for', 'name');
  nameReplayLabelEl.textContent = ' Name: ';
  nameReplayInputEl = document.createElement('input');
  gameForm.appendChild(nameReplayLabelEl);
  nameReplayInputEl.setAttribute('name', 'name');
  nameReplayInputEl.setAttribute('type', 'text');
  nameReplayInputEl.setAttribute('id', 'playerName');
  nameReplayInputEl.value = playerNameInputEl.value;
  gameForm.appendChild(nameReplayInputEl);
  var playAgainBtn = document.createElement('button');
  playAgainBtn.textContent = 'Play Again?';
  var playAgainATag = document.createElement('a');
  gameForm.removeEventListener('submit', handleStartButtonClick);
  playAgainATag.setAttribute('href', 'index.html');
  gameForm.appendChild(playAgainATag);
  playAgainATag.appendChild(playAgainBtn);
  playAgainBtn.addEventListener('click', handleReplayButtonClick);
}

// event handlers
function handleReplayButtonClick(event){
  saveName = JSON.stringify(nameReplayInputEl.value);
  localStorage.setItem('saveNameLS', saveName);
  sessionStorage.setItem('reloaded', true);
  playAgainBtn.addEventListener('click', handleStartButtonClick);
}

function handleStartButtonClick(event) {
  event.preventDefault();
  populatePieces();
  minCount = findMinimumMoves();
  drawCanvas();
  stopWatch.reset();
  stopWatch.start();
  gameForm.removeEventListener('submit', handleStartButtonClick);
}

function startButtonfromReplay(){
  populatePieces();
  minCount = findMinimumMoves();
  drawCanvas();
  stopWatch.reset();
  stopWatch.start();
  gameForm.removeEventListener('submit', handleStartButtonClick);
}


function handleCanvasMousedown(event) {
  getMousePosition(event);
  var xValue = mouse.x / (canvasEl.width / xDimension);
  var yValue = mouse.y / (canvasEl.height / yDimension);
  currentPieceLocation = new ArrayLocation(Math.floor(yValue), Math.floor(xValue));
  currentPiece = pieces[Math.floor(yValue)][Math.floor(xValue)];
  style.innerHTML = '* {cursor: url(' + currentPiece.img.src + ') 64 64, auto;}';
  document.getElementsByTagName('head')[0].appendChild(style);
  console.log('mouse is clicked');
}

function handleMouseup(event) {
  console.log('mouse is released');
  if (event.target === canvasEl) {
    console.log(currentPiece, 'current piece');
    getMousePosition(event);
    var xValue = mouse.x / (canvasEl.width / xDimension);
    var yValue = mouse.y / (canvasEl.height / yDimension);
    currentDropPieceLocation = new ArrayLocation(Math.floor(yValue), Math.floor(xValue));
    currentDropPiece = pieces[Math.floor(yValue)][Math.floor(xValue)];
    console.log(currentDropPiece, 'drop piece');
    if(!comparePieces(currentPiece, currentDropPiece)) {
      swapPieces(currentPiece, currentDropPiece);
    }
  }
  currentPiece = null;
  currentDropPiece = null;
  currentPieceLocation = null;
  currentDropPieceLocation = null;
  style.innerHTML = '* {cursor: initial;}';
  document.getElementsByTagName('head')[0].appendChild(style);
}

gameForm.addEventListener('submit', handleStartButtonClick);
canvasEl.addEventListener('mousedown', handleCanvasMousedown);
window.addEventListener('mouseup', handleMouseup);

// iifes
(function checkLocalStorage(){
  if (localStorage.getItem('gameArrayEl')) {
    var loadOldGames = localStorage.getItem('gameArrayEl');
    var newGameArray = JSON.parse(loadOldGames);
    console.log('newGameArray: ', newGameArray);
    gameArray = newGameArray;
  } else {
    console.log('nothing found in localStorage');
  }
}());

(function checkSessionStorage(){
  if (sessionStorage.getItem('reloaded') === 'true') {
    var savedName = localStorage.getItem('saveNameLS');
    document.getElementById('playerName').value = JSON.parse(savedName);
    startButtonfromReplay();
    sessionStorage.setItem('reloaded', false);
  }
}());
