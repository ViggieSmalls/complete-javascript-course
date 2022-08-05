'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector('.btn--scroll-to')
const section1 = document.getElementById('section--1')
const operationsTabContainer = document.querySelector('.operations__tab-container')
const operationsTabs = document.querySelectorAll('.operations__tab')
const operationsContents = document.querySelectorAll('.operations__content')

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
