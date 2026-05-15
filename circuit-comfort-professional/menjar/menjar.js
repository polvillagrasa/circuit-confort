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

    const pizzaIcon = L.divIcon({
      className: "cc-map-marker",
      html: `
        <div style="
          background:#3a2a0a;
          color:white;
          width:32px;
          height:32px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          border:2px solid #F59E0B;
        ">🍕</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const burgerIcon = L.divIcon({
      className: "cc-map-marker",
      html: `
        <div style="
          background:#3a2a0a;
          color:white;
          width:32px;
          height:32px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          border:2px solid #F59E0B;
        ">🍔</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const frankfurtIcon = L.divIcon({
      className: "cc-map-marker",
      html: `
        <div style="
          background:#3a2a0a;
          color:white;
          width:32px;
          height:32px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          border:2px solid #F59E0B;
        ">🌭</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const iceCreamIcon = L.divIcon({
      className: "cc-map-marker",
      html: `
        <div style="
          background:#3a2a0a;
          color:white;
          width:32px;
          height:32px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          border:2px solid #F59E0B;
        ">🍦</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
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

    L.marker([41.5677, 2.2607], { icon: pizzaIcon })
      .addTo(map)
      .bindPopup(
        googleMapsPopup(
          41.5677,
          2.2607,
          "Food Truck Pizza",
          "Cua baixa: 5 min"
        )
      );

    L.marker([41.5682, 2.2587], { icon: burgerIcon })
      .addTo(map)
      .bindPopup(
        googleMapsPopup(
          41.5682,
          2.2587,
          "Burger Station",
          "A prop de Tribuna G"
        )
      );

    L.marker([41.5669, 2.2624], { icon: frankfurtIcon })
      .addTo(map)
      .bindPopup(
        googleMapsPopup(
          41.5669,
          2.2624,
          "Frankfurt Corner",
          "Zona Fan Village"
        )
      );

    L.marker([41.5699, 2.2562], { icon: iceCreamIcon })
      .addTo(map)
      .bindPopup(
        googleMapsPopup(
          41.5699,
          2.2562,
          "Gelateria Circuit",
          "Gelats i begudes fredes"
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
          [41.5682, 2.2587],
          [41.5677, 2.2607]
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
            41.5677,
            2.2607,
            "Ruta recomanada",
            "Ruta cap al Food Truck Pizza"
          )
        );
    }

    setTimeout(() => map.invalidateSize(), 150);

    return map;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  CC.init();

  CC.createCircuitMap("foodMap", {
    zoom: 15,
    route: true
  });

  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
    });
  });

  document.getElementById("foodButton").addEventListener("click", () => {
    const q = document.getElementById("foodSearch").value.trim();

    alert(q ? `Buscant: ${q}` : "Escriu què vols buscar.");
  });
});
