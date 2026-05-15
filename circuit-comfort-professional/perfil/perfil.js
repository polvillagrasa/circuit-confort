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

  const user = CC.getLoggedUser();

  if (user) {
    document.getElementById("profileName").textContent = `Hola ${user.name.split(" ")[0]}!`;
    document.getElementById("profileRole").textContent = `${user.role} · GP Espanya · Circuit de Barcelona-Catalunya`;
  }

  function updateChecklist() {
    const items = document.querySelectorAll(".check-item");
    const checked = document.querySelectorAll(".check-item.checked").length;
    const total = items.length;

    document.getElementById("checkCount").textContent = `${checked}/${total} COMPLETATS`;
    document.getElementById("checkFill").style.width = `${(checked / total) * 100}%`;
  }

  document.querySelectorAll(".check-item").forEach(item => {
    item.addEventListener("click", () => {
      const box = item.querySelector(".checkbox");

      item.classList.toggle("checked");
      box.classList.toggle("checked");
      box.textContent = box.classList.contains("checked") ? "✓" : "";

      updateChecklist();
    });
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    CC.logout();
  });
});
