'use strict';

//check localStorage
if(localStorage.getItem('gameArrayEl')){
  var loadOldGames = localStorage.getItem('gameArrayEl');
  var newGameArray = JSON.parse(loadOldGames);
  console.log('newGameArray: ', newGameArray);
} else {
  console.log('nothing found in localStorage');
};

var scoreArray = [];
var LiElId;
var clearBoard = document.getElementById('clear-button');
var scoreBoardListEl = document.getElementById('scoreboard-table');

function clearButtonClick() {
  localStorage.clear();
  scoreBoardListEl.innerHTML = '';
}

function Score(name, time){
  this.name = name;
  this.time = time;
}

// startGameButton.addEventListener('click', startButtonClick);

function addScores(){
  for (var i = 0; i < newGameArray.length; i++){
    if(i % 2 === 0){
      scoreArray.push(new Score(newGameArray[i], newGameArray[i + 1]));
    }
  }
}

function compareScores(score1, score2){
  if(score1.time > score2.time){
    return 1;
  }
  else return -1;
}

function displayScores(){
  scoreArray.sort(compareScores);
  for (var i = 0; i < scoreArray.length; i++) {
    console.log(scoreArray.time);
    LiElId = document.createElement('li');
    LiElId.setAttribute('class', 'scoreList');
    LiElId.textContent = scoreArray[i].name + '\'s score is ' + scoreArray[i].time + ' seconds';
    scoreBoardListEl.appendChild(LiElId);
  }
}

addScores();
displayScores();


clearBoard.addEventListener('click', clearButtonClick);
