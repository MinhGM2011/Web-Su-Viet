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
  closeMobileMenu();
  document.getElementById('auth-modal').addEventListener('click', function (e) {
    if (e.target === this) {
      closeAuthModal();
    }
  });

}

function switchForm(form) {
  document.getElementById('login-form').style.display = form === 'login' ? 'block' : 'none';
  document.getElementById('register-form').style.display = form === 'reg' ? 'block' : 'none';
}

// ====== ĐĂNG KÝ HỌC SINH (LƯU GOOGLE SHEET) ======
function handleRegister() {
  const username = document.getElementById("reg-username").value.trim();
  const fullname = document.getElementById("reg-fullname").value.trim();
  const className = document.getElementById("reg-class").value.trim();
  const password = document.getElementById("reg-password").value;
  const password2 = document.getElementById("reg-password2").value;

  if (!username || !fullname || !className || !password || !password2) {
    showToast("Nhập thiếu thông tin rồi kìa 😐", "error");
    return;
  }

  if (password !== password2) {
    showToast("Mật khẩu nhập lại không khớp ❌", "error");
    return;
  }

  // 🔴 LINK GOOGLE FORM
  const FORM_URL = "https://docs.google.com/forms/d/1MMw7eQRW3xGivzWLe7DWVXE96pAenNEzKU4gGKVUq8U/formResponse";

  const formData = new FormData();
  formData.append("entry.695866635", username);
  formData.append("entry.2038573877", password);
  formData.append("entry.36636130", fullname);
  formData.append("entry.1508283968", className);
  formData.append("entry.127414558", new Date().toLocaleString("vi-VN"));

  fetch(FORM_URL, {
    method: "POST",
    mode: "no-cors",
    body: formData
  });

  showToast("Đăng ký thành công 🎉\nGiờ đăng nhập để học nhé!", "success");
  closeAuthModal();
}

const API_URL =
  "https://script.google.com/macros/s/AKfycby1_wkHGvglgkdk_VOwxBAQv9EfsYERL5trt_aU4RoGQThBd7QHXKb4dNzlUDcn0Y_Fmw/exec";

function handleLogin() {
  const username = document
    .getElementById("login-username").value.trim();
  const password = document
    .getElementById("login-password").value.trim();

  if (!username || !password) {
    showToast("Nhập thiếu thông tin rồi kìa 😐", "error");
    return;
  }
  fetch(API_URL, {
    method: "POST",
    body: new URLSearchParams({ username, password })
  })
    .then(r => {
      if (!r.ok) throw new Error("HTTP error");
      return r.text();
    })
    .then(res => {
      console.log("Server trả về:", res);

      if (res.startsWith("success|")) {
        const fullname = res.split("|")[1];

        localStorage.setItem("login", "true");
        localStorage.setItem("fullname", fullname);

        showToast("Xin chào " + fullname + " 🇻🇳", "success");
        closeAuthModal();
        updateAuthUI();
      } else if (res === "fail") {
        showToast("Sai tài khoản hoặc mật khẩu ❌", "error");
      } else {
        showToast("Server phản hồi lạ 🤨", "error");
        console.warn(res);
      }
    })
    .catch(err => {
      showToast("Không gọi được Apps Script 😵", "error");
      console.error(err);
    });

}

function showToast(msg, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}


function logout() {
  localStorage.clear();
  showToast("Đã đăng xuất 👋", "success");
  setTimeout(() => location.reload(), 800);
}
function updateAuthUI() {
  const isLogin = localStorage.getItem("login") === "true";
  const fullname = localStorage.getItem("fullname");

  const desktopAuth = document.getElementById("auth-area");
  const mobileAuth = document.getElementById("mobile-auth-area");

  if (!desktopAuth || !mobileAuth) return;

  if (isLogin) {
    desktopAuth.innerHTML = `
      <span class="user-name">👋 ${fullname}</span>
      <button class="btn-logout" type="button" onclick="logout()">Đăng xuất</button>
    `;

    mobileAuth.innerHTML = `
      <span class="user-name">👋 ${fullname}</span>
      <button class="btn-logout" type="button" onclick="logout()">Đăng xuất</button>
    `;
  } else {
    desktopAuth.innerHTML = `
      <button class="btn-auth btn-login" onclick="openAuthModal('login')">Đăng nhập</button>
      <button class="btn-auth btn-register" onclick="openAuthModal('register')">Đăng ký</button>
    `;

    mobileAuth.innerHTML = `
      <button class="btn-auth btn-login" onclick="openAuthModal('login')">Đăng nhập</button>
      <button class="btn-auth btn-register" onclick="openAuthModal('register')">Đăng ký</button>
    `;
  }
  closeMobileMenu();
}


document.addEventListener("DOMContentLoaded", updateAuthUI);