window.addEventListener('load', init);

// Globals
let timeCalc = 30;
let time = 30;
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
const ten = document.querySelector('#ten-s');
const thirty = document.querySelector('#thirty-s');
const sixty = document.querySelector('#sixty-s');
const activeButton = document.querySelector('button.active');

ten.addEventListener('click', function() {
    document.querySelector('button.active').setAttribute("class", "");
    ten.setAttribute("class", "active");
    timeCalc = 10;
    time = 10;
});

thirty.addEventListener('click', function() {
    document.querySelector('button.active').setAttribute("class", "");
    thirty.setAttribute("class", "active");
    timeCalc = 30;
    time = 30;
});

sixty.addEventListener('click', function() {
    document.querySelector('button.active').setAttribute("class", "");
    sixty.setAttribute("class", "active");
    timeCalc = 60;
    time = 60;
});

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
    // Add a reset button
    reset();
}

// Pick random word
function createWords(words) {
    // Random array index
    let ranIndex;
    // Output word to html and array
    for (i = 0; i < 180; i++) {
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
            var rect = current.getBoundingClientRect();
            var x = current.nextSibling.getBoundingClientRect();

            if (rect.top !== x.top) {
                wordBox.scrollBy(0, 39);
            }

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
    } else if (!isPlaying) {
        time += 1;
        setInterval(countdown, 1000);
        setInterval(checkStatus, 50);
        progress(time, time, $('#timeBar'))
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
    const wpm = Math.round(correctLetters.length / 4.79 / timeCalc * 60);
    wordPM.innerHTML = `${wpm}`;
    const rawString = inputHistory.join("");
    const rawwpm = Math.round(rawString.length / 4.79 / timeCalc * 60);
    rawWordPM.innerHTML = `${rawwpm}`;
    const percentCorrect = Math.floor(wpm/rawwpm * 100);
    percentDiv.innerHTML = `${percentCorrect} %`;
    const numCharacters = rawString.length - correctLetters.length;
    characterStat.innerHTML = `${correctLetters.length} / ${numCharacters}`;
    timeStat.innerHTML = timeCalc;
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