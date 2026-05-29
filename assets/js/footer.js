let footerBtn = document.querySelector('.footer-bottom .btn-icon');

footerBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
});