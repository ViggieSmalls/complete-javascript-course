'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector('.btn--scroll-to')
const header = document.querySelector('.header')
const section1 = document.getElementById('section--1')
const allSections = document.querySelectorAll('.section')
const operationsTabContainer = document.querySelector('.operations__tab-container')
const operationsTabs = document.querySelectorAll('.operations__tab')
const operationsContents = document.querySelectorAll('.operations__content')
const nav = document.querySelector('.nav')
const lazyImages = document.querySelectorAll('.lazy-img')

////////////////////////////////////////////////////////////////////////////
// Modal

const openModal = function (evt) {
  evt.preventDefault()
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////////////////////////////////////////////
// Smooth scroll

btnScroll.addEventListener('click', () => {section1.scrollIntoView({behavior: "smooth"})})

////////////////////////////////////////////////////////////////////////////
// Tabs

operationsTabContainer.addEventListener('click', function(evt) {
  const btn = evt.target.closest('.btn')
  if (!btn) return;
  // remove all active classes
  operationsTabs.forEach(el => el.classList.remove('operations__tab--active'))
  operationsContents.forEach(el => el.classList.remove('operations__content--active'))
  // activate clicked one
  const id = btn.dataset.tab
  btn.classList.add('operations__tab--active')
  document.querySelector(`.operations__content--${id}`).classList.add('operations__content--active')
})

////////////////////////////////////////////////////////////////////////////
// Sticky navigation

function stickyNav(entries) {
  const [entry] = entries
  if (!entry.isIntersecting) nav.classList.add('sticky')
  else nav.classList.remove('sticky')
}

(new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`
})).observe(header)

////////////////////////////////////////////////////////////////////////////
// Reveal sections

function revealSection(entries, observer) {
  const [entry] = entries
  if (!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target)
}
const observer = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
})
allSections.forEach(section => {
  section.classList.add('section--hidden')
  observer.observe(section)
})

////////////////////////////////////////////////////////////////////////////
// Lazy load images

function lazyLoad(entries, observer) {
  const [entry] = entries
  if(!entry.isIntersecting) return
  entry.target.src = entry.target.dataset.src
  entry.target.addEventListener('load', function (evt) {
    evt.target.classList.remove('lazy-img')
  })
  observer.unobserve(entry.target)
}
const lazyObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
})
lazyImages.forEach(el => {
  lazyObserver.observe(el)
})
