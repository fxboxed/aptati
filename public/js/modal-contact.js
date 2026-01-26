const toggleButton = document.getElementById('contactToggle');
const modal = document.getElementById('contactModal');
const closeButton = document.getElementById('contactClose');

toggleButton.addEventListener('click', () => {
    console.log('Contact button clicked');
    modal.style.display = 'block';
});