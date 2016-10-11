'use strict';

var timer = 0;
var myLocation;
// var dimensions = document.getElementById('dimensions');
var x = 2;
var y = 2;
var canvasEl = document.getElementById('canvas');
var ctx = canvasEl.getContext('2d');
var gameForm = document.getElementById('gameForm');
// var startGameButtonEl = document.getElementById('start-button');
var playerNameInputEl = document.getElementById('playerName');
var pieces = [];

function Piece(source, ind){
  // this.img = document.createElement('img');
  // this.img.setAttribute('src', source);
  this.img = new Image(100, 100);
  this.img.src = source;
  this.img.setAttribute('style', 'border: 1px solid #000000;');
  this.x = source.slice(14, 15);
  this.y = source.slice(16, 17);
  this.ind = ind;
  // this.randx = randx;
  // this.randy = randy;
};

function populatePieces(){
  var locations = [];
  for (var i = 0; i < x; i++) {
    pieces[i] = [];
    for (var j = 0; j < y; j++) {
      myLocation = checkLocation(locations);
      pieces[i][j] = new Piece('img/easy/logo-' + loc.yy + '-' + loc.xx + '.png');
      locations.push(myLocation);
    }
  }
}

var loc;

function checkLocation(locations){
  generateRandLocation(0, x, 0, y);
  var passed = true;
  for (var i = 0; i < locations.length; i++) {
    if(loc === locations[i]) {
      passed = false;
      console.log(passed, '= PASSED');
    }
  }
  if(passed === false){
    return checkLocation(locations);
    console.log(checkLocation(locations), 'checkLocation(locations)');
  } else {
    return loc;
  }
}

function ArrayLocation(yy, xx){
  this.yy = yy;
  this.xx = xx;
}

function generateRandLocation(minX, maxX, minY, maxY){
  var rand1 = Math.round(Math.random(minX, maxX));
  var rand2 = Math.round(Math.random(minY, maxY));
  console.log(rand1, 'rand 1');
  console.log(rand2, 'rand 2');
  loc = new ArrayLocation(rand1, rand2);
}

function drawCanvas(){
  for (var i = 0; i < pieces.length; i++) {
    for (var j = 0; j < pieces[i].length; j++) {
      ctx.drawImage(pieces[i][j].img, i * (canvas.width / x), j * (canvas.height / y), canvas.width / x, canvas.height / y);
      ctx.strokeRect(i * (canvas.width / x), j * (canvas.height / y), canvas.width / x, canvas.height / y);
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

gameForm.addEventListener('submit', startButtonClick);
