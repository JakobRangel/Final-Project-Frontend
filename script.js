document.addEventListener('DOMContentLoaded', () => {
    const userIcon = document.getElementById('user-icon');
    const basketCount = document.getElementById('basketCount');
    const flowerTypeFilter = document.getElementById('flowerType');
    const occasionFilter = document.getElementById('occasion');
    const colorFilter = document.getElementById('color');
    const sortPrice = document.getElementById('sortPrice');
    
    let allFlowers = [];  // Array to store all flowers

    if (localStorage.getItem('token')) {
        userIcon.style.display = 'none';
    } else {
        userIcon.style.display = 'block';
    }

    const basketItems = JSON.parse(localStorage.getItem('basketItems')) || [];
    basketCount.textContent = basketItems.length;  // Update the basket count display

    fetchFlowers();  // Fetch and display flowers initially

    function fetchFlowers() {
        fetch('https://final-project-2f2a.onrender.com/flowers') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch flowers: ' + response.statusText);
                }
                return response.json();
            })
            .then(flowers => {
                allFlowers = flowers;  // Store the flowers for later use
                displayFlowers(flowers);  // Display flowers initially
            })
            .catch(error => {
                console.error('Error fetching flowers:', error);
                const productGrid = document.querySelector('.product-grid');
                productGrid.innerHTML = `<p>Error loading flowers. Please try again later.</p>`;
            });
    }

    function displayFlowers(flowers) {
        const productGrid = document.querySelector('.product-grid');
        productGrid.innerHTML = ''; 

        flowers.forEach(flower => {
            const product = document.createElement('a');
            product.className = 'product';
            const flowerPageName = flower.name.toLowerCase();
            product.href = `${flowerPageName}.html`;
            product.dataset.id = flower.name.toLowerCase();
            product.dataset.price = flower.price;
            product.dataset.occasion = flower.occasion.toLowerCase();
            product.dataset.color = flower.color.toLowerCase();
            product.innerHTML = `
                <img src="images/${flower.name.toLowerCase()}.jpeg" alt="${flower.name}" style="width:100%">
                <div class="text">
                    <h3>${flower.name}</h3>
                    <p>Starting from $${flower.price.toFixed(2)}</p>
                </div>
            `;
            productGrid.appendChild(product);
        });
    }

    function filterAndSortFlowers() {
        let filteredFlowers = allFlowers;

        const selectedFlowerType = flowerTypeFilter.value.toLowerCase();
        const selectedOccasion = occasionFilter.value.toLowerCase();
        const selectedColor = colorFilter.value.toLowerCase();

        if (selectedFlowerType !== 'mixed') {
            filteredFlowers = filteredFlowers.filter(flower => flower.name.toLowerCase() === selectedFlowerType);
        }
        if (selectedOccasion !== 'all') {
            filteredFlowers = filteredFlowers.filter(flower => flower.occasion.toLowerCase() === selectedOccasion);
        }
        if (selectedColor !== 'mixed') {
            filteredFlowers = filteredFlowers.filter(flower => flower.color.toLowerCase() === selectedColor);
        }

        const sortType = sortPrice.value;
        filteredFlowers.sort((a, b) => {
            return sortType === 'lowToHigh' ? a.price - b.price : b.price - a.price;
        });

        displayFlowers(filteredFlowers);
    }

    // Attach events to filters and sort dropdowns
    flowerTypeFilter.addEventListener('change', filterAndSortFlowers);
    occasionFilter.addEventListener('change', filterAndSortFlowers);
    colorFilter.addEventListener('change', filterAndSortFlowers);
    sortPrice.addEventListener('change', filterAndSortFlowers);
});
