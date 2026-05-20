<?php
require 'db.php';
$user_id = require_login();
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT a.*, e.nom AS event_nom FROM alerts a LEFT JOIN events e ON e.event_id = a.event_id WHERE a.user_id = ? ORDER BY a.data_hora DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    response_json(['success' => true, 'data' => $stmt->get_result()->fetch_all(MYSQLI_ASSOC)]);
}
$data = input_json();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $event_id = isset($data['event_id']) ? (int)$data['event_id'] : null;
    $tipus = $data['tipus'] ?? 'avis_oficial';
    $missatge = $data['missatge'] ?? '';
    $stmt = $conn->prepare('INSERT INTO alerts (user_id, event_id, tipus, missatge) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('iiss', $user_id, $event_id, $tipus, $missatge);
    response_json(['success' => $stmt->execute(), 'id' => $conn->insert_id]);
}
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $alert_id = (int)($data['alert_id'] ?? 0);
    $stmt = $conn->prepare('UPDATE alerts SET llegida = 1 WHERE alert_id = ? AND user_id = ?');
    $stmt->bind_param('ii', $alert_id, $user_id);
    response_json(['success' => $stmt->execute()]);
}
response_json(['success' => false, 'message' => 'Mètode no permès.'], 405);
?>
