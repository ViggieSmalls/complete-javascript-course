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

const map = L.map('map')
let mapClickEvt

function mapOnClick(evt) {
  form.classList.remove('hidden')
  inputDistance.focus()
  mapClickEvt = evt
}

function createMarker(msg="Workout!") {
  const {lat, lng} = mapClickEvt.latlng
  L.marker([lat, lng])
    .addTo(map)
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

function handleFormSubmit(evt) {
  evt.preventDefault()
  createMarker()
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      const coords = [latitude, longitude]
      map.setView(coords, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      map.on('click', mapOnClick)
    },
    function () {
      alert('Can not get current location')
    }
  )
}

form.addEventListener('submit', handleFormSubmit)
