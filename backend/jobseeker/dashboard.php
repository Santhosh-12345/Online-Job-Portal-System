<?php
include '../config/db.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing user_id']);
    exit;
}

try {
    // ✅ Get PDO connection from your function
    $pdo = getDBConnection();

    // Fetch user data
    $stmt = $pdo->prepare("SELECT id, full_name, email, role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'User not found']);
        exit;
    }

    // Fetch applied jobs
    $stmt = $pdo->prepare("SELECT j.id, j.title, j.company, j.location, a.applied_at 
                          FROM applications a
                          JOIN jobs j ON a.job_id = j.id
                          WHERE a.seeker_id = ?");
    $stmt->execute([$userId]);
    $appliedJobs = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'user' => $user,
        'appliedJobs' => $appliedJobs
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error']);
}
?>
