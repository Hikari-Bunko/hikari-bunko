const translations = {
    en: { welcome: 'Welcome', login: 'Login' },
    id: { welcome: 'Selamat Datang', login: 'Masuk' }
};

let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    document.getElementById('welcome').textContent = translations[lang].welcome;
    document.getElementById('login').textContent = translations[lang].login;
}
