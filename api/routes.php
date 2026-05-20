<?php
require 'db.php';
$sql = "SELECT r.*, o.nom AS origen, o.latitud AS origen_latitud, o.longitud AS origen_longitud,
               d.nom AS desti, d.latitud AS desti_latitud, d.longitud AS desti_longitud
        FROM routes r
        JOIN locations o ON o.location_id = r.origin_location_id
        JOIN locations d ON d.location_id = r.destination_location_id
        ORDER BY r.temps_estimado_min ASC";
response_json(['success' => true, 'data' => $conn->query($sql)->fetch_all(MYSQLI_ASSOC)]);
?>
