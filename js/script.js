let next = document.querySelector('.next');
let previous = document.querySelector('.previous');

let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');
let average = document.querySelector('.average');

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let index = 0;
let points = 0;
let preQuestions = [];
let results = document.querySelector('.results');
let list = document.querySelector('.list');
let userScorePoint = document.querySelector('.userScorePoint');
let userScores = {}

const promiseOfQuestionsData = fetch("https://quiztai.herokuapp.com/api/quiz").then(r => r.json()).then(questionsData => {
    return questionsData;
});

window.onload = async () => {
    preQuestions = await promiseOfQuestionsData;
    setQuestion(index);
};

for (let i = 0; i < answers.length; i++) {
    answers[i].addEventListener('click', doAction);
}

restart.addEventListener('click', function (event) {
    event.preventDefault();

    index = 0;
    points = 0;
    let userScorePoint = document.querySelector('.score');
    userScorePoint.innerHTML = points;
    setQuestion(index);
    activateAnswers();
    list.style.display = 'block';
    results.style.display = 'none';
});

function setQuestion(index) {
    if (preQuestions[index].answers.length === 2) {
        answers[0].innerHTML = preQuestions[index].answers[0];
        answers[1].innerHTML = preQuestions[index].answers[1];
        answers[2].style.display = 'none';
        answers[3].style.display = 'none';
    } else {
        answers[0].innerHTML = preQuestions[index].answers[0];
        answers[1].innerHTML = preQuestions[index].answers[1];
        answers[2].innerHTML = preQuestions[index].answers[2];
        answers[3].innerHTML = preQuestions[index].answers[3];

        answers[2].style.display = 'block';
        answers[3].style.display = 'block';
    }

    question.innerHTML = index + 1 + ". " + preQuestions[index].question;
}

next.addEventListener('click', function () {
    index++;
    if (index < 19) {
        setQuestion(index);
        activateAnswers();
    } else {//over
        list.style.display = 'none';
        results.style.display = 'block';
        userScorePoint.innerHTML = points;


        userScores = JSON.parse(localStorage.getItem("savedResults"));

        if (userScores == null) {
            let newScore = {
                "noOfGames": 1,
                "avgScore": points
            };
            localStorage.setItem("savedResults", JSON.stringify(newScore));
        } else {
            let newScore = {
                "noOfGames": userScores.noOfGames + 1,
                "avgScore": (userScores.avgScore + points) / (userScores.noOfGames + 1)
            };
            localStorage.setItem("savedResults", JSON.stringify(newScore));
        }

        average.innerHTML = userScores.avgScore;
    }
    for (let i = 0; i < answers.length; i++) {
        answers[i].classList.remove('correct');
        answers[i].classList.remove('incorrect');
    }
});

previous.addEventListener('click', function () {
    if (index != 0) {
        index--;
        setQuestion(index);
        disableAnswers();
    }
});


function doAction(event) {
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    } else {
        markIncorrect(event.target);
    }
    disableAnswers();
}

function activateAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('click', doAction);
    }
}

function disableAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener('click', doAction);
    }
}

function markCorrect(elem) {
    elem.classList.add('correct');
}

function markIncorrect(elem) {
    elem.classList.add('incorrect');
}

function saveToLocalStorage(score) {
    localStorage.setItem("userScores", JSON.stringify(score));
}
