<?php
session_start();
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'circuit_comfort';

$conn = new mysqli($host, $user, $password, $database);
header('Content-Type: application/json; charset=utf-8');

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Connexió fallida: ' . $conn->connect_error]);
    exit;
}
$conn->set_charset('utf8mb4');

function input_json(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function response_json($data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function require_login(): int {
    if (!isset($_SESSION['user_id'])) {
        response_json(['success' => false, 'message' => 'Has d\'iniciar sessió.'], 401);
    }
    return (int) $_SESSION['user_id'];
}
?>
