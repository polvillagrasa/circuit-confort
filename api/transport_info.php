<?php
require 'db.php';
$sql = 'SELECT ti.*, e.nom AS event_nom FROM transport_info ti LEFT JOIN events e ON e.event_id = ti.event_id WHERE ti.actiu = 1 ORDER BY FIELD(ti.tipus,"tren","bus","shuttle","parking","cotxe"), ti.transport_id';
response_json(['success' => true, 'data' => $conn->query($sql)->fetch_all(MYSQLI_ASSOC)]);
?>
