// Crear el carrito de compras
let cart = [];

// Función para actualizar el carrito en la interfaz
function updateCart() {
    let cartItems = document.getElementById('cart-items');
    let cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = ''; // Limpiar los productos actuales
    let total = 0;

    cart.forEach((item, index) => {
        cartItems.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td><button class="btn btn-danger" onclick="removeFromCart(${index})">Eliminar</button></td>
            </tr>
        `;
        total += item.price;
    });

    cartTotal.textContent = `$${total.toFixed(2)}`; // Actualizar el total

    // Actualizar el enlace del botón de pago con el monto total para PayPal
    let paymentButton = document.getElementById('payment-button');
    paymentButton.href = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=YOUR_PAYPAL_EMAIL&amount=${total.toFixed(2)}&item_name=Total%20Carrito&currency_code=USD`;
}

// Función para agregar un producto al carrito
function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
}

// Función para eliminar un producto del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Asignar el evento de agregar al carrito
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const name = e.target.getAttribute('data-name');
        const price = parseFloat(e.target.getAttribute('data-price'));
        addToCart(name, price);
    });
});

// Crear una instancia de Mercado Pago con tu clave pública
const mp = new MercadoPago('YOUR_PUBLIC_KEY', {
    locale: 'es-AR'
});

// Función para actualizar los productos del carrito para Mercado Pago
function updateCartItems() {
    return cart.map(item => ({
        title: item.name,
        unit_price: item.price,
        quantity: 1 // Si tienes cantidades, ajústalo según el número de veces que se agregó el producto
    }));
}

// Función para crear la preferencia de pago en Mercado Pago
function createPreference() {
    const cartItems = updateCartItems(); // Usar los productos actualizados

    const preference = {
        items: cartItems,
        back_urls: {
            success: "https://www.tusitio.com/success",
            failure: "https://www.tusitio.com/failure",
            pending: "https://www.tusitio.com/pending"
        },
        auto_return: "approved"
    };

    fetch("https://api.mercadopago.com/checkout/preferences", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer YOUR_ACCESS_TOKEN`, // Reemplaza con tu token de acceso
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(preference)
    })
    .then(response => response.json())
    .then(data => {
        mp.checkout({
            preference: {
                id: data.id
            }
        });
    })
    .catch(error => console.log(error));
}
