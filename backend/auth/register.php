<?php
include '../config/db.php';
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$required = ['fullName', 'email', 'password', 'role'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing required field: $field"]);
        exit;
    }
}

$fullName = trim($data['fullName']);
$email = trim($data['email']);
$password = password_hash($data['password'], PASSWORD_BCRYPT);
$role = in_array($data['role'], ['employer', 'jobseeker']) ? $data['role'] : null;

if (!$role) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid role specified"]);
    exit;
}

try {
    // Check if email exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(["success" => false, "message" => "Email already registered"]);
        exit;
    }

    // Insert new user
    $stmt = $pdo->prepare("INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->execute([$fullName, $email, $password, $role]);
    
    $userId = $pdo->lastInsertId();
    
    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "User registered successfully",
        "user_id" => $userId
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Registration failed", "error" => $e->getMessage()]);
}
?>