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

class Workout {
  date = new Date()
  id = String(Date.now())
  constructor(distance, duration, coords) {
    this.distance = distance
    this.duration = duration
    this.coords = coords
  }
}

class Running extends Workout{
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

class Cycling extends Workout{
  type = 'cycling'
  constructor(distance, duration, coords, elevationGain) {
    super(distance, duration, coords)
    this.cadence = elevationGain
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
  _mapEvt

  constructor() {
    this._getPosition()
    form.addEventListener('submit', this._handleFormSubmit.bind(this))
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
    console.log(this)
    this._map.setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this._map);

    this._map.on('click', this._mapOnClick.bind(this))
  }

  _mapOnClick(evt) {
    form.classList.remove('hidden')
    inputDistance.focus()
    this._mapEvt = evt
  }

  _handleFormSubmit(evt) {
    evt.preventDefault()

    // validate inputs

    // create object

    // add marker
    this._createMarker("Workout!")
    // clear form

  }

  _createMarker(msg) {
    const {lat, lng} = this._mapEvt.latlng
    L.marker([lat, lng])
      .addTo(this._map)
      .bindPopup(
        msg, {
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup'
        }
      )
      .openPopup();
  }
}

const app = new App()
