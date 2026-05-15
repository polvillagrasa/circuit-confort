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
  },

  createCircuitMap(elementId, options = {}) {
    if (!document.getElementById(elementId) || typeof L === "undefined") return;

    const circuit = [41.5686, 2.2578];

    const map = L.map(elementId, {
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
      tap: true
    }).setView(circuit, options.zoom || 15);

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

    const circuitIcon = L.divIcon({
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

    const waterIcon = L.divIcon({
      className: "cc-map-marker",
      html: `
        <div style="
          background:#1a4a6e;
          color:white;
          width:30px;
          height:30px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          border:2px solid #4FB3E8;
        ">💧</div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const shadowIcon = L.divIcon({
      className: "cc-map-marker",
      html: `
        <div style="
          background:#14532D;
          color:white;
          width:30px;
          height:30px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          border:2px solid #22C55E;
        ">🌳</div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const medicalIcon = L.divIcon({
      className: "cc-map-marker",
      html: `
        <div style="
          background:#7F1D1D;
          color:white;
          width:30px;
          height:30px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          border:2px solid #F87171;
        ">🏥</div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const wcIcon = L.divIcon({
      className: "cc-map-marker",
      html: `
        <div style="
          background:#12383c;
          color:white;
          width:30px;
          height:30px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          border:2px solid #4ECDC4;
        ">🚻</div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    L.marker(circuit, { icon: circuitIcon })
      .addTo(map)
      .bindPopup(
        googleMapsPopup(
          41.5686,
          2.2578,
          "Circuit de Barcelona-Catalunya",
          "Punt central del circuit"
        )
      );

    L.marker([41.5702, 2.2570], { icon: waterIcon })
      .addTo(map)
      .bindPopup(
        googleMapsPopup(
          41.5702,
          2.2570,
          "Punt d'hidratació",
          "Font d'aigua propera a la recta principal"
        )
      );

    L.marker([41.5674, 2.2593], { icon: shadowIcon })
      .addTo(map)
      .bindPopup(
        googleMapsPopup(
          41.5674,
          2.2593,
          "Zona d'ombra",
          "Espai recomanat per descansar i evitar el sol"
        )
      );

    L.marker([41.5690, 2.2555], { icon: medicalIcon })
      .addTo(map)
      .bindPopup(
        googleMapsPopup(
          41.5690,
          2.2555,
          "Post mèdic",
          "Assistència mèdica propera"
        )
      );

    L.marker([41.5695, 2.2621], { icon: wcIcon })
      .addTo(map)
      .bindPopup(
        googleMapsPopup(
          41.5695,
          2.2621,
          "WC zona tribunes",
          "Lavabos propers"
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
          [41.5686, 2.2578],
          [41.5702, 2.2570],
          [41.5674, 2.2593]
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
            41.5674,
            2.2593,
            "Ruta recomanada",
            "Ruta cap a zona d'ombra i hidratació"
          )
        );
    }

    setTimeout(() => map.invalidateSize(), 150);

    return map;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  CC.init();

  CC.createCircuitMap("alertMap", {
    zoom: 15,
    route: false
  });
});