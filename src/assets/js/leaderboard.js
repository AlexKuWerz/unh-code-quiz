'use strict';

let leaderboardData = JSON.parse(localStorage.getItem('quizScoreList'));

let leaderboard = {
    containerElem: document.querySelector('.js-leaderboard-section'),
    listElem: document.querySelector('.js-leaderboard-list'),
    clearBtnElem: document.querySelector('.js-clear-leaderboard-btn'),
    noResultsMessage: 'No quiz results',
}

function updateLeaderboard() {
    console.log('%c Update Leaderboard ', 'background-color: #333; color: #D96704;');
    if (leaderboardData !== null) {
        let messageElem = document.querySelector('message');

        if (messageElem !== null) {
            messageElem.remove();
        }

        leaderboardData.sort((a, b) => b.score - a.score).forEach((item) => {
            let listItemElem = document.createElement('li');

            listItemElem.classList.add('list-item');
            listItemElem.textContent = `${item.name} --- `;

            let scoreElem = document.createElement('strong');

            scoreElem.textContent = item.score;

            listItemElem.appendChild(scoreElem);
            leaderboard.listElem.appendChild(listItemElem);
        });

        leaderboard.listElem.classList.remove('hidden');
        leaderboard.clearBtnElem.classList.remove('hidden');
    } else {
        leaderboard.clearBtnElem.classList.add('hidden');

        let messageElem = document.createElement('p');

        messageElem.classList.add('message');
        messageElem.textContent = leaderboard.noResultsMessage;

        leaderboard.containerElem.appendChild(messageElem);
    }
}

function clearLeaderboard() {
    console.log('%c Clear Leaderboard ', 'background-color: #333; color: #af3;');
    localStorage.removeItem('quizScoreList');
    leaderboardData = null;
    leaderboard.listElem.classList.add('hidden');

    updateLeaderboard();
}

function init() {
    console.log('%c Init ', 'background-color: #333; color: #FFE849;');
    updateLeaderboard();

    leaderboard.clearBtnElem.addEventListener('click', clearLeaderboard);
}

init();
