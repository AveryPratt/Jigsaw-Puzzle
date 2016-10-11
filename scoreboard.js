'use strict';


var clearBoard = document.getElementById('clear-button');
var scoreBoardListEl = document.getElementById('scoreboard-table');
var playerNameLocalStorageEl = localStorage.getItem('playerNameLSEl');
var timerLocalStorageEl = localStorage.getItem('timerLSEl');




function clearButtonClick() {
  scoreBoard.innerHTML = '';
}

// startGameButton.addEventListener('click', startButtonClick);

function addScore(){
  var playerNameLiEl = JSON.parse(playerNameLocalStorageEl);
  var timerLiEl = JSON.parse(timerLocalStorageEl);
  var LiElId = document.createElement('li');
  LiElId.textContent = playerNameLiEl + ' ' + timerLiEl;
  scoreBoardListEl.appendChild(LiElId);
}

addScore();

clearBoard.addEventListener('click', clearButtonClick);
