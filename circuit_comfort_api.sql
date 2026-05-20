CREATE DATABASE IF NOT EXISTS circuit_comfort CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE circuit_comfort;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('visitant', 'admin') NOT NULL DEFAULT 'visitant',
    last_login DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    descripcio TEXT NOT NULL,
    event_date DATE NOT NULL,
    capacitat INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_event (
    user_event_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    ticket_type VARCHAR(50) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(120) NOT NULL,
    tipus ENUM('porta','bany','ombra','aigua','menjar','transport','parking','zona_public') NOT NULL,
    latitud DECIMAL(10,7) NOT NULL,
    longitud DECIMAL(10,7) NOT NULL,
    descripcio TEXT NULL
);

CREATE TABLE IF NOT EXISTS service_points (
    service_point_id INT AUTO_INCREMENT PRIMARY KEY,
    location_id INT NOT NULL,
    tipus ENUM('ombra','aigua','bany','assistencia','informacio') NOT NULL,
    descripcio TEXT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS food_points (
    food_point_id INT AUTO_INCREMENT PRIMARY KEY,
    location_id INT NOT NULL,
    nom VARCHAR(120) NOT NULL,
    tipus_menjar VARCHAR(100) NOT NULL,
    temps_cua INT DEFAULT 0,
    obert BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NULL,
    tipus ENUM('calor','aglomeracio','transport','seguretat','avis_oficial') NOT NULL,
    missatge TEXT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    llegida BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    origin_location_id INT NOT NULL,
    destination_location_id INT NOT NULL,
    distancia_km DECIMAL(6,2) NOT NULL,
    temps_estimado_min INT NOT NULL,
    es_accessible TINYINT(1) DEFAULT 1,
    FOREIGN KEY (origin_location_id) REFERENCES locations(location_id) ON DELETE CASCADE,
    FOREIGN KEY (destination_location_id) REFERENCES locations(location_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS checklist (
    checklist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item VARCHAR(150) NOT NULL,
    completat BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transport_info (
    transport_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NULL,
    tipus ENUM('cotxe','tren','bus','shuttle','parking') NOT NULL,
    descripcio TEXT NOT NULL,
    ruta VARCHAR(255),
    temps_estimado_min INT,
    actiu BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE SET NULL
);

INSERT INTO events (nom, descripcio, event_date, capacitat)
SELECT 'GP Espanya F1', 'Gran Premi al Circuit de Barcelona-Catalunya', '2026-06-14', 140000
WHERE NOT EXISTS (SELECT 1 FROM events WHERE nom = 'GP Espanya F1');

INSERT INTO locations (nom, tipus, latitud, longitud, descripcio)
SELECT * FROM (
  SELECT 'Circuit de Barcelona-Catalunya','zona_public',41.5686000,2.2578000,'Centre del circuit' UNION ALL
  SELECT 'Font Recta Principal','aigua',41.5692000,2.2589000,'Font d’aigua potable' UNION ALL
  SELECT 'Punt Hidratació T1','aigua',41.5701000,2.2603000,'Punt d’aigua proper a T1' UNION ALL
  SELECT 'WC Tribuna G','bany',41.5679000,2.2591000,'Lavabos públics' UNION ALL
  SELECT 'Carpa Ombra Fan Zone','ombra',41.5674000,2.2593000,'Zona de descans amb ombra' UNION ALL
  SELECT 'Post Mèdic Principal','zona_public',41.5680000,2.2569000,'Assistència sanitària' UNION ALL
  SELECT 'Food Truck Pizza','menjar',41.5677000,2.2607000,'Zona de menjar' UNION ALL
  SELECT 'Burger Station','menjar',41.5689000,2.2612000,'Zona de restauració' UNION ALL
  SELECT 'Estació Montmeló','transport',41.5550000,2.2500000,'Estació de tren més propera' UNION ALL
  SELECT 'Parking C','parking',41.5710000,2.2532000,'Aparcament recomanat'
) AS seed(nom, tipus, latitud, longitud, descripcio)
WHERE NOT EXISTS (SELECT 1 FROM locations WHERE locations.nom = seed.nom);

INSERT INTO service_points (location_id, tipus, descripcio)
SELECT l.location_id, 'aigua', l.descripcio FROM locations l WHERE l.tipus='aigua' AND NOT EXISTS (SELECT 1 FROM service_points sp WHERE sp.location_id=l.location_id)
UNION ALL
SELECT l.location_id, 'bany', l.descripcio FROM locations l WHERE l.tipus='bany' AND NOT EXISTS (SELECT 1 FROM service_points sp WHERE sp.location_id=l.location_id)
UNION ALL
SELECT l.location_id, 'ombra', l.descripcio FROM locations l WHERE l.tipus='ombra' AND NOT EXISTS (SELECT 1 FROM service_points sp WHERE sp.location_id=l.location_id)
UNION ALL
SELECT l.location_id, 'assistencia', l.descripcio FROM locations l WHERE l.nom='Post Mèdic Principal' AND NOT EXISTS (SELECT 1 FROM service_points sp WHERE sp.location_id=l.location_id);

INSERT INTO food_points (location_id, nom, tipus_menjar, temps_cua, obert)
SELECT l.location_id, 'Food Truck Pizza', 'Pizza', 5, 1 FROM locations l WHERE l.nom='Food Truck Pizza' AND NOT EXISTS (SELECT 1 FROM food_points fp WHERE fp.nom='Food Truck Pizza')
UNION ALL
SELECT l.location_id, 'Burger Station', 'Hamburgueses', 8, 1 FROM locations l WHERE l.nom='Burger Station' AND NOT EXISTS (SELECT 1 FROM food_points fp WHERE fp.nom='Burger Station');

INSERT INTO routes (origin_location_id, destination_location_id, distancia_km, temps_estimado_min, es_accessible)
SELECT o.location_id, d.location_id, 0.80, 12, 1 FROM locations o, locations d
WHERE o.nom='Circuit de Barcelona-Catalunya' AND d.nom='WC Tribuna G'
AND NOT EXISTS (SELECT 1 FROM routes);

INSERT INTO transport_info (event_id, tipus, descripcio, ruta, temps_estimado_min, actiu)
SELECT e.event_id, 'tren', 'Tren R2 Nord fins a Montmeló', 'R2 Nord', 12, 1 FROM events e WHERE e.nom='GP Espanya F1'
AND NOT EXISTS (SELECT 1 FROM transport_info WHERE tipus='tren')
UNION ALL
SELECT e.event_id, 'bus', 'Bus especial fins al Circuit', 'Sagalés especial', 4, 1 FROM events e WHERE e.nom='GP Espanya F1'
AND NOT EXISTS (SELECT 1 FROM transport_info WHERE tipus='bus')
UNION ALL
SELECT e.event_id, 'parking', 'Accés Parking C per AP-7 / C-17', 'Parking C', 18, 1 FROM events e WHERE e.nom='GP Espanya F1'
AND NOT EXISTS (SELECT 1 FROM transport_info WHERE tipus='parking');
