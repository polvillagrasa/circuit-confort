<?php
require 'db.php';
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $res = $conn->query('SELECT event_id, nom, descripcio, event_date, capacitat, created_at FROM events ORDER BY event_date ASC');
    response_json(['success' => true, 'data' => $res->fetch_all(MYSQLI_ASSOC)]);
}
require_login();
$data = input_json();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $stmt = $conn->prepare('INSERT INTO events (nom, descripcio, event_date, capacitat) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('sssi', $data['nom'], $data['descripcio'], $data['event_date'], $data['capacitat']);
    response_json(['success' => $stmt->execute(), 'id' => $conn->insert_id]);
}
response_json(['success' => false, 'message' => 'Mètode no permès.'], 405);
?>
