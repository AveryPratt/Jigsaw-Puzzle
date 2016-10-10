'use strict';

var timer = 0;
var playerName = document.getElementById('player-name');
// var dimensions = document.getElementById('dimensions');
var x = 2;
var y = 2;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var startGameButton = document.getElementById('start-button');
var pieces = [];

function Piece(source){
  // this.img = document.createElement('img');
  // this.img.setAttribute('src', source);
  this.img = new Image(100, 100);
  this.img.src = source;
  this.x = source.slice(14, 15);
  this.y = source.slice(16, 17);
  // this.randx = randx;
  // this.randy = randy;
};

function populatePieces(){
  for (var i = 0; i < x; i++) {
    var newArr = [];
    pieces.push(newArr);
    for (var j = 0; j < y; j++) {
      pieces[i][j] = new Piece('img/easy/logo-' + i + '-' + j + '.png');
    }
  }
}
function drawCanvas(){
  console.log(pieces);
  console.log(pieces[0][0].img.src);
  console.log(pieces[0][0].img);
  ctx.drawImage(pieces[0][0].img, 0, 0, canvas.width, canvas.height);
}

function startButtonClick() {
  populatePieces();
  drawCanvas();
}

startGameButton.addEventListener('click', startButtonClick);
