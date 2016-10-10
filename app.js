'use strict';

var timer = 0;
// var dimensions = document.getElementById('dimensions');
var x = 2;
var y = 2;

var canvasEl = document.getElementById('canvas');
var ctx = canvasEl.getContext('2d');
var startGameButtonEl = document.getElementById('start-button');
var pieces = [];

function Piece(source){
  // this.img = document.createElement('img');
  // this.img.setAttribute('src', source);
  this.img = new Image(100, 100);
  this.img.src = source;
  this.img.setAttribute('style', 'border: 1px solid #000000;');
  this.x = source.slice(14, 15);
  this.y = source.slice(16, 17);
  // this.randx = randx;
  // this.randy = randy;
};

function populatePieces(){
  for (var i = 0; i < x; i++) {
    pieces.push([]);
    for (var j = 0; j < y; j++) {
      pieces[i][j] = new Piece('img/easy/logo-' + j + '-' + i + '.png');
    }
  }
}

function drawCanvas(){
  for (var i = 0; i < pieces.length; i++) {
    for (var j = 0; j < pieces[i].length; j++) {
      ctx.drawImage(pieces[i][j].img, i * (canvas.width / x), j * (canvas.height / y), canvas.width / x, canvas.height / y);
    }
  }
  console.log('pieces: ', pieces);
}

function startButtonClick() {
  var playerNameInputEl = document.getElementById('player-name');
  populatePieces();
  drawCanvas();
}

startGameButtonEl.addEventListener('click', startButtonClick);
