<?php
include_once('../config/db.php');
header('Content-Type: application/json');

$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    echo json_encode(['error' => 'Missing user_id']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, full_name, email, role FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    echo json_encode($user);
} else {
    echo json_encode(['error' => 'User not found']);
}
?>
