<?php
require 'db.php';
$user_id = require_login();
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->prepare('SELECT checklist_id, item, completat, created_at FROM checklist WHERE user_id = ? ORDER BY checklist_id');
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    if (!$rows) {
        foreach (['Entrades','Aigua','Crema solar +50 SPF','Sabates còmodes','Gorra'] as $i => $item) {
            $done = $i === 0 ? 1 : 0;
            $ins = $conn->prepare('INSERT INTO checklist (user_id, item, completat) VALUES (?, ?, ?)');
            $ins->bind_param('isi', $user_id, $item, $done);
            $ins->execute();
        }
        $stmt->execute();
        $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
    response_json(['success' => true, 'data' => $rows]);
}
$data = input_json();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $item = trim($data['item'] ?? '');
    $done = !empty($data['completat']) ? 1 : 0;
    $stmt = $conn->prepare('INSERT INTO checklist (user_id, item, completat) VALUES (?, ?, ?)');
    $stmt->bind_param('isi', $user_id, $item, $done);
    response_json(['success' => $stmt->execute(), 'id' => $conn->insert_id]);
}
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $id = (int)($data['checklist_id'] ?? 0);
    $done = !empty($data['completat']) ? 1 : 0;
    $stmt = $conn->prepare('UPDATE checklist SET completat = ? WHERE checklist_id = ? AND user_id = ?');
    $stmt->bind_param('iii', $done, $id, $user_id);
    response_json(['success' => $stmt->execute()]);
}
response_json(['success' => false, 'message' => 'Mètode no permès.'], 405);
?>
