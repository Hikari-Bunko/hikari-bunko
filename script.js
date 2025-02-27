let cart = [];
let total = 0;
let selectedPaymentMethod = null;
let selectedAccountName = null;
let selectedAccountNumber = null;

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(name, price) {
    cart.push({ name, price });
    total += price;
    updateCart();
}

// Fungsi untuk memperbarui tampilan keranjang
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

// Fungsi untuk membuka modal pembayaran
function openPaymentModal() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
        alert('You must login first to proceed to payment.');
        window.location.href = 'login.html'; // Redirect ke halaman login
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    document.getElementById('payment-modal').style.display = 'flex';
    document.getElementById('payment-total').textContent = total.toFixed(2);
}

// Fungsi untuk menutup modal pembayaran
function closePaymentModal() {
    document.getElementById('payment-modal').style.display = 'none';
    selectedPaymentMethod = null;
    selectedAccountName = null;
    selectedAccountNumber = null;
    document.getElementById('payment-details').classList.add('hidden');
}

// Fungsi untuk memilih metode pembayaran
function selectPaymentMethod(method, accountNumber, accountName) {
    selectedPaymentMethod = method;
    selectedAccountName = accountName;
    selectedAccountNumber = accountNumber;

    // Tampilkan informasi pembayaran
    document.getElementById('selected-method').textContent = method;
    document.getElementById('account-name').textContent = accountName;
    document.getElementById('account-number').textContent = accountNumber;
    document.getElementById('payment-details').classList.remove('hidden');
}

// Fungsi untuk mengirim pesan WhatsApp
function sendWhatsAppMessage(contact, message, imageUrl = null) {
    const phoneNumber = '6283807586238'; // Ganti dengan nomor WhatsApp Anda (tanpa tanda + atau 0)
    let whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Jika ada tautan gambar, tambahkan ke pesan
    if (imageUrl) {
        whatsappUrl += `%0A%0ABukti Pembayaran: ${encodeURIComponent(imageUrl)}`;
    }

    // Buka WhatsApp di tab baru
    window.open(whatsappUrl, '_blank');
}

// Fungsi untuk menangani konfirmasi pembayaran
function handleConfirmation(event) {
    event.preventDefault();
    const proof = document.getElementById('proof').files[0];
    const contact = document.getElementById('contact').value;

    if (!selectedPaymentMethod || !proof || !contact) {
        alert('Please fill all fields!');
        return;
    }

    // Ambil informasi pengguna yang login
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    // Simpan informasi pembayaran
    const confirmationData = {
        paymentMethod: selectedPaymentMethod,
        accountName: selectedAccountName,
        accountNumber: selectedAccountNumber,
        total: total.toFixed(2),
        contact: contact,
        proof: proof.name,
        userPaymentAccount: user.paymentAccount, // Tambahkan akun pembayaran pengguna
    };

    // Buat pesan WhatsApp
    const message = `Payment Confirmation:
Method: ${confirmationData.paymentMethod}
Account Name: ${confirmationData.accountName}
Account Number: ${confirmationData.accountNumber}
Total: $${confirmationData.total}
Contact: ${confirmationData.contact}
Proof: ${confirmationData.proof}
User Payment Account: ${confirmationData.userPaymentAccount}`;

    // Jika ada backend, unggah gambar dan dapatkan tautan
    // Contoh: uploadImageToServer(proof).then(imageUrl => { ... });
    const imageUrl = null; // Ganti dengan tautan gambar jika ada

    // Kirim pesan WhatsApp
    sendWhatsAppMessage(confirmationData.contact, message, imageUrl);

    // Reset keranjang dan tutup modal
    cart = [];
    total = 0;
    updateCart();
    closePaymentModal();
    alert('Payment confirmation sent! Please check WhatsApp.');
}

// Fungsi untuk menampilkan/menyembunyikan deskripsi produk
function toggleDescription(id) {
    const description = document.getElementById(id);
    if (description.style.display === 'none' || description.style.display === '') {
        description.style.display = 'block';
    } else {
        description.style.display = 'none';
    }
}

// Toggle Dark Mode
const darkModeToggle = document.getElementById('dark-mode-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    document.documentElement.setAttribute('data-theme', 'light');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

darkModeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});
  
  // Toggle Menu Mobile
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
