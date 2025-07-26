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

$data = json_decode(file_get_contents("php://input"), true);

// Input validation
if (!isset($data['fullName'], $data['email'], $data['password'], $data['role'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
    exit;
}

$fullName = trim($data['fullName']);
$email = trim($data['email']);
$password = password_hash($data['password'], PASSWORD_BCRYPT);
$role = trim($data['role']); // "jobseeker" or "employer"

// Validate role
if (!in_array($role, ['jobseeker', 'employer'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid user role."]);
    exit;
}

// Check if user already exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->rowCount() > 0) {
    http_response_code(409); // Conflict
    echo json_encode(["success" => false, "message" => "Email already registered."]);
    exit;
}

// Insert new user
$stmt = $pdo->prepare("INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)");
$success = $stmt->execute([$fullName, $email, $password, $role]);

if ($success) {
    http_response_code(201); // Created
    echo json_encode(["success" => true, "message" => "User registered successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Registration failed. Try again."]);
}
