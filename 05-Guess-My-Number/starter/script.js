'use strict';

let number, score
let highscore = 0
const messageNode = document.querySelector('.message')
const scoreNode = document.querySelector('.score')
const numberNode = document.querySelector('.number')
const bodyNode = document.querySelector('body')
const highscoreNode = document.querySelector('.highscore')

function initGame() {
    number = Math.trunc(Math.random() * 20) + 1
    score = 20
    numberNode.textContent = '?'
    bodyNode.style.backgroundColor = '#222'
    messageNode.textContent = 'Start guessing...'
    scoreNode.textContent = String(score)
    document.querySelector('.guess').value = null
}

initGame()

document.querySelector('.check').addEventListener('click', () => {
    if (score <= 0) return
    const guess = Number(document.querySelector('.guess').value)
    if (!guess) {
        messageNode.textContent = "⛔ No number!"
    } else if (guess === number) {
        messageNode.textContent = "🥳 Correct Number!"
        numberNode.textContent = number
        bodyNode.style.backgroundColor = '#60b347'
        if (score > highscore) {
            highscore = score
            highscoreNode.textContent = highscore
        }
    } else if (guess > number) {
        messageNode.textContent = "📈 Too high"
        score--
        scoreNode.textContent = String(score)
    } else if (guess < number) {
        messageNode.textContent = "📉 Too low"
        score--
        scoreNode.textContent = String(score)
    }
    if (score === 0) messageNode.textContent = "💥 Game Over!"
})
document.querySelector('.again').addEventListener('click', () => {
    initGame()
})