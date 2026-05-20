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
        class="logo-img-large"
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

// --- PERFIL + CHECKLIST CONNECTATS A MYSQL ---
document.addEventListener("DOMContentLoaded", async () => {
  const api = (path, options = {}) => fetch(`../api/${path}`, { credentials: "include", headers: { "Content-Type": "application/json" }, ...options }).then(r => r.json());

  function refreshProgress() {
    const items = document.querySelectorAll(".check-item");
    const checked = document.querySelectorAll(".check-item.checked").length;
    const total = items.length || 1;
    document.getElementById("checkCount").textContent = `${checked}/${total} COMPLETATS`;
    document.getElementById("checkFill").style.width = `${(checked / total) * 100}%`;
  }

  try {
    const me = await api("me.php");
    if (me.success && me.user) {
      localStorage.setItem("cc_logged_user", JSON.stringify(me.user));
      document.getElementById("profileName").textContent = `Hola ${me.user.nom.split(" ")[0]}!`;
      document.getElementById("profileRole").textContent = `${me.user.rol} · GP Espanya · Circuit de Barcelona-Catalunya`;
    }
  } catch (e) {}

  try {
    const res = await api("checklist.php");
    const box = document.querySelector(".checklist-items");
    if (res.success && box) {
      box.innerHTML = "";
      (res.data || []).forEach(item => {
        const article = document.createElement("article");
        article.className = `check-item ${item.completat == 1 ? "checked" : ""}`;
        article.innerHTML = `<div class="checkbox ${item.completat == 1 ? "checked" : ""}">${item.completat == 1 ? "✓" : ""}</div><span>${item.item}</span><em>✓</em>`;
        article.addEventListener("click", async () => {
          const newState = !article.classList.contains("checked");
          article.classList.toggle("checked", newState);
          const checkbox = article.querySelector(".checkbox");
          checkbox.classList.toggle("checked", newState);
          checkbox.textContent = newState ? "✓" : "";
          refreshProgress();
          await api("checklist.php", { method: "PUT", body: JSON.stringify({ checklist_id: item.checklist_id, completat: newState ? 1 : 0 }) });
        });
        box.appendChild(article);
      });
      refreshProgress();
    }
  } catch(e) { console.warn("No s'ha pogut carregar checklist", e); }

  const logout = document.getElementById("logoutBtn");
  if (logout) logout.addEventListener("click", () => fetch("../api/logout.php", { credentials: "include" }));
});
