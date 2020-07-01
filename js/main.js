window.addEventListener('load', init);

// Globals
let time = null;
let isPlaying = false;
let randomWords = [];
let activeWord;
let ranPosition = 0;
let inputHistory = [];
let correctLetters = [];

// DOM Elements
const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const message = document.querySelector('#message');
const wordBox = document.querySelector('#words');
const wordPM = document.querySelector('#wpm');
const rawWordPM = document.querySelector('#rawwpm');
const percentDiv = document.querySelector('#percent');
const characterStat = document.querySelector('#characters');
const timeStat = document.querySelector('#timeValue');
const allWordContainter = document.querySelector('#type');
const allStats = document.querySelector('#variables');

// Inititalize Game
function init() {
    $(document).ready(function(){
        $('#words').css('display', 'none').fadeIn(400);
    });
    // Load words from array
    createWords(words);
    wordInput.addEventListener('input', startTimer);
    // Start matching
    wordInput.addEventListener('input', startMatch);
    // Call countdown every second
    setInterval(countdown, 1000);
    // Check game status
    setInterval(checkStatus, 50);
    // Add a reset button
    reset();
}

// Pick random word
function createWords(words) {
    // Random array index
    let ranIndex;
    // Output word to html and array
    for (i = 0; i < 40; i++) {
        ranIndex = Math.floor(Math.random() * words.length);
        let wordCreated = words[ranIndex];
        var node = document.createElement("div"); // Create a <span> element
        randomWords.push(wordCreated);
        if (i == 0) {
            node.setAttribute("class", "word-active")
        } else {
            node.setAttribute("class", "word");
        }
        wordBox.appendChild(node);
        for (j = 0; j < wordCreated.length; j++){
            let letter = wordCreated.charAt(j); // Create individual letter 
            var letterNode = document.createElement("letter"); // Create letter element 
            var letterTextNode = document.createTextNode(letter); // Create text element for that element
            letterNode.appendChild(letterTextNode); // Append text to letter element
            node.appendChild(letterNode); // Append letter element to div element
        }
    }
    console.log(randomWords);
}


// Start matching
function startMatch() {
    if (isPlaying){
        matchWords();
    }
}

function matchWords() {
    allWords = document.getElementsByClassName("word");
    activeWord = document.querySelector(".word-active").querySelectorAll("letter");
    borderWord = document.querySelector(".word-active");
    inputChar = wordInput.value;
    let letterPosition = 0;

    const compare = () => {
        if (inputChar.length < activeWord.length) {
            for (j = inputChar.length; j < activeWord.length; j++) {
                activeWord[j].style.opacity = 0.5;
                activeWord[j].style.color = "#FBF1D8";
                activeWord[j].style.borderBottom = "";
            }
        }
    }

    do {
        if(inputChar.charAt(letterPosition) == activeWord[letterPosition].innerHTML){
            activeWord[letterPosition].style.opacity = 0.9;
            activeWord[letterPosition].style.color = "#FBF1D8";
            activeWord[letterPosition].style.borderBottom = "";
            compare();
        } else if (inputChar.charAt(letterPosition) !== activeWord[letterPosition].innerHTML){
            activeWord[letterPosition].style.opacity = 0.9; 
            activeWord[letterPosition].style.color = "#7A7669";
            activeWord[letterPosition].style.borderBottom = "2px solid #7A7669"; 
            compare();
        }
        letterPosition++; 
    } while (letterPosition < inputChar.length);

    document.body.onkeypress = function(e){
        var e = window.event || e;
        if(isPlaying && e.keyCode == 32){
            var current = document.querySelector(".word-active");
            current.className = current.className.replace("-active", "");
            allWords[ranPosition + 1].className += "-active";
            inputHistory.push(wordInput.value);
            for (y = 0; y < inputChar.length; y++) {
                if (inputChar.charAt(y) == randomWords[ranPosition][y]) {
                    correctLetters.push(inputChar.charAt(y));
                }
            }
            wordInput.value = "";
            ranPosition++;
            return false;
        }
    } 
}

// Countdown timer
function startTimer() {
    if (isPlaying) {
        return;
    } else if (!isPlaying && time == null) {
        time = 31;
        progress(30, 30, $('#timeBar'))
        return isPlaying = true;
    } else {
        wordInput.disabled = "disabled";
    }
}

function countdown() {
    if(time > 0) {
        time--;
    } else if (time === 0) {
        isPlaying = false;
    }
}

function progress(timeleft, timetotal, $element) {
    var progressBarWidth = timeleft * $element.width() / timetotal;
    $element
        .find('div')
        .animate({ width: progressBarWidth }, 500)
    if(timeleft > 0) {
        setTimeout(function() {
            progress(timeleft - 1, timetotal, $element);
        }, 1000);
    }
};

// Check game status
function checkStatus() {
    if (!isPlaying && time === 0) {
        calculateResults();
        wordInput.disabled = "disabled";
    }
}

// Calculate results
function calculateResults() {
    allWordContainter.style.display = "none";
    $("#variables").fadeTo("slow", 1);
    const wpm = Math.round(correctLetters.length / 4.79 / 30 * 60);
    wordPM.innerHTML = `${wpm}`;
    const rawString = inputHistory.join("");
    const rawwpm = Math.round(rawString.length / 4.79 / 30 * 60);
    rawWordPM.innerHTML = `${rawwpm}`;
    const percentCorrect = Math.round(wpm/rawwpm * 100);
    percentDiv.innerHTML = `${percentCorrect} %`;
    const numCharacters = rawString.length - correctLetters.length;
    characterStat.innerHTML = `${correctLetters.length} / ${numCharacters}`;
    timeStat.innerHTML = '30';
}

// Reset function
function reset() {
    $(document).keydown(function(objEvent) {
        if (objEvent.keyCode == 9) {  //tab pressed
            objEvent.preventDefault(); // stops its action
            window.location.reload();
        }
    })
}