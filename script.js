let cart = [];
let total = 0;
let selectedPaymentMethod = null;
let selectedAccountName = null;
let selectedAccountNumber = null;

function addToCart(name, price) {
    cart.push({ name, price });
    total += price;
    updateCart();
    saveCartToStorage();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        cartItems.appendChild(li);
    });
    cartTotal.textContent = total.toFixed(2);
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('total', total.toString());
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    const savedTotal = localStorage.getItem('total');
    if (savedCart && savedTotal) {
        cart = JSON.parse(savedCart);
        total = parseFloat(savedTotal);
        updateCart();
    }
}

function openPaymentModal() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
        alert('You must login first to proceed to payment.');
        window.location.href = 'login.html';
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    document.getElementById('payment-modal').style.display = 'flex';
    document.getElementById('payment-total').textContent = total.toFixed(2);
}

function closePaymentModal() {
    document.getElementById('payment-modal').style.display = 'none';
    selectedPaymentMethod = null;
    selectedAccountName = null;
    selectedAccountNumber = null;
    document.getElementById('payment-details').classList.add('hidden');
}

function selectPaymentMethod(method, accountNumber, accountName) {
    selectedPaymentMethod = method;
    selectedAccountName = accountName;
    selectedAccountNumber = accountNumber;
    document.getElementById('selected-method').textContent = method;
    document.getElementById('account-name').textContent = accountName;
    document.getElementById('account-number').textContent = accountNumber;
    document.getElementById('payment-details').classList.remove('hidden');
}

function handleConfirmation(event) {
    event.preventDefault();
    const proof = document.getElementById('proof').files[0];
    const contact = document.getElementById('contact').value;

    if (!selectedPaymentMethod || !proof || !contact) {
        alert('Please fill all fields!');
        return;
    }

    if (proof.size > 2 * 1024 * 1024) {
        alert('Proof file must be less than 2MB.');
        return;
    }

    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const confirmationData = {
        paymentMethod: selectedPaymentMethod,
        accountName: selectedAccountName,
        accountNumber: selectedAccountNumber,
        total: total.toFixed(2),
        contact: contact,
        proof: proof.name,
        userPaymentAccount: user.paymentAccount,
    };

    const message = `Payment Confirmation:
Method: ${confirmationData.paymentMethod}
Account Name: ${confirmationData.accountName}
Account Number: ${confirmationData.accountNumber}
Total: $${confirmationData.total}
Contact: ${confirmationData.contact}
Proof: ${confirmationData.proof}
User Payment Account: ${confirmationData.userPaymentAccount}`;

    sendWhatsAppMessage(confirmationData.contact, message);

    cart = [];
    total = 0;
    updateCart();
    closePaymentModal();
    showToast('Payment confirmation sent! Please check WhatsApp.');
}

function sendWhatsAppMessage(contact, message) {
    const phoneNumber = '6283807586238';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function toggleDescription(id) {
    const description = document.getElementById(id);
    if (description.style.display === 'none' || description.style.display === '') {
        description.style.display = 'block';
    } else {
        description.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    updateNavbar();
    const lazyImages = document.querySelectorAll('.lazy-load');
    lazyImages.forEach(img => {
        img.src = img.dataset.src;
    });
});


// Fitur Pencarian Produk
function searchProducts() {
    const query = document.getElementById('search').value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const name = product.querySelector('h3').textContent.toLowerCase();
        if (name.includes(query)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Fitur Notifikasi
function showNotification(message) {
    if (Notification.permission === 'granted') {
        new Notification('Hoshizora Bunko', { body: message });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Hoshizora Bunko', { body: message });
            }
        });
    }
}

// Fitur Diskon dan Promo
function applyPromo() {
    const code = document.getElementById('promo-code').value;
    if (code === 'DISKON10') {
        total *= 0.9; // 10% discount
        updateCart();
        alert('Promo code applied!');
    } else {
        alert('Invalid promo code.');
    }
}

// Fitur Riwayat Transaksi
let transactionHistory = [];

function addToTransactionHistory(product, total) {
    transactionHistory.push({ product, total, date: new Date() });
    localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
}

function displayTransactionHistory() {
    const history = JSON.parse(localStorage.getItem('transactionHistory')) || [];
    const container = document.getElementById('transaction-history');
    container.innerHTML = '<h2>Transaction History</h2>';
    history.forEach(transaction => {
        const item = document.createElement('div');
        item.textContent = `${transaction.product} - $${transaction.total} on ${transaction.date.toLocaleString()}`;
        container.appendChild(item);
    });
}

// Fitur Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Fitur Multi-Bahasa (i18n)
const translations = {
    en: { welcome: 'Welcome', login: 'Login', search: 'Search products...' },
    id: { welcome: 'Selamat Datang', login: 'Masuk', search: 'Cari produk...' }
};

let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    document.getElementById('welcome').textContent = translations[lang].welcome;
    document.getElementById('login').textContent = translations[lang].login;
    document.getElementById('search').placeholder = translations[lang].search;
}

// Contoh penggunaan
setLanguage('id'); // Set bahasa ke Indonesia
