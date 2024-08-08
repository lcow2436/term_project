document.addEventListener("DOMContentLoaded", function () {
    const productSection = document.getElementById('product-list');
    const cartSection = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const resetButton = document.getElementById('reset-button');

    const TAX_RATE = 0.13; 

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let products = [];

    function loadProducts() {
        fetch('products.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                products = data;
                displayProducts();
            })
            .catch(error => console.error('Error loading products:', error));
    }

    function displayProducts() {
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productSection.appendChild(productDiv);
        });
    }

    window.addToCart = function (productId) {
        const product = cart.find(item => item.id === productId);
        if (product) {
            product.quantity += 1;
        } else {
            const productToAdd = products.find(p => p.id === productId);
            if (productToAdd) {
                cart.push({ ...productToAdd, quantity: 1 });
            }
        }
        console.log("Cart after addition:", cart); // Debugging line
        updateCart();
    };

    function updateCart() {
        cartSection.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.quantity * item.price;
            subtotal += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <p>${item.name} - ${item.quantity} x $${item.price.toFixed(2)}</p>
                <p>Subtotal: $${itemTotal.toFixed(2)}</p>
            `;
            cartSection.appendChild(cartItem);
        });

        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;

        cartTotal.innerHTML = `
            Subtotal: $${subtotal.toFixed(2)}<br>
            Tax (13%): $${tax.toFixed(2)}<br>
            Total: $${total.toFixed(2)}
        `;

        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function checkout() {
        if (cart.length === 0) {
            alert("Your cart is empty. Add items to the cart before checking out.");
            return;
        }

        // Simulate checkout process; here we just clear the cart and show an alert
        alert("Checkout successful!!");
        cart = [];
        localStorage.removeItem('cart');
        updateCart();
    }

    function resetCart() {
        if (confirm("Are you sure you want to clear the cart? This action cannot be undone.")) {
            cart = [];
            localStorage.removeItem('cart');
            updateCart();
        }
    }

    checkoutButton.addEventListener('click', checkout);
    resetButton.addEventListener('click', resetCart);

    loadProducts();
    updateCart();
});
