const startBtn = document.getElementById("start-btn");
const selectContainer = document.getElementById("select-container");
const quizSection = document.getElementById("quiz-section");
const usernameDisplay = document.getElementById("username");
const playerNameInput = document.getElementById("player-name");
const categorySelect = document.getElementById("category");
const questionEl = document.getElementById("question");
const answerBtns = document.getElementById("answer-btn");
const nextBtn = document.getElementById("next-btn");
const timerEl = document.getElementById("timer");
const progressFill = document.getElementById("progress-fill");
const resultScreen = document.getElementById("result-screen");
const finalScoreEl = document.getElementById("final-score");

let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 10;

const questions = {
    html: [
        {
            question: "What does HTML stand for?",
            answers: [
                { text: "Hyper Text Markup Language", correct: true },
                { text: "Hyperlinks and Text Markup Language", correct: false },
                { text: "Home Tool Markup Language", correct: false },
                { text: "Hyperlinking Text Management Language", correct: false }
            ]
        },
        {
            question: "Which tag is used for inserting a line break?",
            answers: [
                { text: "<break>", correct: false },
                { text: "<br>", correct: true },
                { text: "<lb>", correct: false },
                { text: "<newline>", correct: false }
            ]
        },
        {
            question: "Attribute are like properties we add to what?",
            answers: [
                { text: "link", correct: false },
                { text: "Element", correct: true },
                { text: "browser", correct: false },
                { text: "Website", correct: false }
            ]
        },
        {
            question: "What does Nesting means?",
            answers: [
                { text: "Placing one element inside another element", correct: true },
                { text: "Commenting out an element", correct: false },
                { text: "Inputing an element in an attribute", correct: false },
                { text: "Combination of Html and Javascript", correct: false }
            ]
        },
        {
            question: "What is <!Doctype html> use for in HTML?",
            answers: [
                { text: "Create a link", correct: false },
                { text: "To seperate an element", correct: false },
                { text: "None of the above", correct: false },
                { text: "To declare the is using HTML5", correct: true }
            ]
        }
    ],
    css: [
        {
            question: "Which property changes text color?",
            answers: [
                { text: "font-color", correct: false },
                { text: "color", correct: true },
                { text: "text-style", correct: false },
                { text: "background-color", correct: false }
            ]
        },{
            question: "Which property changes background color?",
            answers: [
                { text: "font-color", correct: false },
                { text: "color", correct: false },
                { text: "text-style", correct: false },
                { text: "background-color", correct: true }
            ]
        },
        {
            question: "What is Flex-direction use for?",
            answers: [
                { text: "To direct the display properties to left or right of the Flex-container", correct: false },
                { text: "All of the above", correct: false },
                { text: "To direct the display properties to top or bottom of the Flex-container", correct: false },
                { text: "To specify the display direction of Flex-item to Flex-container", correct: true }
            ]
        },
        {
            question: "Which is the correct syntax for an ID selector?",
            answers: [
                { text: "#id", correct: true },
                { text: ".id", correct: false },
                { text: "*id", correct: false },
                { text: "&id", correct: false }
            ]
        },
        {
            question: "Absolute Position comprices of what?",
            answers: [
                { text: "Fixed and Static Position", correct: false },
                { text: "Static and Sticky Position", correct: false },
                { text: "Sticky and Relative Position", correct: false },
                { text: "Relative and Fixed Position", correct: true }
            ]
        },
        {
            question: "1One of this is not a Flex Container Properties?",
            answers: [
                { text: "Flex direction", correct: false },
                { text: "Flex location", correct: true },
                { text: "Flex flow", correct: false },
                { text: "Justify content", correct: false }
            ]
        }
    ],
    js: [
        {
            question: "Which keyword declares a variable in JavaScript?",
            answers: [
                { text: "var", correct: false },
                { text: "let", correct: false },
                { text: "const", correct: false },
                { text: "All of the above", correct: true }
            ]
        },{
            question: "What is the output of: console.log(typeof null)?",
            answers: [
                { text: "null", correct: false },
                { text: "object", correct: true },
                { text: "undefined", correct: false },
                { text: "number", correct: false }
            ]
        },
        {
            question: "What does reassignment means)?",
            answers: [
                { text: "a function script", correct: false },
                { text: "object", correct: false },
                { text: "creating a variable inside a const", correct: false },
                { text: "changing the value of a variable after it has already been declared", correct: true }
            ]
        },
        {
            question: "____ is the collection of values where each values is defined as a key value pair ?",
            answers: [
                { text: "null", correct: false },
                { text: "number", correct: false },
                { text: "undefined", correct: false },
                { text: "object", correct: true }
            ]
        },
        {
            question: "What is Node Js?",
            answers: [
                { text: "a life time environment of javascript ", correct: false },
                { text: "a run time environment for javascript", correct: true },
                { text: "is a error lens", correct: false },
                { text: "it makes the website load", correct: false }
            ]
        }
    ]
};

startBtn.addEventListener("click", () => {
    const name = playerNameInput.value.trim();
    if (!name) {
        alert("Please enter your name!");
        return;
    }

    usernameDisplay.textContent = `Player: ${name}`;
    selectContainer.style.display = "none";
    quizSection.style.display = "block";

    shuffledQuestions = [...questions[categorySelect.value]];
    currentQuestionIndex = 0;
    score = 0;

    showQuestion();
    startTimer();
});

function showQuestion() {
    resetState();

    let currentQuestion = shuffledQuestions[currentQuestionIndex];
    let questionNumber = currentQuestionIndex + 1; 
    questionEl.textContent = `${questionNumber}. ${currentQuestion.question}`;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn", "fade-in");
        if (answer.correct) button.dataset.correct = answer.correct;
        button.addEventListener("click", selectAnswer);
        answerBtns.appendChild(button);
    });

    updateProgressBar();
}


function resetState() {
    clearStatusClass(document.body);
    nextBtn.style.display = "none";
    while (answerBtns.firstChild) {
        answerBtns.removeChild(answerBtns.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const correct = selectedBtn.dataset.correct === "true";

    if (correct) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }

    Array.from(answerBtns.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });

    nextBtn.style.display = "block";
    clearInterval(timer);
}


nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion();
        resetTimer();
    } else {
        showResult();
    }
});

function startTimer() {
    timeLeft = 5;
    timerEl.textContent = `Time: ${timeLeft}`;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextBtn.style.display = "block";
            Array.from(answerBtns.children).forEach(btn => btn.disabled = true);
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    startTimer();
}


function updateProgressBar() {
    let progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
    progressFill.style.width = `${progress}%`;
}

function showResult() {
    quizSection.style.display = "none";
    resultScreen.style.display = "block";
    finalScoreEl.textContent = `Your Score: ${score} / ${shuffledQuestions.length}`;

    const percentage = (score / shuffledQuestions.length) * 100;
    if (percentage >= 80) {
        showToast("🎉 Excellent! Well done!", "success");
    } else if (percentage >= 50) {
        showToast("👍 Good effort! Keep practicing!", "excellent");
    } else {
        showToast("😢 Better luck next time!", "poor");
    }
}

function clearStatusClass(element) {
    element.classList.remove("correct");
    element.classList.remove("incorrect");
}
const restartBtn = document.getElementById("restart-btn");
restartBtn.addEventListener("click", restartQuiz);

function restartQuiz() {
    resultScreen.style.display = "none";
    selectContainer.style.display = "block";
    quizSection.style.display = "none";
    playerNameInput.value = "";       
    usernameDisplay.textContent = "";
    progressFill.style.width = "0%";  
    score = 0;
    currentQuestionIndex = 0;
    clearInterval(timer);
    timeLeft = 5;
    timerEl.textContent = "Time: 5";
}
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "show";

    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}