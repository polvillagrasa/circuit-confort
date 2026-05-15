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

  document.querySelectorAll(".role-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".role-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
    });
  });

  const form = document.getElementById("registerForm");

  form.addEventListener("submit", e => {
    e.preventDefault();

    ["nameError", "emailError", "passwordError", "formError"].forEach(id => CC.hideError(id));

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const role = document.querySelector(".role-chip.active").textContent.trim();

    let valid = true;

    if (name.length < 3) {
      CC.showError("nameError", "Escriu el teu nom complet.");
      valid = false;
    }

    if (!email) {
      CC.showError("emailError", "Has d'escriure un correu electrònic.");
      valid = false;
    } else if (!CC.validateEmail(email)) {
      CC.showError("emailError", "El correu no és vàlid. Exemple correcte: nom@domini.com");
      valid = false;
    }

    if (password.length < 6) {
      CC.showError("passwordError", "La contrasenya ha de tenir com a mínim 6 caràcters.");
      valid = false;
    }

    if (!valid) return;

    const users = CC.getUsers();

    if (users.some(u => u.email === email)) {
      CC.showError("formError", "Aquest correu ja està registrat. Inicia sessió.");
      return;
    }

    users.push({
      name,
      email,
      password,
      role
    });

    CC.setUsers(users);

    CC.showSuccess("successMessage", "Compte creat correctament. Ara inicia sessió.");

    setTimeout(() => {
      CC.go("login");
    }, 900);
  });
});
