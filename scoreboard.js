'use strict';

//check localStorage
if(localStorage.getItem('gameArrayEl')){
  var loadOldGames = localStorage.getItem('gameArrayEl');
  var newGameArray = JSON.parse(loadOldGames);
  console.log('newGameArray: ', newGameArray);
} else {
  console.log('nothing found in localStorage');
};

var playerNameLiEl;
var timerLiEl;
var LiElId;
var clearBoard = document.getElementById('clear-button');
var scoreBoardListEl = document.getElementById('scoreboard-table');

function clearButtonClick() {
  localStorage.clear();
  scoreBoardListEl.innerHTML = '';
}

// startGameButton.addEventListener('click', startButtonClick);

function addScore(){
  console.log(newGameArray);
  for (var i = 0; i < newGameArray.length; i++){
    if(i % 2){
      playerNameLiEl = newGameArray[i];
    } else {
      timerLiEl = newGameArray[i];
    }
    LiElId = document.createElement('li');
    LiElId.setAttribute('class', 'scoreList');
    LiElId.textContent = playerNameLiEl + ' ' + timerLiEl;
    scoreBoardListEl.appendChild(LiElId);
  }

}

addScore();

clearBoard.addEventListener('click', clearButtonClick);
