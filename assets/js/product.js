// AREA DE DESCRIÇÃO
let descButton = document.querySelector('.desc-header .btn-icon');
let descBody = document.querySelector('.desc-body');

descButton.addEventListener('click', () => {
    if (descBody.style.display === 'none') {
        descBody.style.display = 'block';
    } else {
        descBody.style.display = 'none';
    }
});