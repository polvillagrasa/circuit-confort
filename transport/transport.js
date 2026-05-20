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
  },

  createCircuitMap(elementId, options = {}) {
    if (!document.getElementById(elementId) || typeof L === "undefined") return;

    const circuit = [41.5686, 2.2578];

    const map = L.map(elementId, {
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
      tap: true
    }).setView(circuit, options.zoom || 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap"
    }).addTo(map);

    function googleMapsPopup(lat, lng, name, description = "") {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

      return `
        <div style="min-width:170px;font-family:Barlow,sans-serif;">
          <strong style="font-size:15px;color:#111;">${name}</strong>
          ${
            description
              ? `<p style="margin:6px 0 10px;color:#555;font-size:13px;">${description}</p>`
              : ""
          }
          <a href="${url}" target="_blank" style="
            display:block;
            text-align:center;
            background:#E8001E;
            color:white;
            padding:10px 14px;
            border-radius:10px;
            text-decoration:none;
            font-weight:900;
            letter-spacing:1px;
          ">
            ANAR-HI
          </a>
        </div>
      `;
    }

    const redIcon = L.divIcon({
      className: "cc-map-marker",
      html: `
        <div style="
          background:#E8001E;
          color:white;
          width:34px;
          height:34px;
          border-radius:12px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight:900;
          border:2px solid white;
          box-shadow:0 4px 14px rgba(0,0,0,.35);
        ">🏁</div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const trainIcon = L.divIcon({
      className: "cc-map-marker",
      html: `
        <div style="
          background:#E8001E;
          color:white;
          width:32px;
          height:32px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          border:2px solid white;
        ">🚆</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const busIcon = L.divIcon({
      className: "cc-map-marker",
      html: `
        <div style="
          background:#B50018;
          color:white;
          width:32px;
          height:32px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          border:2px solid white;
        ">🚌</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const parkingIcon = L.divIcon({
      className: "cc-map-marker",
      html: `
        <div style="
          background:#1A1A1A;
          color:white;
          width:32px;
          height:32px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          border:2px solid #E8001E;
        ">🚗</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    L.marker([41.5568, 2.2498], { icon: trainIcon })
      .addTo(map)
      .bindPopup(
        googleMapsPopup(
          41.5568,
          2.2498,
          "Estació de Montmeló",
          "Arribada recomanada amb tren R2 Nord"
        )
      );

    L.marker([41.5669, 2.2539], { icon: busIcon })
      .addTo(map)
      .bindPopup(
        googleMapsPopup(
          41.5669,
          2.2539,
          "Parada bus especial Circuit",
          "Servei especial Sagalés"
        )
      );

    L.marker([41.5722, 2.2588], { icon: parkingIcon })
      .addTo(map)
      .bindPopup(
        googleMapsPopup(
          41.5722,
          2.2588,
          "Pàrquing C",
          "Accés recomanat per vehicle privat"
        )
      );

    const track = [
      [41.5709, 2.2550],
      [41.5710, 2.2590],
      [41.5700, 2.2630],
      [41.5680, 2.2640],
      [41.5666, 2.2610],
      [41.5668, 2.2570],
      [41.5685, 2.2545],
      [41.5709, 2.2550]
    ];

    L.polyline(track, {
      color: "#E8001E",
      weight: 5,
      opacity: 0.85
    }).addTo(map);

    if (options.route) {
      L.polyline(
        [
          [41.5568, 2.2498],
          [41.5669, 2.2539],
          [41.5686, 2.2578]
        ],
        {
          color: "#22C55E",
          weight: 4,
          dashArray: "8 8",
          opacity: 0.95
        }
      )
        .addTo(map)
        .bindPopup(
          googleMapsPopup(
            41.5686,
            2.2578,
            "Ruta recomanada",
            "Itinerari cap al Circuit de Barcelona-Catalunya"
          )
        );
    }

    setTimeout(() => map.invalidateSize(), 150);

    return map;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  CC.init();

  window.transportMap = CC.createCircuitMap("transportMap", {
    zoom: 14,
    route: true
  });
});
// --- API REST + TRANSPORT DINÀMIC ---
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("../api/transport_info.php", { credentials: "include" }).then(r => r.json());
    const data = res.data || [];
    document.querySelectorAll(".transport-card").forEach(c => c.remove());
    const firstTitle = document.querySelector(".transport-section-title");
    data.forEach(t => {
      const card = document.createElement("article");
      card.className = "transport-card";
      const icon = t.tipus === "tren" ? "🚆" : t.tipus === "bus" || t.tipus === "shuttle" ? "🚌" : t.tipus === "parking" ? "🅿️" : "🚗";
      card.innerHTML = `<div class="transport-icon">${icon}</div><div><strong>${t.tipus.toUpperCase()}</strong><p>${t.descripcio}</p><small class="green">${t.ruta || "Servei actiu"}</small></div><b>${t.temps_estimado_min || "--"} min</b>`;
      firstTitle.insertAdjacentElement("afterend", card);
    });
  } catch(e) { console.warn("No s'ha pogut carregar transport", e); }
});
