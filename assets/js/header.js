let menuBurger = document.querySelector('.menu-burger');
let headerMenu = document.querySelector('.header-menu');

menuBurger.addEventListener('click', () => {
    if (headerMenu.style.display === 'block') {
        headerMenu.style.display = 'none';
        menuBurger.classList.remove('active');
    } else {
        headerMenu.style.display = 'block';
        menuBurger.classList.add('active');
    }
});