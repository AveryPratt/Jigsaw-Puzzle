'use strict';

var newGameArray;
var LiElId;
var clearBoard = document.getElementById('clear-button');
var scoreBoardListEl = document.getElementById('scoreboard-table');

function clearButtonClick() {
  localStorage.clear();
  scoreBoardListEl.innerHTML = '';
  newGameArray = [];
}

// startGameButton.addEventListener('click', startButtonClick);

function compareScores(score1, score2){
  if(parseFloat(score1.time) > parseFloat(score2.time)){
    return 1;
  }
  else return -1;
}

function displayScores(){
  newGameArray.sort(compareScores);
  for (var i = 0; i < newGameArray.length; i++) {
    console.log(newGameArray.time);
    LiElId = document.createElement('li');
    LiElId.setAttribute('class', 'scoreList');
    LiElId.textContent = newGameArray[i].name + '\'s score is ' + newGameArray[i].time + ' seconds';
    scoreBoardListEl.appendChild(LiElId);
  }
}

clearBoard.addEventListener('click', clearButtonClick);

// iife
(function checkLocalStorage(){
  if(localStorage.getItem('gameArrayEl')){
    var loadOldGames = localStorage.getItem('gameArrayEl');
    newGameArray = JSON.parse(loadOldGames);
    console.log('newGameArray: ', newGameArray);
  } else {
    console.log('nothing found in localStorage');
    newGameArray = [];
  }
}());

displayScores();
