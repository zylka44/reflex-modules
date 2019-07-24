import { makeBoard } from "./board";

const start = document.getElementById('start');
const reset = document.getElementById('reset');
const lifes = document.getElementById('lifes');
const points = document.getElementById('points');
const time = document.getElementById('time');
const info = document.getElementById('alert');
const curtain = document.getElementById('curtain');  //kurtyna zasłaniająca planszę po przegranej
const size = <HTMLInputElement> document.getElementById('size');   //pole, w którym użytkownik wpisuje wymiar planszy
const dimensionButton = document.getElementById('dimensionButton');
let lifesCounter;
let pointsCounter;
let timeCounter;
let gameStatus = false;  //sprawdza, czy trwa gra
let justClicked = false;  //sprawdza, czy kliknięto na zielony kwadrat
let boardDimension = 5;   //aktualny wymiar planszy
let startNumberOfLifes = 3; //początkowa liczba żyć
let startNumberOfSeconds = 60;  //początkowa ilość czasu



//wczytanie wymiaru planszy podanego przez użytkownika
const setDimension = () => {
    if (!gameStatus) {
        //sprawdzenie, czy podany wymiar jest liczbą całkowitą z przedziału <2, 20>
        if (+size.value < 2 || +size.value > 20 || (+size.value % 1 != 0)) {
            gameAlert('purple', 'Podaj liczbę całkowitą większą od 2 i mniejszą od 20.');
        } else {
            boardDimension = +size.value;  
            gameReset();
        };
    };
};



//odliczanie czasu
const countdown = () => {
    let timerCounter = setInterval(() => {
            if (gameStatus) {
                timeCounter--;
                time.innerHTML = timeCounter;
                if (timeCounter <= 0) {
                    clearInterval(timerCounter);
                    gameOver('Koniec czasu!');
                };
            } else {
                clearInterval(timerCounter);
            };
    }, 1000);
};


//losowanie, który kwadrat ma zmienić kolor na zielony
const randomSquare = () => {
    info.innerHTML = '';            
    let randId = 'sq' + Math.floor(Math.random()*(boardDimension*boardDimension));
    document.getElementById(randId).className += " green";
    
    //zamiana koloru z zielonego na biały po 2 sekundach
    setTimeout(() => {
        document.getElementById(randId).className = "square";
        
        //jeśli użytkownik nie kliknął na zielony kwadrat - traci życie
        if (!justClicked) {
            if (gameStatus) {
                lifesCounter -= 1;
                lifes.innerHTML = lifesCounter;
                gameAlert('purple', 'Nie zdążyłeś. Tracisz życie.');
                if (lifesCounter <= 0) {
                    gameOver('Straciłeś wszystkie życia!');
                };
            };
        };

        //po sekundzie następuje kolejne losowanie
        if (gameStatus) {
            setTimeout(() => {
                randomSquare();
            }, 1000);
        };
    }, 2000);

    justClicked = false;
};


//przyznawanie punktów lub utrata życia za kliknięcie w kwadrat
const pointsAndLifesCounter = () => {
    document.getElementById("board").addEventListener("click",(e) => {
        var tgt = <HTMLElement> e.target;
        if (!tgt.classList.contains("square")) return;

        //przyznanie punktu za kliknięcie w zielony kwadrat
        if (tgt.classList.contains("green")) {
            if (!justClicked) {
                justClicked = true;
                pointsCounter += 1;
                points.innerHTML = pointsCounter;
                gameAlert('green', 'Punkt dla Ciebie!');
            };
        }

        //odjęcie życia za kliknięcie w biały kwadrat
        else {
            if (gameStatus) {
                lifesCounter -= 1;
                lifes.innerHTML = lifesCounter;
                gameAlert('purple', 'Biały kwadrat. Tracisz życie.');
                if (lifesCounter <= 0) {
                    gameOver('Straciłeś wszystkie życia!');
                };
            };
        };
    });
};


//wyświetlanie alertu
const gameAlert = (messageColor, message) => {
    info.style.color = messageColor;
    info.innerHTML = message;
};


//reset gry
const gameReset = () => {
    makeBoard(boardDimension);

    lifesCounter = startNumberOfLifes;
    pointsCounter = 0;
    timeCounter = startNumberOfSeconds;

    lifes.innerHTML = lifesCounter;
    points.innerHTML = pointsCounter;
    time.innerHTML = timeCounter;

    gameStatus = false;
    justClicked = false;

    gameAlert('green', 'Złap zielony kwadrat!');
    curtain.style.display = 'none';
};


//start gry
const gameStart = () => {
    if (!gameStatus) {
        gameReset();
        gameStatus = true;
        countdown();
        randomSquare();
    };
};


//koniec gry
const gameOver = message => {
    gameAlert('purple', message);
    curtain.style.display = 'block';
    curtain.style.height = `${52*boardDimension}px`;
    gameStatus = false;
};



//GŁÓWNA CZĘŚĆ PROGRAMU
lifes.innerHTML = startNumberOfLifes.toString();   //wczytanie liczby żyć
time.innerHTML = startNumberOfSeconds.toString();  //wczytanie ilości czasu

makeBoard(boardDimension);              //utworzenie planszy

pointsAndLifesCounter();                //uruchomienie licznika punktów i żyć

start.onclick = () => {gameStart()};    //uruchamianie przycisku START

reset.onclick = () => {gameReset()};    //uruchamianie przycisku RESET

dimensionButton.onclick = () => {setDimension()};   //ustawienie rozmiaru planszy przyciskiem USTAW