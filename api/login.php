<?php
require 'db.php';
$data = input_json();
$email = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';

if (!$email || !$password) response_json(['success' => false, 'message' => 'Falten dades.'], 400);

$stmt = $conn->prepare('SELECT user_id, nom, email, password_hash, rol FROM users WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$user || !password_verify($password, $user['password_hash'])) {
    response_json(['success' => false, 'message' => 'Correu o contrasenya incorrectes.'], 401);
}

$upd = $conn->prepare('UPDATE users SET last_login = NOW() WHERE user_id = ?');
$upd->bind_param('i', $user['user_id']);
$upd->execute();

$_SESSION['user_id'] = (int) $user['user_id'];
$_SESSION['rol'] = $user['rol'];
unset($user['password_hash']);
$user['name'] = $user['nom'];
$user['role'] = $user['rol'];
response_json(['success' => true, 'user' => $user]);
?>
