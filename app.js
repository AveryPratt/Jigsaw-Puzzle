'use strict';

// global variables
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
var timerOn = false;
var stopTime = 0;
var currentTime;
var startingTime;

// DOM variables
var gameForm = document.getElementById('gameForm');
var startGameButtonEl = document.getElementById('start-button');
var playerNameInputEl = document.getElementById('playerName');
var canvasEl = document.getElementById('canvas');
var ctx = canvasEl.getContext('2d');

// constructors
function Piece(source){
  this.img = new Image();
  this.img.src = source;
  this.img.setAttribute('style', 'border: 1px solid #000000;');
  this.yPieceIndex = source.slice(14, 15);
  this.xPieceIndex = source.slice(16, 17);
};
function ArrayLocation(yLocationIndex, xLocationIndex){
  this.yLocationIndex = yLocationIndex;
  this.xLocationIndex = xLocationIndex;
}

// functions
function generateRandLocation(minY, maxY, minX, maxX){
  var randY = Math.round(Math.random(minY, maxY));
  var randX = Math.round(Math.random(minX, maxX));
  return new ArrayLocation(randY, randX);
}
function generateNewLocation(locationsUsed, yIndex, xIndex){
  var currentLocation = generateRandLocation(0, yDimension, 0, xDimension);
  if(checkUsedLocations(currentLocation, locationsUsed)){
    if(checkCurrentLocation(currentLocation, yIndex, xIndex)){
      return currentLocation;
    }
  }
  console.log('failed: (' + yIndex + '-' + xIndex + '): ' + currentLocation.yLocationIndex + '-' + currentLocation.xLocationIndex);
  return generateNewLocation(locationsUsed, yIndex, xIndex);
}
function checkUsedLocations(currentLocation, locationsUsed){
  for (var i = 0; i < locationsUsed.length; i++) {
    if(currentLocation.yLocationIndex === locationsUsed[i].yLocationIndex && currentLocation.xLocationIndex === locationsUsed[i].xLocationIndex) {
      return false;
    }
  }
  return true;
}
function checkCurrentLocation(currentLocation, yIndex, xIndex){
  if(yIndex === yDimension - 1 && xIndex === xDimension - 1){ // this statement is necessary to avoid last position having no valid options
    return true;
  }
  if(currentLocation.xLocationIndex === xIndex && currentLocation.yLocationIndex === yIndex){
    // console.log('same location: ' + yIndex + '-' + xIndex + ' ' + currentLocation.yLocationIndex + '-' + currentLocation.xLocationIndex);
    return false;
  }
  else return true;
}
function populatePieces(){
  var locationsUsed = [];
  for (var i = 0; i < yDimension; i++) { // i = y index
    pieces[i] = [];
    for (var j = 0; j < xDimension; j++) { // j = x index
      var myLocation = generateNewLocation(locationsUsed, i, j);
      console.log('Piece: (' + i + '-' + j + ') = ' + myLocation.yLocationIndex + '-' + myLocation.xLocationIndex);
      pieces[i][j] = new Piece('img/easy/logo-' + myLocation.yLocationIndex + '-' + myLocation.xLocationIndex + '.png');
      locationsUsed.push(myLocation);
    }
  }
}
function drawCanvas(){
  for (var i = 0; i < pieces.length; i++) { // i = y index
    for (var j = 0; j < pieces[i].length; j++) { // j = x index
      ctx.drawImage(pieces[i][j].img, j * (canvas.width / xDimension), i * (canvas.height / yDimension), canvas.width / xDimension, canvas.height / yDimension);
      ctx.strokeRect(j * (canvas.width / xDimension), i * (canvas.height / yDimension), canvas.width / xDimension, canvas.height / yDimension);
    }
  }
  console.log('pieces: ', pieces);
}
function checkFinished(){
  var isFinished = true;
  for (var i = 0; i < pieces.length; i++) { // i = y index
    for (var j = 0; j < pieces[i].length; j++) { // j = x index
      if(parseInt(pieces[i][j].yPieceIndex) === i && parseInt(pieces[i][j].xPieceIndex) === j){
        continue;
      }
      else{
        isFinished = false;
      }
    }
  }
  return isFinished;
}
function getMousePosition(event){
  mouse.x = event.layerX;
  mouse.y = event.layerY;
}
function swapPieces(currentPiece, currentDropPiece){
  console.log('swapPieces');
  var temp = currentPiece;
  pieces[currentPieceLocation.yLocationIndex][currentPieceLocation.xLocationIndex] = currentDropPiece;
  pieces[currentDropPieceLocation.yLocationIndex][currentDropPieceLocation.xLocationIndex] = temp;
  drawCanvas();
}

// event handlers
function handleStartButtonClick(event) {
  event.preventDefault();
  playerNameInputEl = event.target.playerName.value;
  var playerNameStringified = JSON.stringify(playerNameInputEl);
  localStorage.setItem('playerNameLSEl', playerNameStringified);
  populatePieces();
  drawCanvas();
  event.target.playerName.value = null;
  console.log(checkFinished());
  startingTime = Date.now();
}
function handleCanvasMousedown(event){
  getMousePosition(event);
  var xValue = mouse.x / (canvas.width / xDimension);
  var yValue = mouse.y / (canvas.height / yDimension);
  currentPieceLocation = new ArrayLocation(Math.floor(yValue), Math.floor(xValue));
  console.log(currentPiece);
  currentPiece = pieces[Math.floor(yValue)][Math.floor(xValue)];
}
function handleCanvasMouseup(event){
  getMousePosition(event);
  var xValue = mouse.x / (canvas.width / xDimension);
  var yValue = mouse.y / (canvas.height / yDimension);
  currentDropPieceLocation = new ArrayLocation(Math.floor(yValue), Math.floor(xValue));
  console.log(currentDropPiece);
  currentDropPiece = pieces[Math.floor(yValue)][Math.floor(xValue)];
  swapPieces(currentPiece, currentDropPiece);
  if(checkFinished()){
    console.log('You won!');
    gameTimer(startingTime);
    timer = ' | ' + timeInMMSS(stopTime);
    var timerStringified = JSON.stringify(timer);
    localStorage.setItem('timerLSEl', timerStringified);
  }
}


function gameTimer(startingTime){
  currentTime = Date.now();
  var timeDifference = currentTime - startingTime;

  if (timerOn === false){
    timeDifference = timeDifference + stopTime;
  }

  if (timerOn === true){
    timer.value = timeInMMSS(timeDifference);
    var refresh = setTimeout('gameTimer()', 100);
  } else {
    window.clearTimeout(refresh);
    stopTime = timeDifference;
  }
}

function timeInMMSS(rawTime){
  var secs = Math.floor(rawTime / 1000);
  var mins = Math.floor(rawTime / 60000);
  secs = secs - 60 * mins;
  if (mins === 0){
    return secs + ' seconds';
  } else {
    return mins + ' minutes and ' + secs + ' seconds';
  }
}

canvasEl.addEventListener('mousedown', handleCanvasMousedown);
canvasEl.addEventListener('mouseup', handleCanvasMouseup);

gameForm.addEventListener('submit', handleStartButtonClick);
