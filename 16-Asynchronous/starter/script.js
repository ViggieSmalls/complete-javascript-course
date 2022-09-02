'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
class AuthenticationError extends Error {
}

function whereAmI(lat, lng, maxRetries = 3) {
  btn.disabled = 'true'
  const url = `https://geocode.xyz/${lat},${lng}?json=1`
  fetch(url)
    .then(response => {
      if (response.status === 403) {
        if (!maxRetries) throw Error("Could not retrieve data")
        setTimeout(whereAmI.bind(null, lat, lng, maxRetries - 1), 1000)
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


const imagesContainer = document.querySelector('.images')

function wait(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000)
  })
}

function createImage(imgPath) {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.classList.add('parallel')
    img.src = imgPath

    img.addEventListener('load', function () {
      imagesContainer.appendChild(img)
      resolve(img)
    })

    img.addEventListener('error', function () {
      reject(new Error('Image path not found'))
    })
  })
}

let currentImage

// createImage('img/img-1.jpg')
//   .then(img => {
//     currentImage = img
//     main.appendChild(img)
//     return wait(2)
//   })
//   .then(() => {
//     currentImage.style.display = 'none'
//     return createImage('img/img-2.jpg')
//   })
//   .then(img => {
//     main.appendChild(img)
//     return wait(2)
//   })
//   .then(() => {
//     currentImage.style.display = 'none'
//     return createImage('img/img-3.jpg')
//   })
//   .then(img => {
//     main.appendChild(img)
//   })
//   .catch(err => console.error(err))


const arrayOfImagePaths = ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']

async function loadAll(imgArr) {
  const imgs = imgArr.map(imgPath => createImage(imgPath))
  const result = await Promise.all(imgs)
  console.log(result)
}

loadAll(arrayOfImagePaths)
