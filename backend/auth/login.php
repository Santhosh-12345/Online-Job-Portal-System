<?php
require_once '../config/db.php'; // Adjust the path if needed

// CORS Headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

// Validate input
if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "status" => "fail", 
        "message" => "Email and password are required"
    ]);
    exit();
}

try {
    // Get DB connection
    $pdo = getDBConnection();

    // Check user by email
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verify password
    if ($user && password_verify($password, $user['password'])) {
        echo json_encode([
            "success" => true,
            "status" => "success",
            "user" => [
                "id" => $user['id'],
                "full_name" => $user['full_name'],
                "email" => $user['email'],
                "role" => $user['role']
            ],
            "message" => "Login successful"
        ]);
        exit();
    } else {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "status" => "fail",
            "message" => "Invalid email or password"
        ]);
        exit();
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
    exit();
}
