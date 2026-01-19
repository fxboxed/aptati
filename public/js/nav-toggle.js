// public/js/nav-toggle.js - Simplified
document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-left .navlist');
  
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', function() {
      navList.classList.toggle('active');
      
      // Animate hamburger to X
      const bars = this.querySelectorAll('.menu-bar');
      if (navList.classList.contains('active')) {
        bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!menuToggle.contains(event.target) && !navList.contains(event.target)) {
        navList.classList.remove('active');
        const bars = menuToggle.querySelectorAll('.menu-bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
    });
  }
  
  // Contact Toggle
  const contactToggle = document.getElementById('contactToggle');
  if (contactToggle) {
    contactToggle.addEventListener('click', function() {
      // Add your contact modal or form logic here
      alert('Contact functionality would open here!');
    });
  }
});