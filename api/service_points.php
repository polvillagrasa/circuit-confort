<?php
require 'db.php';
$sql = "SELECT sp.service_point_id, sp.tipus, sp.descripcio, sp.disponible, l.location_id, l.nom, l.latitud, l.longitud, l.tipus AS location_tipus
        FROM service_points sp JOIN locations l ON l.location_id = sp.location_id
        ORDER BY sp.tipus, l.nom";
response_json(['success' => true, 'data' => $conn->query($sql)->fetch_all(MYSQLI_ASSOC)]);
?>
