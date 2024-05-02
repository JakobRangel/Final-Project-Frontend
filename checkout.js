// checkout.js
document.addEventListener('DOMContentLoaded', () => {
    const userIcon = document.getElementById('user-icon');
    if (localStorage.getItem('token')) {
        // Hide user icon if logged in
        userIcon.style.display = 'none';
    } else {
        // Show user icon if not logged in
        userIcon.style.display = 'block';
    }
    const basketItems = JSON.parse(localStorage.getItem('basketItems')) || [];
        // Redirect to index.html if the basket is empty
        if (basketItems.length === 0) {
            window.location.href = 'index.html';
            return;
        }
    const form = document.getElementById('checkout-form');
    const totalAmountDisplay = document.getElementById('total-amount');
    const discountMessage = document.getElementById('discount-message');
    const warningMessage = document.getElementById('warning-message');

    //
    const token = localStorage.getItem('token');
    const deliveryFee = 25; // Set the delivery fee
    let totalAmount = basketItems.reduce((sum, item) => sum + item.price, 0) + deliveryFee; // Add delivery fee to total

    // Apply $10 discount if logged in
    if (token) {
        totalAmount -= 10;
        if (discountMessage) {
            discountMessage.textContent = "You saved $10 for being signed in!";
            discountMessage.style.display = 'block'; // Make sure the message is visible
            warningMessage.style.display = 'hidden'; // Make sure the message is hidden
        }
    } else if (discountMessage) {
        discountMessage.textContent = "Note: Sign in/up to receive $10 off!";
        warningMessage.textContent = "Also be aware that you CAN NOT track your order if you are not signed in when placing order";
        discountMessage.style.display = 'block'; // Make sure the message is visible
        warningMessage.style.display = 'block'; // Make sure the message is visible
    }

    totalAmountDisplay.textContent = `Total Amount: $${totalAmount.toFixed(2)}`;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);

        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zip: formData.get('zip'),
            customerId: localStorage.getItem('customerId') || 0,  // Default to 0 if customerId is not found
            description: basketItems.map(item => item.id).join(', '),
            cost: totalAmount,
            deliveryDate: basketItems.map(item => item.deliveryDate).join(', '),
            status: "submitted"
        };
        
        
        console.log('Data to be sent:', JSON.stringify(data));

        // Post data to the backend
        fetch('https://final-project-2f2a.onrender.com/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                return response.json();  // Only read the body here if response is OK
            } else {
                // Handle HTTP errors
                throw new Error('Network response was not ok: ' + response.statusText);
            }
        })
        .then(result => {
            console.log(result);
            alert('Order placed successfully!');
            localStorage.removeItem('basketItems'); // Clear the basket after successful order
            window.location.href = 'orders.html'; // Redirect to a success page
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error placing order: ' + error.message);
        });
    });
});
