// 1. CHUYỂN TRANG THỰC TẾ
function navigateTo(pageId) {
    console.log("Sếp đang điều hướng đến: " + pageId);
    closeMobileMenu();
    // Điều hướng sang file .html tương ứng
    if (pageId === 'index') {
        window.location.href = 'index.html';
    } else {
        window.location.href = pageId + '.html';
    }
}

// 2. TOGGLE MENU MOBILE
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-overlay');
    const btn = document.getElementById('mobile-menu-button');
    const isOpen = menu.classList.toggle('open');
    overlay.classList.toggle('show');
    btn.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
}

function closeMobileMenu() {
    document.getElementById('mobile-menu').classList.remove('open');
    document.getElementById('mobile-overlay').classList.remove('show');
    document.getElementById('mobile-menu-button').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// 3. MODAL LOGIC
function openAuthModal(type) {
    document.getElementById('auth-modal').style.display = 'flex';
    switchForm(type === 'login' ? 'login' : 'reg');
    closeMobileMenu();
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    document.getElementById('auth-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function switchForm(form) {
    document.getElementById('login-form').style.display = form === 'login' ? 'block' : 'none';
    document.getElementById('register-form').style.display = form === 'reg' ? 'block' : 'none';
}