let users = JSON.parse(localStorage.getItem('users')) || [];

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    return password.length >= 6;
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (!validatePassword(password)) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        alert('Login successful!');
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        updateNavbar();
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password.');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const paymentAccount = document.getElementById('payment-account').value;

    if (!name || !email || !password || !paymentAccount) {
        alert('All fields are required.');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (!validatePassword(password)) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    const userExists = users.some(u => u.email === email);
    if (userExists) {
        alert('User already exists.');
    } else {
        users.push({ name, email, password, paymentAccount });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful!');
        window.location.href = 'login.html';
    }
}

function handleLogout() {
    localStorage.removeItem('loggedInUser');
    updateNavbar();
    window.location.href = 'login.html';
}

function updateNavbar() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const nav = document.querySelector('nav ul');
    if (nav) {
        if (user) {
            nav.innerHTML = `
                <li><a href="index.html">Home</a></li>
                <li><a href="profile.html">Profile</a></li>
                <li><a href="#" onclick="handleLogout()">Logout</a></li>
            `;
        } else {
            nav.innerHTML = `
                <li><a href="index.html">Home</a></li>
                <li><a href="login.html">Login</a></li>
                <li><a href="register.html">Register</a></li>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', updateNavbar);
