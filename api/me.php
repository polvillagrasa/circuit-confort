<?php
require 'db.php';
$user_id = require_login();
$stmt = $conn->prepare('SELECT user_id, nom, email, rol, last_login, created_at FROM users WHERE user_id = ?');
$stmt->bind_param('i', $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$user['name'] = $user['nom'];
$user['role'] = $user['rol'];
response_json(['success' => true, 'user' => $user]);
?>
