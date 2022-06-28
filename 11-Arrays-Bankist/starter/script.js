'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const loginForm = document.querySelector('.login')
const closeAccountForm = document.querySelector('.form--close')
const transferMoneyForm = document.querySelector('.form--transfer')
const loanForm = document.querySelector('.form--loan')
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// APP
function authenticate(username, pin) {
    for (let account of accounts) {
        const usernameExists = username === account.username
        const pinCorrect = pin === String(account.pin)
        if (usernameExists && pinCorrect) {
            currentAccount = account
            return true
        }
    }
    return false
}

function handleLoginFormSubmit(evt) {
    evt.preventDefault()
    const formData = new FormData(evt.target);
    authenticate(formData.get('user'), formData.get('password'))
    if (currentAccount) {
        evt.target.reset()
        evt.target.blur()
        initApp()
    } else {
        alert("Username or password incorrect")
    }
}

function handleAccountCloseFormSubmit(evt) {
    evt.preventDefault()
    const formData = new FormData(evt.target)
    if (formData.get('user') === currentAccount.username && formData.get('password') === String(currentAccount.pin)) {
        const index = accounts.findIndex(acc => acc === currentAccount)
        if (index >= 0) {
            accounts.splice(index, 1)
            logoutCurrentAccount()
        }
    } else {
        alert("Invalid username or password")
    }
}

function updateDate() {
    const now = new Date()
    console.log("updating date", now)
    setTimeout(updateDate, (60 - now.getSeconds()) * 1000)
    labelDate.textContent = String(now.getDate()).padStart(2, '0') + '/' + String(now.getMonth() + 1).padStart(2, '0') + '/' + String(now.getFullYear())
}

function initApp() {
    containerApp.style.opacity = '1'
    displayMovements(currentAccount)
    calculateSummary(currentAccount)
    initTimer()
}

function displayMovements(account, sorted = false) {
    containerMovements.innerHTML = ''
    let movements
    if (sorted) {
        movements = account.movements.slice().sort((a, b) => a - b)
    } else {
        movements = account.movements
    }
    movements.forEach((value, index) => {
        const type = value > 0 ? 'deposit' : 'withdrawal'
        const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
          <div class="movements__value">${value}€</div>
        </div>`
        containerMovements.insertAdjacentHTML('afterbegin', html)
    })
}

function calculateSummary(account) {
    // in
    const totalIn = account.movements.filter(v => v > 0).reduce((a, b) => a + b)
    labelSumIn.textContent = String(totalIn) + '€'
    // out
    const totalOut = account.movements.filter(v => v < 0).reduce((a, b) => a + b)
    labelSumOut.textContent = String(totalOut) + '€'
    // balance
    labelBalance.textContent = String(totalIn + totalOut) + "€"
    // interest
    const interest = account.movements
        .filter(v => v > 0)
        .map(v => v * account.interestRate / 100)
        .filter(v => v >= 1)
        .reduce((a, b) => a + b, 0)
    labelSumInterest.textContent = String(interest) + "€"
}

function handleTransferFormSubmit(evt) {
    evt.preventDefault()
    const formData = new FormData(evt.target)
    const username = formData.get("username")
    const amount = Number(formData.get("amount"))
    const account = accounts.find(acc => acc.username === username)
    if (account && amount > 0) {
        account.movements.push(amount)
        currentAccount.movements.push(-amount)
        displayMovements(currentAccount, sorted)
        calculateSummary(currentAccount)
    } else if (!account) {
        alert(`Account with username ${username} does not exist`)
    } else if (amount <= 0) {
        alert("Amount must be positive")
    }
}

function handleRequestLoanFormSubmit(evt) {
    evt.preventDefault()
    const formData = new FormData(evt.target)
    const amount = Number(formData.get("amount"))
    if (currentAccount.movements.some(val => val >= amount * 0.1)) {
        currentAccount.movements.push(amount)
        displayMovements(currentAccount)
        calculateSummary(currentAccount)
    } else {
        alert("The allowed amount can not exceed 10 times the value of the highest transfer")
    }
}

function logoutCurrentAccount() {
    containerApp.style.opacity = '0'
    currentAccount = null
}

function updateTimer(t) {
    const minutes = Math.floor(t / 60)
    const seconds = t % 60
    labelTimer.textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0')
}

/*after 1 min of inactivity, the user will be logged out*/
function setLogoutInterval() {
    let timeToLogout = 60 // seconds
    const myInterval = setInterval(() => {
        if (timeToLogout <= 0) {
            console.log("logging out")
            logoutCurrentAccount(currentAccount)
            clearInterval(myInterval)
        } else {
            timeToLogout--
            updateTimer(timeToLogout)
        }
    }, 1000)
    return myInterval
}

function initTimer() {
    let logoutInterval = setLogoutInterval()
    document.querySelector('body').addEventListener('click', () => {
        clearInterval(logoutInterval)
        logoutInterval = setLogoutInterval()
    })
}

let currentAccount
let sorted = false
updateDate()
accounts.forEach(acc => {
    acc.username = acc.owner.split(' ').map(i => i.at(0).toLowerCase()).join('')
})

loginForm.addEventListener('submit', handleLoginFormSubmit)
closeAccountForm.addEventListener('submit', handleAccountCloseFormSubmit)
transferMoneyForm.addEventListener('submit', handleTransferFormSubmit)
loanForm.addEventListener('submit', handleRequestLoanFormSubmit)
btnSort.addEventListener('click', () => {
    displayMovements(currentAccount, !sorted)
    sorted = !sorted
})
