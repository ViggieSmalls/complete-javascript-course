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
const App = (function (accounts) {
  const State = {
    accounts: enrichAccounts(accounts),
    currentAccount: null,
    sorted: false,
    timeToLogout: 60,  // seconds
    logoutInterval: null
  }

  function enrichAccounts(accounts) {
    return accounts.map(acc => {
      acc.username = acc.owner.split(' ').map(i => i.at(0).toLowerCase()).join('')
      return acc
    })
  }

  function displayTimeUntilLogout(t) {
    const minutes = Math.floor(t / 60)
    const seconds = t % 60
    labelTimer.textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0')
  }

  function resetLogoutInterval() {
    if (!State.currentAccount) return
    clearInterval(State.logoutInterval)
    State.timeToLogout = 60 // seconds
    State.logoutInterval = setInterval(() => {
      if (State.timeToLogout <= 0) {
        logout()
      } else {
        State.timeToLogout--
        displayTimeUntilLogout(State.timeToLogout)
      }
    }, 1000)
  }

  function authenticate(username, pin) {
    for (let account of State.accounts) {
      const usernameExists = username === account.username
      const pinCorrect = pin === String(account.pin)
      if (usernameExists && pinCorrect) {
        return account
      }
    }
    return null
  }

  function displayMovements() {
    containerMovements.innerHTML = ''
    let movements
    if (State.sorted) {
      movements = State.currentAccount.movements.slice().sort((a, b) => a - b)
    } else {
      movements = State.currentAccount.movements
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

  function calculateSummary() {
    // in
    const totalIn = State.currentAccount.movements.filter(v => v > 0).reduce((a, b) => a + b)
    labelSumIn.textContent = String(totalIn) + '€'
    // out
    const totalOut = State.currentAccount.movements.filter(v => v < 0).reduce((a, b) => a + b)
    labelSumOut.textContent = String(totalOut) + '€'
    // balance
    labelBalance.textContent = String(totalIn + totalOut) + "€"
    // interest
    const interest = State.currentAccount.movements
      .filter(v => v > 0)
      .map(v => v * State.currentAccount.interestRate / 100)
      .filter(v => v >= 1)
      .reduce((a, b) => a + b, 0)
    labelSumInterest.textContent = String(interest) + "€"
  }

  function draw() {
    containerApp.style.opacity = '1'
    displayMovements()
    calculateSummary()
    resetLogoutInterval()
  }

  function handleLoginFormSubmit(evt) {
    evt.preventDefault()
    const formData = new FormData(evt.target);
    const account = authenticate(formData.get('user'), formData.get('password'))
    if (account) {
      State.currentAccount = account
      evt.target.reset()
      evt.target.blur()
      draw()
    } else {
      alert("Username or password incorrect")
    }
  }

  function handleAccountCloseFormSubmit(evt) {
    evt.preventDefault()
    const formData = new FormData(evt.target)
    if (formData.get('user') === State.currentAccount.username && formData.get('password') === String(State.currentAccount.pin)) {
      const index = State.accounts.findIndex(acc => acc === State.currentAccount)
      if (index >= 0) {
        State.accounts.splice(index, 1)
        logout()
        evt.target.reset()
      }
    } else {
      alert("Invalid username or password")
    }
  }

  function handleRequestLoanFormSubmit(evt) {
    evt.preventDefault()
    const formData = new FormData(evt.target)
    const amount = Number(formData.get("amount"))
    if (State.currentAccount.movements.some(val => val >= amount * 0.1)) {
      State.currentAccount.movements.push(amount)
      displayMovements()
      calculateSummary()
      evt.target.reset()
    } else {
      alert("The allowed amount can not exceed 10 times the value of the highest transfer")
    }
  }

  function handleTransferFormSubmit(evt) {
    evt.preventDefault()
    const formData = new FormData(evt.target)
    const username = formData.get("username")
    const amount = Number(formData.get("amount"))
    const account = State.accounts.find(acc => acc.username === username)
    if (account && amount > 0) {
      account.movements.push(amount)
      State.currentAccount.movements.push(-amount)
      displayMovements()
      calculateSummary()
      evt.target.reset()
    } else if (!account) {
      alert(`Account with username ${username} does not exist`)
    } else if (amount <= 0) {
      alert("Amount must be positive")
    }
  }

  function displayDateAsString(date) {
    return String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + String(date.getFullYear())
  }

  /* updates the date displayed on the screen. updates every minute*/
  function updateDate() {
    const now = new Date()
    labelDate.textContent = displayDateAsString(now)
    setTimeout(updateDate, (60 - now.getSeconds()) * 1000)
  }

  function logout() {
    containerApp.style.opacity = '0'
    State.currentAccount = null
  }

  function init() {
    updateDate()
    // forms
    loginForm.addEventListener('submit', handleLoginFormSubmit)
    closeAccountForm.addEventListener('submit', handleAccountCloseFormSubmit)
    transferMoneyForm.addEventListener('submit', handleTransferFormSubmit)
    loanForm.addEventListener('submit', handleRequestLoanFormSubmit)
    // sort movements
    btnSort.addEventListener('click', () => {
      State.sorted = !State.sorted
      displayMovements()
    })
    //
    document.querySelector('body').addEventListener('click', resetLogoutInterval)
  }

  return {init}
})(accounts)

App.init()
