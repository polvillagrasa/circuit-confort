const CC = {
  pages: {
    index: "../index/index.html",
    login: "../login/login.html",
    registre: "../registre/registre.html",
    circuit: "../circuit/circuit.html",
    transport: "../transport/transport.html",
    alertes: "../alertes/alertes.html",
    menjar: "../menjar/menjar.html",
    perfil: "../perfil/perfil.html"
  },

  init() {
    this.injectLogoIcons();
    this.bindNavigation();
    this.protectPrivatePages();
  },

  go(page) {
    window.location.href = this.pages[page] || page;
  },

  bindNavigation() {
    document.querySelectorAll("[data-page]").forEach(el => {
      el.addEventListener("click", () => this.go(el.dataset.page));
    });
  },

  injectLogoIcons() {
    const icon = `
      <img 
        src="../img/logo-circuit.png"
        alt="Circuit Comfort Logo"
        style="
          width:100%;
          height:100%;
          object-fit:contain;
          border-radius:12px;
        "
      >
    `;

    document.querySelectorAll(".icon-logo").forEach(el => {
      el.innerHTML = icon;
    });
  },

  isLoggedIn() {
    return localStorage.getItem("cc_logged_user") !== null;
  },

  getUsers() {
    return JSON.parse(localStorage.getItem("cc_users") || "[]");
  },

  setUsers(users) {
    localStorage.setItem("cc_users", JSON.stringify(users));
  },

  loginUser(user) {
    localStorage.setItem("cc_logged_user", JSON.stringify(user));
  },

  getLoggedUser() {
    return JSON.parse(localStorage.getItem("cc_logged_user") || "null");
  },

  logout() {
    localStorage.removeItem("cc_logged_user");
    this.go("index");
  },

  protectPrivatePages() {
    const privatePages = [
      "circuit.html",
      "transport.html",
      "alertes.html",
      "menjar.html",
      "perfil.html"
    ];

    const current = window.location.pathname.split("/").pop();

    if (privatePages.includes(current) && !this.isLoggedIn()) {
      this.go("login");
    }
  },

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  },

  showError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;

    el.textContent = msg;
    el.classList.add("show");
  },

  hideError(id) {
    const el = document.getElementById(id);
    if (!el) return;

    el.classList.remove("show");
  },

  showSuccess(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;

    el.textContent = msg;
    el.classList.add("show");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  CC.init();

  const form = document.getElementById("loginForm");

  form.addEventListener("submit", e => {
    e.preventDefault();

    ["emailError", "passwordError", "formError"].forEach(id => CC.hideError(id));

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    let valid = true;

    if (!email) {
      CC.showError("emailError", "Has d'escriure un correu electrònic.");
      valid = false;
    } else if (!CC.validateEmail(email)) {
      CC.showError("emailError", "El correu no és vàlid. Exemple correcte: nom@domini.com");
      valid = false;
    }

    if (!password) {
      CC.showError("passwordError", "Has d'escriure la contrasenya.");
      valid = false;
    }

    if (!valid) return;

    const users = CC.getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      CC.showError("formError", "Aquest correu no està registrat. Primer has de crear un compte.");
      return;
    }

    if (user.password !== password) {
      CC.showError("formError", "La contrasenya no és correcta.");
      return;
    }

    CC.loginUser(user);
    CC.go("circuit");
  });
});