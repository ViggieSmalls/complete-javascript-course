'use strict';

let currentPlayer = 0  // always starts with player 1

/*generate random number from 1 to 6 and display the rolled value*/
function rollDice() {
    const number = Math.trunc(Math.random() * 6) + 1
    document.querySelector('img.dice').src = `dice-${number}.png`
    return number
}

/*initialize game
* - set scores to 0
* - set player 1 as starting player*/
function initGame() {
    document.getElementById('score--0').textContent = '0'
    document.getElementById('current--0').textContent = '0'
    document.getElementById('score--1').textContent = '0'
    document.getElementById('current--1').textContent = '0'
    currentPlayer = 0
    document.querySelector('.btn--roll').addEventListener('click', handleButtonRoll)
    document.querySelector('.btn--hold').addEventListener('click', handleButtonHold)

    if (document.querySelector(`.player--winner`)) {
        // we might restart game without a winner
        document.querySelector(`.player--winner`).classList.remove('player--winner')
    }
    document.querySelector(`.player--0`).classList.add('player--active')
    document.querySelector(`.player--1`).classList.remove('player--active')
}

function getPlayerScore(player) {
    return Number(document.getElementById(`score--${player}`).textContent)
}

function setPlayerScore(player, score) {
    document.getElementById(`score--${player}`).textContent = String(score)
}

/*save current player's score and switch player*/
function holdScore(player, amount) {
    if (amount === 0) return
    const newScore = getPlayerScore(player) + amount
    setPlayerScore(player, newScore)
}

/*if a player has more than 100 points, then it is true*/
function checkWinningCondition(player) {
    return getPlayerScore(player) >= 100
}

/*freeze game when one of the player won*/
function gameOver() {
    document.querySelector('.btn--roll').removeEventListener('click', handleButtonRoll)
    document.querySelector('.btn--hold').removeEventListener('click', handleButtonHold)
}

/*switch player. It's now the other player's turn*/
function switchPlayer() {
    document.getElementById(`current--${currentPlayer}`).textContent = '0'
    document.querySelector(`.player--${currentPlayer}`).classList.remove('player--active')
    currentPlayer = currentPlayer ^ 1
    document.querySelector(`.player--${currentPlayer}`).classList.add('player--active')
}

function getCurrentScoreForPlayer(player) {
    return Number(document.getElementById(`current--${player}`).textContent)
}

function increaseCurrentScoreForPlayer(player, amount) {
    const newScore = getCurrentScoreForPlayer(player) + amount
    document.getElementById(`current--${player}`).textContent = String(newScore)
}

function handleButtonRoll() {
    const number = rollDice();
    if (number === 1) {
        holdScore(currentPlayer, 0)
        switchPlayer()
    } else {
        increaseCurrentScoreForPlayer(currentPlayer, number)
    }
}

function handleButtonHold() {
    holdScore(currentPlayer, getCurrentScoreForPlayer(currentPlayer))
    if (checkWinningCondition(currentPlayer)) {
        gameOver()
        document.querySelector(`.player--${currentPlayer}`).classList.add('player--winner')
    } else {
        switchPlayer()
    }
}

document.querySelector('.btn--new').addEventListener('click', initGame)
initGame()
