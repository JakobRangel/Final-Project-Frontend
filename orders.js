document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('token')) {
        // Redirect to signup page if not logged in
        window.location.href = 'login.html';
        return;
    }

    const customerId = localStorage.getItem('customerId');
    fetchOrders(customerId);
});

function fetchOrders(customerId) {
    fetch(`https://final-project-2f2a.onrender.com/orders/${customerId}`, {
        method: 'GET', 
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // If the response is OK, parse it as JSON
        }
        if (response.status === 404) {
            // Handle 404 specifically if no orders found
            return []; // Return an empty array to handle as "no orders found"
        }
        throw new Error('Failed to fetch orders');
    })
    .then(orders => {
        if (orders.length === 0) {
            displayNoOrdersFound(); // Display a specific message when no orders are found
        } else {
            displayOrders(orders); // Display orders if there are any
        }
    })
    .catch(error => {
        console.error('Error:', error);
        displayNoOrdersFound();
    });
}

function displayNoOrdersFound() {
    const ordersContainer = document.getElementById('orders-container');
    ordersContainer.innerHTML = '<div class="card"><div class="card-body">No orders found.</div></div>'; // Display no orders message
}

function displayOrders(orders) {
    const ordersContainer = document.getElementById('orders-container');
    ordersContainer.innerHTML = ''; // Clear previous

    orders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-body">
                <h4 class="card-title">${order.description} - $${order.cost}</h4>
                <p>Delivery Date: ${order.deliveryDate}</p>
                <p>Recipient: ${order.firstName} ${order.lastName}</p>
                <p>Address: ${order.address}, ${order.city}, ${order.state}, ${order.zip}</p>
                <p>Status: ${order.status}</p>
            </div>
        `;
        ordersContainer.appendChild(card);
    });
}
