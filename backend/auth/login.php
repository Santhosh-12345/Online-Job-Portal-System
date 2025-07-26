<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


include '../config/db.php';

// Read input
$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

// Input validation
if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["status" => "fail", "message" => "Email and password are required."]);
    exit;
}

// Check user
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {
    echo json_encode([
        "status" => "success",
        "user" => [
            "id" => $user['id'],
            "name" => $user['full_name'],
            "role" => $user['role']
        ]
    ]);
} else {
    http_response_code(401); // Unauthorized
    echo json_encode(["status" => "fail", "message" => "Invalid credentials."]);
}
?>
