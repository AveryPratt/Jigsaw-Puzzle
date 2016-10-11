'use strict';

var timer = 0;
// var myLocation;
// // var dimensions = document.getElementById('dimensions');
// var x = 2;
// var y = 2;
var xDimension = 2;
var yDimension = 2;

var canvasEl = document.getElementById('canvas');
var ctx = canvasEl.getContext('2d');
var gameForm = document.getElementById('gameForm');
// var startGameButtonEl = document.getElementById('start-button');
var playerNameInputEl = document.getElementById('playerName');
var pieces = [];

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

function generateRandLocation(minY, maxY, minX, maxX){
  var randY = Math.round(Math.random(minY, maxY));
  var randX = Math.round(Math.random(minX, maxX));
  return new ArrayLocation(randY, randX);
}

function generateNewLocation(locationsUsed){
  var currentLocation = generateRandLocation(0, yDimension, 0, xDimension);
  var passed = true;
  for (var i = 0; i < locationsUsed.length; i++) {
    if(currentLocation.yLocationIndex === locationsUsed[i].yLocationIndex && currentLocation.xLocationIndex === locationsUsed[i].xLocationIndex) {
      passed = false;
    }
  }
  if(passed === false){
    return generateNewLocation(locationsUsed);
  } else {
    return currentLocation;
  }
}

function populatePieces(){
  var locationsUsed = [];
  for (var i = 0; i < yDimension; i++) { // i = y index
    pieces[i] = [];
    for (var j = 0; j < xDimension; j++) { // j = x index
      var myLocation = generateNewLocation(locationsUsed);
      console.log('Piece ' + i + '-' + j + ' Y: ' + myLocation.yLocationIndex + ' X: ' + myLocation.xLocationIndex);
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

function startButtonClick(event) {
  event.preventDefault();
  playerNameInputEl = event.target.playerName.value;
  var playerNameStringified = JSON.stringify(playerNameInputEl);
  localStorage.setItem('playerNameLSEl', playerNameStringified);
  var timerStringified = JSON.stringify(timer);
  localStorage.setItem('timerLSEl', timerStringified);
  populatePieces();
  drawCanvas();
  event.target.playerName.value = null;
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

gameForm.addEventListener('submit', startButtonClick);
