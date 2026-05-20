# Circuit Comfort Professional - Connectat a MySQL

Projecte connectat amb API REST en PHP + MySQL per a Laragon.

## Instal·lació

1. Copia la carpeta a `C:\laragon\www\circuit-comfort-professional`.
2. Obre HeidiSQL i importa `circuit_comfort_api.sql`.
3. Obre el navegador a:
   `http://localhost/circuit-comfort-professional/index.html`

## Connexió BD

Fitxer: `api/db.php`

```php
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'circuit_comfort';
```

## API REST creada

- `api/register.php` - registre d'usuaris amb contrasenya encriptada.
- `api/login.php` - login amb sessió PHP i actualització de `last_login`.
- `api/logout.php` - tancar sessió.
- `api/me.php` - usuari actual.
- `api/events.php` - esdeveniments.
- `api/locations.php` - ubicacions del mapa.
- `api/service_points.php` - punts d'aigua, WC, ombra i assistència.
- `api/food_points.php` - punts de menjar.
- `api/alerts.php` - alertes de l'usuari.
- `api/routes.php` - rutes.
- `api/checklist.php` - checklist personal guardada a MySQL.
- `api/transport_info.php` - informació de transport.

## Mapes

Els mapes utilitzen Leaflet + OpenStreetMap. Les pàgines carreguen dades de MySQL i creen marcadors dinàmics amb enllaç a Google Maps.
