document.addEventListener('DOMContentLoaded', () => {
    const addToBasketButton = document.querySelector('.add-to-basket');

    if (!addToBasketButton.getAttribute('listener')) {
        addToBasketButton.addEventListener('click', addToBasket);
        addToBasketButton.setAttribute('listener', 'true');
    }
});

function addToBasket() {
    const basketCountElement = document.getElementById('basket-count');
    let basketItems = JSON.parse(localStorage.getItem('basketItems')) || [];
    const selectedOption = document.querySelector('input[name="purchase-option"]:checked');
    const priceLabel = selectedOption.nextElementSibling;
    let price = priceLabel ? parseFloat(priceLabel.textContent.match(/[\d\.]+/)[0]) : 0;

    const productDetail = {
        id: document.querySelector('.product-image').alt.toLowerCase(),
        price: price,
        deliveryDate: document.getElementById('delivery-date').value,
    };

    basketItems.push(productDetail);
    localStorage.setItem('basketItems', JSON.stringify(basketItems));
    updateBasketCount(basketItems.length);
    window.location.href = 'checkout.html';

}

function updateBasketCount(count) {
    const basketCountElement = document.getElementById('basket-count');
    if (basketCountElement) {
        basketCountElement.textContent = count;
    }
}
