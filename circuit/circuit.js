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
    const privatePages = ["circuit.html", "transport.html", "alertes.html", "menjar.html", "perfil.html"];
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

    const circuitCenter = [41.5686, 2.2578];

    const map = L.map(elementId, {
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
      tap: true
    }).setView(circuitCenter, options.zoom || 16);

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

    function makeIcon(emoji, bg, border, size = 34, rounded = "50%") {
      return L.divIcon({
        className: "cc-map-marker",
        html: `
          <div style="
            background:${bg};
            color:white;
            width:${size}px;
            height:${size}px;
            border-radius:${rounded};
            display:flex;
            align-items:center;
            justify-content:center;
            border:2px solid ${border};
            box-shadow:0 4px 14px rgba(0,0,0,.35);
            font-size:${Math.round(size * 0.56)}px;
          ">${emoji}</div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });
    }

    const icons = {
      tribuna: makeIcon("G", "#E8001E", "#FFFFFF", 34, "12px"),
      water: makeIcon("💧", "#1a4a6e", "#4FB3E8", 34),
      food: makeIcon("🍔", "#3a2a0a", "#F59E0B", 34),
      wc: makeIcon("🚻", "#12383c", "#4ECDC4", 34),
      medical: makeIcon("🏥", "#7F1D1D", "#F87171", 34)
    };

    const markerData = [
      {
        category: "tribuna",
        search: ["tribuna a", "a"],
        lat: 41.5704,
        lng: 2.2560,
        name: "Tribuna A",
        desc: "Zona de tribunes del Circuit de Barcelona-Catalunya",
        icon: makeIcon("A", "#E8001E", "#FFFFFF", 34, "12px")
      },
      {
        category: "tribuna",
        search: ["tribuna b", "b"],
        lat: 41.5701,
        lng: 2.2600,
        name: "Tribuna B",
        desc: "Zona de tribunes del Circuit de Barcelona-Catalunya",
        icon: makeIcon("B", "#E8001E", "#FFFFFF", 34, "12px")
      },
      {
        category: "tribuna",
        search: ["tribuna c", "c"],
        lat: 41.5690,
        lng: 2.2620,
        name: "Tribuna C",
        desc: "Zona de tribunes del Circuit de Barcelona-Catalunya",
        icon: makeIcon("C", "#E8001E", "#FFFFFF", 34, "12px")
      },
      {
        category: "tribuna",
        search: ["tribuna f", "f"],
        lat: 41.5670,
        lng: 2.2590,
        name: "Tribuna F",
        desc: "Zona de tribunes del Circuit de Barcelona-Catalunya",
        icon: makeIcon("F", "#E8001E", "#FFFFFF", 34, "12px")
      },
      {
        category: "tribuna",
        search: ["tribuna g", "g"],
        lat: 41.5682,
        lng: 2.2587,
        name: "Tribuna G",
        desc: "Zona de tribunes del Circuit de Barcelona-Catalunya",
        icon: makeIcon("G", "#E8001E", "#FFFFFF", 34, "12px")
      },
      {
        category: "water",
        lat: 41.5702,
        lng: 2.2570,
        name: "Punt d'hidratació",
        desc: "Font d'aigua propera a la recta principal",
        icon: icons.water
      },
      {
        category: "water",
        lat: 41.5672,
        lng: 2.2601,
        name: "Font zona Tribuna G",
        desc: "Font d'aigua propera a la Tribuna G",
        icon: icons.water
      },
      {
        category: "medical",
        lat: 41.5690,
        lng: 2.2555,
        name: "Primers auxilis",
        desc: "Assistència mèdica propera",
        icon: icons.medical
      },
      {
        category: "wc",
        lat: 41.5695,
        lng: 2.2621,
        name: "WC zona tribunes",
        desc: "Lavabos propers",
        icon: icons.wc
      },
      {
        category: "food",
        lat: 41.5677,
        lng: 2.2607,
        name: "Food Truck Pizza",
        desc: "Zona de menjar amb cua baixa",
        icon: icons.food
      }
    ];

    const markerRefs = markerData.map(item => {
      const marker = L.marker([item.lat, item.lng], { icon: item.icon })
        .addTo(map)
        .bindPopup(googleMapsPopup(item.lat, item.lng, item.name, item.desc));

      return { ...item, marker };
    });

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

    let routeLayer = null;

    if (options.route) {
      routeLayer = L.polyline(
        [
          [41.5686, 2.2578],
          [41.5702, 2.2570],
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
        .bindPopup(googleMapsPopup(41.5677, 2.2607, "Ruta recomanada", "Ruta cap al Food Truck Pizza"));
    }

    function setCategory(category) {
      markerRefs.forEach(item => {
        const shouldShow = category === "all" || item.category === category;

        if (shouldShow && !map.hasLayer(item.marker)) {
          item.marker.addTo(map);
        }

        if (!shouldShow && map.hasLayer(item.marker)) {
          map.removeLayer(item.marker);
        }
      });

      if (routeLayer) {
        if (category === "all") {
          routeLayer.addTo(map);
        } else if (map.hasLayer(routeLayer)) {
          map.removeLayer(routeLayer);
        }
      }
    }

    function searchTribuna(query) {
      const cleanQuery = query.trim().toLowerCase();
      const result = markerRefs.find(item => {
        if (item.category !== "tribuna") return false;
        return item.search.some(term => term === cleanQuery || term.includes(cleanQuery) || cleanQuery.includes(term));
      });

      if (!result) return null;

      setCategory("all");
      map.setView([result.lat, result.lng], 18, { animate: true });
      result.marker.openPopup();

      return result;
    }

    setTimeout(() => map.invalidateSize(), 150);

    return {
      map,
      setCategory,
      searchTribuna
    };
  }
};

document.addEventListener("DOMContentLoaded", () => {
  CC.init();

  const circuitMap = window.circuitMap = CC.createCircuitMap("circuitMap", {
    zoom: 16,
    route: true
  });

  const categoryMap = {
    "tot": "all",
    "fonts d'aigua": "water",
    "primers auxilis": "medical",
    "wc": "wc"
  };

  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      const text = chip.textContent.toLowerCase();
      const selectedCategory = Object.keys(categoryMap).find(key => text.includes(key));

      if (circuitMap && selectedCategory) {
        circuitMap.setCategory(categoryMap[selectedCategory]);
      }
    });
  });

  document.getElementById("searchTribuna").addEventListener("click", () => {
    const value = document.getElementById("tribunaInput").value.trim();

    CC.hideError("searchError");

    if (!value) {
      CC.showError("searchError", "Escriu una tribuna o zona del circuit.");
      return;
    }

    const found = circuitMap?.searchTribuna(value);

    if (!found) {
      CC.showError("searchError", "No hem trobat aquesta tribuna. Prova amb: Tribuna A, B, C, F o G.");
    }
  });
});

// --- API REST + MAPA DINÀMIC ---
document.addEventListener("DOMContentLoaded", async () => {
  const api = path => fetch(`../api/${path}`, { credentials: "include" }).then(r => r.json());
  const circuitMap = window.circuitMap?.map;
  if (!circuitMap || typeof L === "undefined") return;

  try {
    const [services, locations, routes] = await Promise.all([
      api("service_points.php"),
      api("locations.php"),
      api("routes.php")
    ]);

    const iconByType = tipus => L.divIcon({
      className: "cc-map-marker",
      html: `<div style="background:#111;color:white;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 3px 10px rgba(0,0,0,.35)">${tipus === "aigua" ? "💧" : tipus === "bany" ? "🚻" : tipus === "assistencia" ? "🏥" : tipus === "ombra" ? "🌳" : "📍"}</div>`,
      iconSize: [30, 30], iconAnchor: [15, 15]
    });

    [...(services.data || []), ...(locations.data || []).filter(l => !["aigua","bany","ombra"].includes(l.tipus))].forEach(p => {
      L.marker([Number(p.latitud), Number(p.longitud)], { icon: iconByType(p.tipus) })
        .addTo(circuitMap)
        .bindPopup(`<strong>${p.nom}</strong><br>${p.descripcio || p.location_tipus || p.tipus || "Punt del circuit"}<br><a target="_blank" href="https://www.google.com/maps/dir/?api=1&destination=${p.latitud},${p.longitud}">Obrir ruta</a>`);
    });

    const firstRoute = (routes.data || [])[0];
    if (firstRoute) {
      document.querySelector(".route-label").textContent = `RUTA MÉS RÀPIDA A ${firstRoute.desti.toUpperCase()}`;
      document.querySelector(".route-main strong").textContent = firstRoute.temps_estimado_min;
    }
  } catch (e) {
    console.warn("No s'han pogut carregar les dades API del circuit", e);
  }
});
