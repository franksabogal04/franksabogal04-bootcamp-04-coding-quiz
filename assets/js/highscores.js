const listElement = document.getElementById("highscore-list");

// after loading page, insert list
window.onload = function (event) {
    getHighscores();
};

function getHighscores() {
    const highscores = JSON.parse(localStorage.getItem("highscores"));

    // add a new li element for every score
    highscores.forEach((highscore, index) => {
        listElement.innerHTML += `
        <li>${index + 1}. ${highscore.initials}: ${highscore.score}</li>
        `;
    });
}

function handleGoBack() {
    // go back to index
    window.location.href = "index.html";
}

function eraseHighscores() {
    // delete from localStorage so in the future there are no scores
    localStorage.removeItem("highscores");

    // empty list from user
    listElement.innerHTML = ``;
}
