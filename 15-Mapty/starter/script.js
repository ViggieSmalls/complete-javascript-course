'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
const allPositive = (...inputs) => inputs.every(inp => inp > 0);

class Workout {
  date = new Date()
  id = String(Date.now())

  constructor(distance, duration, coords) {
    this.distance = distance
    this.duration = duration
    this.coords = coords  // [lat, long]
  }
}

class Running extends Workout {
  type = 'running'

  constructor(distance, duration, coords, cadence) {
    super(distance, duration, coords)
    this.cadence = cadence
  }

  get pace() {
    // min/km
    return (this.duration / this.distance).toFixed(1)
  }

  get description() {
    return `Running on ${this.date.toLocaleDateString(navigator.language, {day: 'numeric', month: 'long'})}`
  }
}

class Cycling extends Workout {
  type = 'cycling'

  constructor(distance, duration, coords, elevationGain) {
    super(distance, duration, coords)
    this.elevationGain = elevationGain
  }

  get speed() {
    // km/h
    return (this.distance / (this.duration / 60)).toFixed(1)
  }

  get description() {
    return `Cycling on ${this.date.toLocaleDateString(navigator.language, {day: 'numeric', month: 'long'})}`
  }
}


class App {
  _map = L.map('map')
  _mapClickEvt
  _workouts = []

  constructor() {
    this._getPosition()
    form.addEventListener('submit', this._handleFormSubmit.bind(this))
    inputType.addEventListener('change', this._toggleElevationField)
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Can not get current location')
        }
      )
    }
  }

  _loadMap(position) {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    const coords = [latitude, longitude]
    this._map.setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this._map);

    this._map.on('click', this._mapOnClick.bind(this))
  }

  _mapOnClick(evt) {
    form.classList.remove('hidden')
    inputDistance.focus()
    this._mapClickEvt = evt
  }

  _handleFormSubmit(evt) {
    evt.preventDefault()

    // get inputs
    const type = inputType.value
    const distance = +inputDistance.value
    const duration = +inputDuration.value
    const cadence = +inputCadence.value
    const elevation = +inputElevation.value
    const {lat, lng} = this._mapClickEvt.latlng
    const coords = [lat, lng]

    // create object
    let workout
    if (type === 'running' && validInputs(distance, duration, cadence) && allPositive(distance, duration, cadence)) {
      workout = new Running(distance, duration, coords, cadence)
    } else if (type === 'cycling' && validInputs(distance, duration, elevation) && allPositive(distance, duration)) {
      workout = new Cycling(distance, duration, coords, elevation)
    } else {
      alert("invalid inputs")
      return
    }
    this._workouts.push(workout)

    // add marker
    this._createMarker(workout)

    // display in list
    this._renderWorkout(workout)

    // clear form
    form.style.display = 'none'
    form.classList.add('hidden')
    form.style.display = 'grid'
  }

  _createMarker(workout) {
    L.marker(workout.coords)
      .addTo(this._map)
      .bindPopup(
        workout.description, {
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`
        }
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
    `;

    if (workout.type === 'running')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `;

    if (workout.type === 'cycling')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
      `;

    form.insertAdjacentHTML('afterend', html);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
}

const app = new App()
