'use strict';

var timer = 0;
var playerName = document.getElementById('player-name');
// var dimensions = document.getElementById('dimensions');
var x = 2;
var y = 2;

var canvas = document.getElementById('canvas');
var startGameButton = document.getElementById('start-button');
var scoreBoard = document.getElementById('scoreboard-table');
var clearBoard = document.getElementById('clear-button');
var pieces = [];

for (var i = 0; i < x; i++) {
  pieces[i] = [];
  for (var j = 0; j < y; j++) {
    pieces[i][j] = new Piece('./img/easy/logo-' + i + '-' + j);
  }
}

function Piece(source, randx, randy) {
  this.x = source.slice(16, 17);
  this.y = source.slice(18, 19);
  this.randx = randx;
  this.randy = randy;
  this.imgSource = source;
}

function startButtonClick() {

}


function clearButtonClick() {
  scoreBoard.innerHTML = '';
}

// startGameButton.addEventListener('click', startButtonClick);


clearBoard.addEventListener('click', clearButtonClick);
