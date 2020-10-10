//My buttons
var startBtn = document.getElementById('start-quiz');
var highscoresBtn = document.getElementById('highscore-link');
var homeBtn = document.getElementById('home-btn');
var clearHighscoresBtn = document.getElementById('clear-scores');
var submitHighscoreBtn = document.getElementById('submit-score')

//My screens
var homeScreen = document.querySelector('.start-screen');
var finishScreen = document.querySelector('.finish-screen');
var highscoreScreen = document.querySelector('.highscore-screen');
var questionScreen = document.querySelector('.question-screen');

//My updating items
var highscores = document.querySelector('.highscores');
var questionTitle = document.querySelector('.question-title');
var questionAnswers = document.querySelector('.question-answers');
var timeLeftEl = document.querySelector('#time-left');
var resultEl = document.querySelector('#result'); //Final quiz result element
var feedbackEl = document.querySelector('#feedback'); //Feedback div
var questionResultEl = document.querySelector('#questionResult'); //Result of chosen answer

//My variables
var quizLength = 10; //Number of questions
var correctItems = 0; //How many they got right
var currentQuiz = [];
var currentQuestion = 0;
var quizTimeLimit = 60; //In seconds
var timeElapsed = 0;
var timer;
var feedbackTiemout; //Allows me to reset if they click answeres to quickly
//Get the highscores from localStorage, if it's not there set this to a blank array
var highscoresList = JSON.parse(localStorage.getItem("highscores")) || [];

//Initials input
var initialsInput = document.getElementById("initials");

//Start the quiz
function startQuiz() {
    //Get random questions up to the quiz list length (No duplicates)
    var tempArray = [...quiz];
    currentQuiz = [];
    timeElapsed = 0;
    currentQuestion = 0;
    correctItems = 0;

    for(var i = 0; i < quizLength; i++)
    {
        //Get a random box within the tempArray length
        var randomBox = Math.floor(Math.random() * tempArray.length);

        //Add it to the current quiz
        currentQuiz.push(tempArray[randomBox]);

        //Remove one element starting from current selected item
        tempArray.splice(randomBox, 1);
    }

    //Put them on the first question
    showQuestion();
    getCurrentQuestion();

    //Start the timer
    timer = setInterval(function () {
        timeElapsed++;
        displayTime()
        if(timeElapsed >= quizTimeLimit)
            endQuiz();
	}, 1000);
}

//Clear the question screen and add the new question
function getCurrentQuestion() {
    var quizItem = currentQuiz[currentQuestion];
    questionTitle.textContent = "Question " + (currentQuestion + 1) + ": " + quizItem.question;
    questionAnswers.innerHTML = '';
    //Display each new answer
    quizItem.possibleAnswers.forEach((item, index) => {
        var questionAnswer = document.createElement("div");
        var questionAnswerContent = document.createElement("a");
        questionAnswerContent.textContent = (index + 1) + ". " + item;
        questionAnswerContent.setAttribute('value', index);
        questionAnswerContent.classList.add('answer');
        questionAnswer.append(questionAnswerContent);
        questionAnswers.append(questionAnswer);
    });
}

//Get the answer and go to the next question
function answerQuestion(event) {
    var chosenAnswer = parseInt(event.target.getAttribute('value'));
    var questionResult = 'Wrong...';
    if(chosenAnswer === currentQuiz[currentQuestion].correctAnswer)
    {
        correctItems++;
        questionResult = "Correct!";
        nextQuestion();
    }
    else
    {
        timeElapsed += 10;
    }

    questionResultEl.textContent = questionResult;

    showFeedback();
}

//Go to the next question, if there are no more questions end the quiz
function nextQuestion() {
    currentQuestion++;
    if(currentQuestion == currentQuiz.length)
    {
        endQuiz();
        return;
    }
    getCurrentQuestion();
}

//End the quiz
function endQuiz() {
    //Stop the timer
    window.clearInterval(timer);
    //Calculate score
    //If time left is < 0 set it to zero
    var displayTimeLeft = quizTimeLimit - timeElapsed < 0 ? 0 : quizTimeLimit - timeElapsed;

    resultEl.textContent = "You got " + correctItems + " right out of " + quizLength + " and finished with " + displayTimeLeft + " second(s) to spare";
    showFinishScreen()
}

//Take the initials and add them to the highscore
function submitHighscore() {
    var initials = initialsInput.value || 'anonymous';
    var highScore = {
        initials: initials,
        percentage: correctItems / quizLength, 
        timeLeft: (quizTimeLimit - timeElapsed < 0 ? 0 : quizTimeLimit - timeElapsed),
    }

    highscoresList.push(highScore);
    sortHighscores();
    localStorage.setItem("highscores", JSON.stringify(highscoresList));
    showHighscores();
}

//Sort the highscores by percentage, timeLeft, and initials
function sortHighscores() {
    highscoresList = highscoresList.sort((a, b) => {
        if(a.percentage > b.percentage)
            return -1;
        if(a.percentage < b.percentage)
            return 1;
        if(a.timeLeft > b.timeLeft)
            return -1;
        if(a.timeLeft < b.timeLeft)
            return 1;
        if(a.initials < b.initials)
            return -1;
        if(a.initials > b.initials)
            return 1;
        return 0;
    });
}

function populateHighscores() {
    highscores.innerHTML = '';
    highscoresList.forEach((item, i) => {
        var highscore = document.createElement("div");
        highscore.textContent = (i + 1) + ". " + item.initials + " " + (item.percentage * 100) + "% Time Left: " + item.timeLeft;  
        highscores.append(highscore);
    })
}

//Hide other screens and show highscores
function showHighscores() {
    populateHighscores();
    homeScreen.classList.add('d-none');
    finishScreen.classList.add('d-none');
    questionScreen.classList.add('d-none');
    highscoreScreen.classList.remove('d-none');
}

//Hide other screens and show home
function showHome() {
    highscoreScreen.classList.add('d-none');
    finishScreen.classList.add('d-none');
    questionScreen.classList.add('d-none');
    homeScreen.classList.remove('d-none');
}

//Hide other screens and show question screen
function showQuestion() {
    homeScreen.classList.add('d-none');
    finishScreen.classList.add('d-none');
    highscoreScreen.classList.add('d-none');
    questionScreen.classList.remove('d-none');
}

//Hide other screens and show finish screen;
function showFinishScreen() {
    homeScreen.classList.add('d-none');
    highscoreScreen.classList.add('d-none');
    questionScreen.classList.add('d-none');
    finishScreen.classList.remove('d-none');
}

//Show the feedback 
function showFeedback() {
    feedbackEl.classList.remove('d-none');
    feedbackTimeout = setTimeout(() => {
        feedbackEl.classList.add('d-none');
    }, 2000);
}

//Clear Highscores
function clearHighscores() {
    highscores.innerHTML = '';
    highscoresList = [];
    localStorage.removeItem('highscores');
}

function displayTime() {
    var timeLeft = quizTimeLimit - timeElapsed;
    //if timeleft is less than zero set it to 0 instead of a negative number
    timeLeft = timeLeft < 0 ? 0 : timeLeft;
	timeLeftEl.textContent = timeLeft;
}

//Start us off
showHome();

//Awesome event listeners
startBtn.addEventListener("click", startQuiz);
highscoresBtn.addEventListener("click", showHighscores);
homeBtn.addEventListener("click", showHome);
clearHighscoresBtn.addEventListener("click", clearHighscores);
questionAnswers.addEventListener("click", answerQuestion);
submitHighscoreBtn.addEventListener("click", submitHighscore);

var quiz = [
    {
        question: "Inside which HTML element do we put the JavaScript?",
        possibleAnswers: ['<javascript>', '<script>', '<scripting>', '<js>'],
        correctAnswer: 1,
    },
    {
        question: "What is the correct JavaScript syntax to change the content of the HTML element below?\n\n" + 
            "<p id='demo'>This is a demonstration.</p>",
        possibleAnswers: [' document.getElementById("demo").innerHTML = "Hello World!";', ' document.getElement("p").innerHTML = "Hello World!";', ' #demo.innerHTML = "Hello World!";', ' document.getElementByName("p").innerHTML = "Hello World!";'],
        correctAnswer: 0,
    },
    {
        question: "Where is the correct place to insert a JavaScript?",
        possibleAnswers: ['The <body> section', 'Both the <head> section and the <body> section are correct', 'The <head> section'],
        correctAnswer: 1,
    },
    {
        question: 'What is the correct syntax for referring to an external script called "xxx.js"?',
        possibleAnswers: ['<script src="xxx.js">', '<script href="xxx.js">', '<script name="xxx.js">'],
        correctAnswer: 0,
    },
    {
        question: 'The external JavaScript file must contain the <script> tag.',
        possibleAnswers: ['True', 'False'],
        correctAnswer: 1,
    },
    {
        question: 'How do you write "Hello World" in an alert box?',
        possibleAnswers: ['alert("Hello World");', 'msg("Hello World");', 'alertBox("Hello World");', 'msgBox("Hello World");'],
        correctAnswer: 0,
    },
    {
        question: 'How do you create a function in JavaScript?',
        possibleAnswers: ['function = myFunction()', 'function myFunction()', 'function:myFunction()'],
        correctAnswer: 1,
    },
    {
        question: 'How do you call a function named "myFunction"?',
        possibleAnswers: ['myFunction()', 'call myFunction', 'call function myFunction()'],
        correctAnswer: 0,
    },
    {
        question: 'How to write an IF statement in JavaScript?',
        possibleAnswers: ['if (i == 5)', ' if i == 5 then', 'if i = 5 then', 'if i = 5'],
        correctAnswer: 0,
    },
    {
        question: 'How to write an IF statement for executing some code if "i" is NOT equal to 5?',
        possibleAnswers: ['if i <> 5', 'if i =! 5 then', 'if (i != 5)', 'if (i <> 5)'],
        correctAnswer: 2,
    },
    {
        question: 'How does a WHILE loop start?',
        possibleAnswers: ['while i = 1 to 10', 'while (i <= 10)', 'while (i <= 10; i++)'],
        correctAnswer: 1,
    },
    {
        question: 'How does a FOR loop start?',
        possibleAnswers: ['for (i <= 5; i++)', 'for (i = 0; i <= 5; i++)', 'for (i = 0; i <= 5)', 'for i = 1 to 5'],
        correctAnswer: 1,
    },
    {
        question: 'How can you add a comment in a JavaScript?',
        possibleAnswers: ['\'This is a comment', '//This is a comment', '<!-- This is a comment -->'],
        correctAnswer: 1,
    },
    {
        question: 'How to insert a comment that has more than one line?',
        possibleAnswers: ['/* This comment has \n more than one line */', '//This comment has \n more than one line//', '<!-- This comment has \n more than one line-->'],
        correctAnswer: 0,
    },
    {
        question: 'What is the correct way to write a JavaScript array?',
        possibleAnswers: ['var color = 1:"red", 2:"green", 3:"blue"', 'var colors = "red", "green", "blue"', 'var colors = 1 = ("red"), 2 = ("green"), 3 = ("blue")', 'var colors = ["red", "green", "blue"]'],
        correctAnswer: 3,
    },
    {
        question: 'How do you round the number 7.25, to the nearest integer?',
        possibleAnswers: ['Math.rnd(7.25)', 'Math.round(7.25)', 'round(7.25)', 'rnd(7.25)'],
        correctAnswer: 1,
    },
    {
        question: 'What is the correct JavaScript syntax for opening a new window called "w2" ?',
        possibleAnswers: ['w2 = window.open("http://www.w3schools.com");', 'w2 = window.new("http://www.w3schools.com");'],
        correctAnswer: 0,
    },
    {
        question: 'JavaScript is the same as Java.',
        possibleAnswers: ['True', 'False'],
        correctAnswer: 1,
    },
    {
        question: 'How can you detect the client\'s browser name?',
        possibleAnswers: ['navigator.appName', 'client.navName', 'browser.name'],
        correctAnswer: 0,
    },
    {
        question: 'Which event occurs when the user clicks on an HTML element?',
        possibleAnswers: ['onmouseclick', 'onchange', 'onmouseover', 'onclick'],
        correctAnswer: 3,
    },
    {
        question: 'How do you declare a JavaScript variable?',
        possibleAnswers: ['v carName;', 'var carName;', 'variable carName;'],
        correctAnswer: 0,
    },
    {
        question: 'Which operator is used to assign a value to a variable?',
        possibleAnswers: ['=', '*', '-', '=='],
        correctAnswer: 0,
    },
    {
        question: 'What will the following code return: Boolean(10 > 9)',
        possibleAnswers: ['true', 'NaN', 'false'],
        correctAnswer: true,
    },
    {
        question: 'Is JavaScript case-sensitive?',
        possibleAnswers: ['Yes', 'No'],
        correctAnswer: 0,
    },
];
