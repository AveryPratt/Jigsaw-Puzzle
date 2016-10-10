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
var pieces = [][];

for (var i = 0; i < x; i++) {
  for (var j = 0; j < y; j++) {
    pieces[i][j] = Piece('./img/logo-' + x + '-' + y);
  }
}

function Piece(source){
  this.x;
  this.y;
  this.randx;
  this.randy;
  this.imgSource = source;
}
