'use strict';

// global variables
var count = 0;
var mincount;
var timer = 0;
var mouse = {
  x: 0,
  y: 0
};
var currentPiece;
var currentDropPiece;
var currentPieceLocation;
var currentDropPieceLocation;
var xDimension = 2;
var yDimension = 2;
var pieces = [];
var imageSelected;
var timerStringified;
var gameArray = [];

// DOM variables
var style = document.createElement('style');
var elems;
var gameForm = document.getElementById('gameForm');
var playerNameInputEl = document.getElementById('playerName');
var canvasEl = document.getElementById('canvas');
var ctx = canvasEl.getContext('2d');

//adapted from http://jsbin.com/xayezotalo/edit?html,js,output
var GameTimer = function(elem, options) {
  var timer = createTimer(),
    offset,
    clock,
    interval;

  options = options || {};
  options.delay = options.delay || 1;

  elem.appendChild(timer);

  reset();

  function createTimer() {
    var timerDOMELJS = document.createElement('span');
    timerDOMELJS.setAttribute('id', 'timerDOMEL');
    return timerDOMELJS;
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

//check localStorage
if (localStorage.getItem('gameArrayEl')) {
  var loadOldGames = localStorage.getItem('gameArrayEl');
  var newGameArray = JSON.parse(loadOldGames);
  console.log('newGameArray: ', newGameArray);
  gameArray = newGameArray;
} else {
  console.log('nothing found in localStorage');
};

//check sessionStorage
if (sessionStorage.getItem('reloaded') === 'true') {
  var savedName = localStorage.getItem('saveNameLS')
  document.getElementById('playerName').value = JSON.parse(savedName);
  sessionStorage.setItem('reloaded', false);
}
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

// functions
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
  // console.log('failed: (' + yIndex + '-' + xIndex + '): ' + currentLocation.yLocationIndex + '-' + currentLocation.xLocationIndex);
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
  if (yIndex === yDimension - 1 && xIndex === xDimension - 1) { // this statement is necessary to avoid last position having no valid options
    return true;
  }
  if (currentLocation.xLocationIndex === xIndex && currentLocation.yLocationIndex === yIndex) {
    return false;
  } else return true;
}

function populatePieces() {
  var locationsUsed = [];
  for (var i = 0; i < yDimension; i++) { // i = y index
    pieces[i] = [];
    for (var j = 0; j < xDimension; j++) { // j = x index
      var myLocation = generateNewLocation(locationsUsed, i, j);
      // console.log('Piece: (' + i + '-' + j + ') = ' + myLocation.yLocationIndex + '-' + myLocation.xLocationIndex);
      pieces[i][j] = new Piece('img/easy/logo-' + myLocation.yLocationIndex + '-' + myLocation.xLocationIndex + '.png');
      locationsUsed.push(myLocation);
    }
  }
}

function drawCanvas() {
  for (var i = 0; i < pieces.length; i++) { // i = y index
    for (var j = 0; j < pieces[i].length; j++) { // j = x index
      ctx.drawImage(pieces[i][j].img, j * (canvas.width / xDimension), i * (canvas.height / yDimension), canvas.width / xDimension, canvas.height / yDimension);
      ctx.strokeRect(j * (canvas.width / xDimension), i * (canvas.height / yDimension), canvas.width / xDimension, canvas.height / yDimension);
    }
  }
  // console.log('pieces: ', pieces);
}

function checkFinished() {
  var isFinished = true;
  for (var i = 0; i < pieces.length; i++) { // i = y index
    for (var j = 0; j < pieces[i].length; j++) { // j = x index
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
  // console.log('swapPieces');
  var temp = currentPiece;
  pieces[currentPieceLocation.yLocationIndex][currentPieceLocation.xLocationIndex] = currentDropPiece;
  pieces[currentDropPieceLocation.yLocationIndex][currentDropPieceLocation.xLocationIndex] = temp;
  drawCanvas();
  count += 1;
  if (count >= mincount) {
    if(checkFinished){
      endGame(true);
    } else {
      endGame(false);
    }
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
  console.log('checkLocationsInAreas', areas, piece);
  for (var i = 0; i < areas.length; i++) {
    for (var j = 0; j < areas[i].length; j++) {
      console.log(`areas[${i}][${j}]:`, areas[i][j]);
      if (areas[i][j].xPieceIndex === piece.xPieceIndex && areas[i][j].yPieceIndex === piece.yPieceIndex) {
        console.log('checkLocationsInAreas found matching indices');
        return true;
      }
    }
  }
  return false;
}

function generateArea(pieceArr, piece, firstPiece) {
  if (!firstPiece) {
    // if first call
    firstPiece = piece;
    pieceArr.push(piece);
  } else if (firstPiece.yPieceIndex === piece.yPieceIndex && firstPiece.xPieceIndex === piece.xPieceIndex) {
    // if solved
    return pieceArr;
  } else {
    // gets new piece at old piece's target location
    pieceArr.push(piece);
  }
  var newPiece = pieces[piece.yPieceIndex][piece.xPieceIndex];
  return generateArea(pieceArr, newPiece, firstPiece);
}

function endGame(won) {
  if (won) {
    console.log('You won!');
    timer = document.getElementById('timerDOMEL').textContent;
    var timerStringified = JSON.stringify(timer);
    gameArray.push(timer);
    localStorage.setItem('timerLSEl', timerStringified);
    var gameArrayStringified = JSON.stringify(gameArray);
    localStorage.setItem('gameArrayEl', gameArrayStringified);
    var clearGame = document.getElementById('gameForm');
    clearGame.textContent = null;
    clearGame.textContent = 'Congratulations ' + playerNameInputEl + ', you won! It took you ' + timer + ' seconds to complete!';
    var nameReplayLabelEl = document.createElement('label');
    nameReplayLabelEl.setAttribute('for', 'name');
    nameReplayLabelEl.textContent = ' Name: ';
    var nameReplayInputEl = document.createElement('input');
    clearGame.appendChild(nameReplayLabelEl);
    nameReplayInputEl.setAttribute('name', 'name');
    nameReplayInputEl.setAttribute('type', 'text');
    nameReplayInputEl.setAttribute('id', 'playerName');
    nameReplayInputEl.value = playerNameInputEl;
    var saveName = JSON.stringify(playerNameInputEl);
    localStorage.setItem('saveNameLS', saveName);
    clearGame.appendChild(nameReplayInputEl);
    var playAgainBtn = document.createElement('button');
    playAgainBtn.textContent = 'Play Again?';
    var playAgainATag = document.createElement('a');
    gameForm.removeEventListener('submit', handleStartButtonClick);
    playAgainATag.setAttribute('href', 'index.html');
    clearGame.appendChild(playAgainATag);
    playAgainATag.appendChild(playAgainBtn);
    sessionStorage.setItem('reloaded', true);
  } else {
  console.log('You suck!');
    timer = document.getElementById('timerDOMEL').textContent;
    var timerStringified = JSON.stringify(timer);
    gameArray.push(timer);
    localStorage.setItem('timerLSEl', timerStringified);
    var gameArrayStringified = JSON.stringify(gameArray);
    localStorage.setItem('gameArrayEl', gameArrayStringified);
    var clearGame = document.getElementById('gameForm');
    clearGame.textContent = null;
    clearGame.textContent = 'Congratulations ' + playerNameInputEl + ', you suck! It took you ' + timer + ' seconds to fail!';
    var nameReplayLabelEl = document.createElement('label');
    nameReplayLabelEl.setAttribute('for', 'name');
    nameReplayLabelEl.textContent = ' Name: ';
    var nameReplayInputEl = document.createElement('input');
    clearGame.appendChild(nameReplayLabelEl);
    nameReplayInputEl.setAttribute('name', 'name');
    nameReplayInputEl.setAttribute('type', 'text');
    nameReplayInputEl.setAttribute('id', 'playerName');
    nameReplayInputEl.value = playerNameInputEl;
    var saveName = JSON.stringify(playerNameInputEl);
    localStorage.setItem('saveNameLS', saveName);
    clearGame.appendChild(nameReplayInputEl);
    var playAgainBtn = document.createElement('button');
    playAgainBtn.textContent = 'Play Again?';
    var playAgainATag = document.createElement('a');
    gameForm.removeEventListener('submit', handleStartButtonClick);
    playAgainATag.setAttribute('href', 'index.html');
    clearGame.appendChild(playAgainATag);
    playAgainATag.appendChild(playAgainBtn);
    sessionStorage.setItem('reloaded', true);

  }
}


// event handlers



function handleStartButtonClick(event) {
  event.preventDefault();
  playerNameInputEl = event.target.playerName.value;
  gameArray.push(playerNameInputEl);
  var playerNameStringified = JSON.stringify(playerNameInputEl);
  localStorage.setItem('playerNameLSEl', playerNameStringified);
  populatePieces();

  mincount = findMinimumMoves();
  drawCanvas();
  elems = document.getElementById('nav');
  elems = new GameTimer(elems);
  elems.reset();
  elems.start();
  console.log(checkFinished());
  gameForm.removeEventListener('submit', handleStartButtonClick);
}

function handleCanvasMousedown(event) {
  getMousePosition(event);
  var xValue = mouse.x / (canvas.width / xDimension);
  var yValue = mouse.y / (canvas.height / yDimension);
  currentPieceLocation = new ArrayLocation(Math.floor(yValue), Math.floor(xValue));
  // console.log(currentPiece);
  currentPiece = pieces[Math.floor(yValue)][Math.floor(xValue)];
  imageSelected = currentPiece.img;
  style.type = 'text/css';
  style.innerHTML = '* {cursor: url(' + imageSelected.src + ') 64 64, auto;}';
  document.getElementsByTagName('head')[0].appendChild(style);
}

function handleCanvasMouseup(event) {
  if (event.target === canvasEl) {
    getMousePosition(event);
    var xValue = mouse.x / (canvas.width / xDimension);
    var yValue = mouse.y / (canvas.height / yDimension);
    currentDropPieceLocation = new ArrayLocation(Math.floor(yValue), Math.floor(xValue));
    // console.log(currentDropPiece);
    currentDropPiece = pieces[Math.floor(yValue)][Math.floor(xValue)];
  if(currentDropPiece.xPieceIndex !== currentPiece.xPieceIndex || currentDropPiece.yPieceIndex !== currentPiece.yPieceIndex)  {
    swapPieces(currentPiece, currentDropPiece);
  }
    imageSelected = null;
    if (checkFinished()) {
      elems.stop();
      // endGame(true);
    }
  } else {
    console.log('mouse up over window');
  }
  currentPiece = null;
  currentDropPiece = null;
  currentPieceLocation = null;
  currentDropPieceLocation = null;
  style.type = 'text/css';
  style.innerHTML = '* {cursor: initial;}';
  document.getElementsByTagName('head')[0].appendChild(style);
}

gameForm.addEventListener('submit', handleStartButtonClick);
canvasEl.addEventListener('mousedown', handleCanvasMousedown);
window.addEventListener('mouseup', handleCanvasMouseup);
