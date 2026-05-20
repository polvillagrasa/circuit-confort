<?php
require 'db.php';
$tipus = $_GET['tipus'] ?? '';
if ($tipus) {
    $stmt = $conn->prepare('SELECT * FROM locations WHERE tipus = ? ORDER BY nom');
    $stmt->bind_param('s', $tipus);
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
} else {
    $rows = $conn->query('SELECT * FROM locations ORDER BY tipus, nom')->fetch_all(MYSQLI_ASSOC);
}
response_json(['success' => true, 'data' => $rows]);
?>
