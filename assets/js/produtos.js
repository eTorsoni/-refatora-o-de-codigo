let infoShown = '';
let infoButtons = document.querySelectorAll('.top-button');
let orderArea = document.querySelector('.order-area');
let filtersArea = document.querySelector('.products .filters');

infoButtons.forEach((item) => {
    item.addEventListener('click', () => {
        let name = item.getAttribute('data-name');
        if (name === infoShown) {
            infoShown = '';
        } else {
            infoShown = name;
        }
        renderInfo();
    });
})

function renderInfo() {
    orderArea.style.display = 'none';
    filtersArea.style.display = 'none';

    switch (infoShown) {
        case 'order':
            orderArea.style.display = 'block';
            break;
        case 'filter':
            filtersArea.style.display = 'block';
            break;
    }
}

// AREA DO FILTRO
let filterIcons = document.querySelectorAll('.filter-icon');
filterIcons.forEach(item => {
    item.addEventListener('click', () => {
        let body = item.closest('.filter').querySelector('.filter-body');
        if (body.style.display === 'none') {
            body.style.display = 'block';
        } else {
            body.style.display = 'none';
        }
    });
});