'use strict';


var clearBoard = document.getElementById('clear-button');







function clearButtonClick() {
  scoreBoard.innerHTML = '';
}

// startGameButton.addEventListener('click', startButtonClick);


clearBoard.addEventListener('click', clearButtonClick);
