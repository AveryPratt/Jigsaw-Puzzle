'use strict';

var timer = 0;
var playerName = document.getElementById('player-name');
// var dimensions = document.getElementById('dimensions');
var x = 2;
var y = 2;

var canvas = document.getElementById('canvas');
var stage = canvas.getContext('2d');
var startGameButton = document.getElementById('start-button');
var scoreBoard = document.getElementById('scoreboard-table');
var clearBoard = document.getElementById('clear-button');
var pieces = [];

function Piece(source){
  // this.img = document.createElement('img');
  // this.img.setAttribute('src', source);
  this.img = new Image();
  this.img.src = source;
  this.img.onload = function(){
    stage.drawImage(this.img, canvas.width, canvas.height);
  };
  this.x = source.slice(16, 17);
  this.y = source.slice(18, 19);
  // this.randx = randx;
  // this.randy = randy;
};

function populatePieces(){
  for (var i = 0; i < x; i++) {
    pieces[i] = [];
    for (var j = 0; j < y; j++) {
      pieces[i][j] = new Piece('./img/easy/logo-' + i + '-' + j + '.png');
    }
  }
}
function drawCanvas(){
  for (var i = 0; i < x; i++) {
    for (var j = 0; j < y; j++) {
      array[i][j].img.onload();
    }
  }
}

function startButtonClick() {
  populatePieces();
  drawCanvas();
}

startGameButton.addEventListener('click', startButtonClick);
