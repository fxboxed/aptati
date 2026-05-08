const openSideNav = document.querySelector('.side-nav-toggle');
const sideNav = document.querySelector('.nav-bar-ul');
const closeSideNav = document.querySelector('.close-side-nav');

openSideNav.addEventListener('click', () => {
  sideNav.classList.add('side-nav-open');
  console.log('clicked');
});

closeSideNav.addEventListener('click', () => {
  sideNav.classList.remove('side-nav-open');
  console.log('closed');
});