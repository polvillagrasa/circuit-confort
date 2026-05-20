<?php
require 'db.php';
$data = input_json();
$nom = trim($data['name'] ?? $data['nom'] ?? '');
$email = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';
$rol = strtolower(trim($data['role'] ?? 'visitant'));
$rol = $rol === 'admin' ? 'admin' : 'visitant';

if (mb_strlen($nom) < 3 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) {
    response_json(['success' => false, 'message' => 'Dades no vàlides.'], 400);
}

$check = $conn->prepare('SELECT user_id FROM users WHERE email = ?');
$check->bind_param('s', $email);
$check->execute();
if ($check->get_result()->num_rows > 0) response_json(['success' => false, 'message' => 'Aquest correu ja existeix.'], 409);

$passwordHash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare('INSERT INTO users (nom, email, password_hash, rol) VALUES (?, ?, ?, ?)');
$stmt->bind_param('ssss', $nom, $email, $passwordHash, $rol);

if (!$stmt->execute()) response_json(['success' => false, 'message' => 'Error al registrar: ' . $conn->error], 500);
response_json(['success' => true, 'message' => 'Usuari registrat correctament.']);
?>
