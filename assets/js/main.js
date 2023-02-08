const mainElement = document.getElementById("main-screen");
const timerElement = document.getElementById("timer");

var questionNumber = 0;
var time = 75;
var timerInterval = null;

// Begin game
function startQuiz() {
    // reset values
    questionNumber = 0;
    time = 75;
    timerElement.innerHTML = `Time: ${time}`;

    // start timer
    timerInterval = setInterval(updateRunningTimer, 1000);

    // display first question
    displayQuestion(questions[questionNumber]);
}

// executed when timer reaches 0 or all questions are answeres
function endQuiz() {
    // delete timer
    clearInterval(timerInterval);

    // show end screen with form
    mainElement.innerHTML = `
    <h1>All done!</h1>
    <p>Your final score is ${time}</p>
    <form id='highscore-initials-form'>
        <label for="initials">Enter initials:</label>
        <input type="text" id="initials-input" name="initials">
        <input type="submit" id="submit">
    </form>`;

    // Get elements to manipulate
    const formElement = document.getElementById("highscore-initials-form");
    const inputElement = document.getElementById("initials-input");

    formElement.addEventListener("submit", function (event) {
        // prevent form from executing default behavior
        event.preventDefault();

        // check if input is empty and alert user
        if (inputElement.value.length === 0) {
            alert("Please add your initials");
        } else {
            goToHighscores(inputElement.value);
        }
    });
}

// display question and possible answers
function displayQuestion(questionObject) {
    const title = questionObject.title;
    const choices = questionObject.choices;
    const answer = questionObject.answer;

    // display prompt and answers
    mainElement.innerHTML = `
    <h1>${title}</h1>
    `;

    // iterate through each choice,
    // set functions to be executed if right/wrong choice is clicked
    for (let i = 0; i < choices.length; i++) {
        mainElement.innerHTML += `<button class="button-choice" onclick="${
            choices[i] === answer ? "handleCorrectAnswer()" : "handleWrongAnswer()"
        }">${i + 1}. ${choices[i]}</button>`;
    }
}

// redirect to last page
function goToHighscores(initials) {
    // get highscores stored
    var highscores = JSON.parse(localStorage.getItem("highscores"));

    if (highscores === null) {
        console.log("creating new");
        // save only score as an array for future highscores
        localStorage.setItem(
            "highscores",
            JSON.stringify([{ initials: initials, score: time }])
        );
    } else {
        highscores.push({ initials: initials, score: time });

        // sort so it is in order before saving based on the score key
        highscores.sort(function (a, b) {
            return b.score - a.score;
        });

        localStorage.setItem("highscores", JSON.stringify(highscores));
    }

    window.location.href = "highscores.html";
}

// executed when user clicks the correct answer
function handleWrongAnswer() {
    // play audio
    var audio = new Audio('assets/sfx/incorrect.wav');
    audio.play();

    if (questionNumber === questions.length - 1) {
        endQuiz();
    } else {
        // subtract 10 seconds from timer
        time -= 10;

        // update timer so it is reflected instantly
        timerElement.innerHTML = `Time: ${time}`;

        nextQuestion();
    }
}

function handleCorrectAnswer() {
    // play audio
    var audio = new Audio('assets/sfx/correct.wav');
    audio.play();

    // just go to next question without any changes
    nextQuestion();
}

// executed when user clicks any answer
function nextQuestion() {
    if (questionNumber === questions.length - 1) {
        endQuiz();
    } else {
        // call display question with the new object that needs to be displayed
        questionNumber += 1;
        displayQuestion(questions[questionNumber]);
    }
}

// update running timer
function updateRunningTimer() {
    // lost
    if (time <= 0) {
        // prevent from being negative
        time = 0;

        endQuiz();
    } else {
        // update timer
        time--;
        timerElement.innerHTML = `Time: ${time}`;
    }
}
