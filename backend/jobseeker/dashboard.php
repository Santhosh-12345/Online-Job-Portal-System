<?php
// ✅ 1. Display errors temporarily (only for debugging)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// ✅ 2. CORS headers for React to access
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ✅ 3. Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ 4. DB Connection
include_once('../config/db.php');

// ✅ 5. Validate user ID
$userId = $_GET['user_id'] ?? null;
if (!$userId) {
    echo json_encode(['success' => false, 'error' => 'Missing user_id']);
    exit;
}

// ✅ 6. Fetch seeker profile
$userStmt = $pdo->prepare("SELECT full_name, email, role FROM users WHERE id = ?");
$userStmt->execute([$userId]);
$user = $userStmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['success' => false, 'error' => 'User not found']);
    exit;
}

// ✅ 7. Fetch applied jobs
$sql = "SELECT j.id AS job_id, j.title, j.company, j.location, j.category,
               a.applied_at, a.status
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.seeker_id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$userId]);
$applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

// ✅ 8. Return structured JSON response
echo json_encode([
    'success' => true,
    'user' => [
        'name' => $user['full_name'],
        'email' => $user['email'],
        'role' => $user['role']
    ],
    'appliedJobs' => $applications
]);
?>
