'use strict';

let timer = {
    containerElem: document.querySelector('.js-timer'),
    countdownElem: document.querySelector('.js-timer-countdown'),
    timeLimit: 60,
    timeLeft: 0,
    wrongAnswerPenalty: 5,
    timerIntarvalId: undefined,
}

let start = {
    containerElem: document.querySelector('.js-start-section'),
    btnElem: document.querySelector('.js-start-btn'),
}

let quiz = {
    containerElem: document.querySelector('.js-quiz-section'),
    questionElem: document.querySelector('.js-quiz-question'),
    answersListElem: document.querySelector('.js-quiz-answers-list'),
    selectedAnswerElem: undefined,
}

let result = {
    containerElem: document.querySelector('.js-results-section'),
    restartBtnElem: document.querySelector('.js-restart-btn'),
    leaderboardBtnElem: document.querySelector('.js-leaderboard-btn'),
    scoreElem: document.querySelector('.js-score'),
    resultForm: document.querySelector('.js-result-form'),
    previousResults: null,
    successMessage: 'You successfully submitted your results!',
}

let quizData = {
    quizNumber: 0,
    quizList: [
        {
            question: 'Inside which HTML element do we put the JavaScript?',
            answers: [
                '<javascript>',
                '<script>',
                '<scripting>',
                '<js>',
            ],
            correctAnswer: '<script>',
        },
        {
            question: 'Where is the correct place to insert a JavaScript?',
            answers: [
                'The <body> section',
                'The <head> section',
                'Both the <head> section and the <body> section are correct',
            ],
            correctAnswer: 'Both the <head> section and the <body> section are correct',
        },
        {
            question: 'What is the correct syntax for referring to an external script called "xxx.js"?',
            answers: [
                '<script src="xxx.js">',
                '<script name="xxx.js">',
                '<script href="xxx.js">',
            ],
            correctAnswer: '<script src="xxx.js">',
        },
        {
            question: 'How do you create a function in JavaScript?',
            answers: [
                'function = myFunction()',
                'function:myFunction()',
                'function myFunction()',
                'create function = myFunction()',
            ],
            correctAnswer: 'function myFunction()',
        },
        {
            question: 'How to write an IF statement in JavaScript?',
            answers: [
                'if i = 5',
                'if (i == 5)',
                'if i == 5 then',
                'if i = 5 then',
            ],
            correctAnswer: 'if (i == 5)',
        },
    ],
}

function runTimer() {
    console.log('%c Run Timer ', 'background-color: #333; color: #FF00CC;');
    timer.timeLeft = timer.timeLimit;
    timer.containerElem.classList.remove('invisible');
    timer.countdownElem.textContent = timer.timeLeft;

    timer.timerIntarvalId = setInterval(() => {
        if (timer.timeLeft > 0) {
            timer.timeLeft--;
            timer.countdownElem.textContent = timer.timeLeft;
        } else {
            stopTimer();
            endQuiz();
        }
    }, 1000);
}

function stopTimer() {
    console.log('%c Stop Timer ', 'background-color: #333; color: #FF00CC;');
    timer.containerElem.classList.add('invisible');
    clearInterval(timer.timerIntarvalId);
}

function updateQuiz() {
    console.log('%c Update Quiz ', 'background-color: #333; color: #D96704;');
    let quizItem = quizData.quizList[quizData.quizNumber];

    quiz.answersListElem.textContent = '';
    quiz.questionElem.textContent = quizItem.question;

    quizItem.answers.forEach((item) => {
        let listItemElem = document.createElement('li');
        let answer = item;

        listItemElem.classList.add('list-item');
        listItemElem.dataset.answer = answer;
        listItemElem.textContent = answer;

        quiz.answersListElem.appendChild(listItemElem);
    });

    quiz.answersListElem.addEventListener('click', getUserAnswer);
}

function checkNextQuiz() {
    console.log('%c Check Next Quiz ', 'background-color: #333; color: #D96704;');
    if (quizData.quizNumber >= quizData.quizList.length) {
        stopTimer();

        setTimeout(() => {
            endQuiz();
        }, 1000);
    } else if (quizData.quizNumber === 0) {
        updateQuiz();
    } else {
        setTimeout(() => {
            updateQuiz();
        }, 1000);
    }
}

function getUserAnswer(event) {
    console.log('%c Get User Answer ', 'background-color: #333; color: #4CB7EB;');
    let userAnswer = event.target.dataset.answer;

    if (userAnswer !== undefined) {
        event.currentTarget.removeEventListener('click', getUserAnswer);
        quiz.selectedAnswerElem = event.target;
        checkAnswer(userAnswer, quizData.quizList[quizData.quizNumber].correctAnswer);
    }
}

function checkAnswer(userAnswer, correctAnswer) {
    console.log('%c Check Answer ', 'background-color: #333; color: #4CB7EB;');
    if (userAnswer === correctAnswer) {
        quiz.selectedAnswerElem.classList.add('correct-answer');
    } else {
        quiz.selectedAnswerElem.classList.add('wrong-answer');
        timer.timeLeft -= timer.wrongAnswerPenalty;

        if (timer.timeLeft < 0) {
            timer.timeLeft = 0;
        }

        timer.countdownElem.textContent = timer.timeLeft;
    }

    quizData.quizNumber++;

    checkNextQuiz();
}

function showResults() {
    console.log('%c Show Results ', 'background-color: #333; color: #af3;');
    result.scoreElem.textContent = timer.timeLeft;

    result.containerElem.classList.remove('hidden');
}

function storeResults(event) {
    console.log('%c Store Results ', 'background-color: #333; color: #af3;');
    event.preventDefault();

    let form = event.currentTarget;
    let nameInput = form.querySelector('#user-name');
    let userName = nameInput.value.trim();

    if (userName !== '') {
        let resultsList = [];

        result.previousResults = JSON.parse(localStorage.getItem('quizScoreList'));

        if (result.previousResults !== null) {
            resultsList = result.previousResults;
        }

        resultsList.push(new Object({
            name: userName,
            score: timer.timeLeft,
        }));

        localStorage.setItem('quizScoreList', JSON.stringify(resultsList));

        let messageElem = document.createElement('p');

        messageElem.textContent = result.successMessage;
        messageElem.classList.add('message', 'success');

        nameInput.value = '';
        form.classList.add('hidden');
        result.leaderboardBtnElem.classList.remove('hidden');
        result.containerElem.appendChild(messageElem);
    }
}

function startQuiz() {
    console.log('%c Start Quiz ', 'background-color: #333; color: #F2CEAE;');
    quizData.quizNumber = 0;

    start.containerElem.classList.add('hidden');
    result.containerElem.classList.add('hidden');
    result.leaderboardBtnElem.classList.add('hidden');
    result.resultForm.classList.remove('hidden');

    let messageElem = document.querySelector('.message');

    if (messageElem !== null) {
        messageElem.remove();
    }

    checkNextQuiz();

    quiz.containerElem.classList.remove('hidden');

    runTimer();
}

function endQuiz() {
    console.log('%c End Quiz ', 'background-color: #333; color: #F2CEAE;');
    quiz.containerElem.classList.add('hidden');

    showResults();
}

function init() {
    console.log('%c Init ', 'background-color: #333; color: #FFE849;');

    let timeLimitElem = document.querySelector('.js-time-limit');
    let timePenaltyElem = document.querySelector('.js-time-penalty');

    timeLimitElem.textContent = timer.timeLimit;
    timePenaltyElem.textContent = timer.wrongAnswerPenalty;

    start.btnElem.addEventListener('click', startQuiz);
    result.restartBtnElem.addEventListener('click', startQuiz);
    result.resultForm.addEventListener('submit', storeResults);
}

init();
