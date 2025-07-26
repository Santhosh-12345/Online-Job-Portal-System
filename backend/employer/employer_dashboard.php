<?php
// Turn off all error reporting for production
error_reporting(0);
ini_set('display_errors', 0);

// Set headers first to prevent any output before headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection function
function getDBConnection() {
    $host = 'localhost';
    $db   = 'job_portal';
    $user = 'root';
    $pass = '';
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        return new PDO($dsn, $user, $pass, $options);
    } catch (PDOException $e) {
        // Return JSON error instead of outputting HTML
        die(json_encode([
            'success' => false,
            'error' => 'Database connection failed',
            'message' => $e->getMessage()
        ]));
    }
}

try {
    $pdo = getDBConnection();
    
    $userId = $_GET['user_id'] ?? null;
    if (!$userId || !is_numeric($userId)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid user ID']);
        exit;
    }

    // Get employer details
    $stmt = $pdo->prepare("SELECT id, full_name, email, role FROM users WHERE id = ? AND role = 'employer'");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Employer not found']);
        exit;
    }

    // Get jobs
    $stmt = $pdo->prepare("SELECT id, title, company, location, type, salary, postedDate FROM jobs WHERE posted_by = ?");
    $stmt->execute([$userId]);
    $jobs = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'user' => $user,
        'jobs' => $jobs,
        'stats' => [
            'total_jobs' => count($jobs)
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error',
        'message' => $e->getMessage()
    ]);
}