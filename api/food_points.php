<?php
require 'db.php';
$q = strtolower(trim($_GET['q'] ?? ''));
$sql = "SELECT fp.food_point_id, fp.nom, fp.tipus_menjar, fp.temps_cua, fp.obert, l.location_id, l.latitud, l.longitud, l.descripcio
        FROM food_points fp JOIN locations l ON l.location_id = fp.location_id";
if ($q) {
    $like = "%$q%";
    $stmt = $conn->prepare($sql . " WHERE LOWER(fp.nom) LIKE ? OR LOWER(fp.tipus_menjar) LIKE ? ORDER BY fp.temps_cua ASC");
    $stmt->bind_param('ss', $like, $like);
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
} else {
    $rows = $conn->query($sql . ' ORDER BY fp.temps_cua ASC, fp.nom')->fetch_all(MYSQLI_ASSOC);
}
response_json(['success' => true, 'data' => $rows]);
?>
