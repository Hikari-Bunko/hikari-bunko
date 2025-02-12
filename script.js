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
