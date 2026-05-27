const openSideNav = document.querySelector('.side-nav-toggle');
const sideNav = document.querySelector('.nav-bar-ul');
const closeSideNav = document.querySelector('.close-side-nav');
const blurGrid = document.querySelector('.blur-body-liner');

openSideNav.addEventListener('click', () => {
  sideNav.classList.add('side-nav-open');
  blurGrid.classList.add('blur-active');
  console.log('clicked');
});

closeSideNav.addEventListener('click', () => {
  sideNav.classList.remove('side-nav-open');
  blurGrid.classList.remove('blur-active');
  console.log('closed');
});

// toogle blur grid==========================
// openSideNav.addEventListener('click', () => {
//   sideNav.classList.add('side-nav-open');
//   console.log('clicked');
// });

// closeSideNav.addEventListener('click', () => {
//   sideNav.classList.remove('side-nav-open');
//   console.log('closed');
// });