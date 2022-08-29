'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
class AuthenticationError extends Error {}

function whereAmI(lat, lng, maxRetries=3) {
  btn.disabled = 'true'
  const url = `https://geocode.xyz/${lat},${lng}?json=1`
  fetch(url)
    .then(response => {
      if (response.status === 403) {
        if (!maxRetries) throw Error("Could not retrieve data")
        setTimeout(whereAmI.bind(null, lat, lng, maxRetries-1), 1000)
        throw new AuthenticationError("Retry in 1 sec")
      }
      return response.json()
    })
    .then(data => {
      const countryCode = data.prov
      fetch(`https://restcountries.com/v2/alpha/${countryCode}`)
        .then(response => response.json())
        .then(data => renderCountry(data))
      btn.disabled = false
    })
    .catch(err => {
      if (err instanceof AuthenticationError)
        console.warn(err.message)
      else
        console.error(err.message)
    })
}

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

btn.addEventListener('click', function () {
  const lat = document.getElementById('lat').value
  const lng = document.getElementById('lng').value
  whereAmI(lat, lng)
})
