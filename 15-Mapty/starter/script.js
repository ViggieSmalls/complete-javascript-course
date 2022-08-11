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
    this._createMarker("Workout!")
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
