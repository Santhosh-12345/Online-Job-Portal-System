<?php
// Enable error reporting for development (remove in production)
ini_set('display_errors', 0);
error_reporting(0);

// Set headers first to prevent any output before them
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Max-Age: 3600");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database configuration
require_once '../../config/db.php';

// Get input data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate input
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid input data']);
    exit;
}

try {
    $pdo = getDBConnection();
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Prepare SQL statement
        $stmt = $pdo->prepare("
            INSERT INTO jobs 
            (title, company, location, type, salary, description, posted_by, postedDate, skills, category)
            VALUES (:title, :company, :location, :type, :salary, :description, :posted_by, NOW(), :skills, :category)
        ");
        
        // Execute with parameters
        $success = $stmt->execute([
            ':title' => $data['title'] ?? '',
            ':company' => $data['company'] ?? '',
            ':location' => $data['location'] ?? '',
            ':type' => $data['type'] ?? 'Full-time',
            ':salary' => $data['salary'] ?? '',
            ':description' => $data['description'] ?? '',
            ':posted_by' => $data['user_id'] ?? 0,
            ':skills' => isset($data['skills']) ? (is_array($data['skills']) ? implode(',', $data['skills']) : $data['skills']) : '',
            ':category' => $data['category'] ?? 'IT'
        ]);
        
        if ($success) {
            echo json_encode([
                'success' => true,
                'message' => 'Job posted successfully'
            ]);
        } else {
            throw new Exception("Failed to insert job");
        }
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Database error',
        'message' => $e->getMessage()
    ]);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Server error',
        'message' => $e->getMessage()
    ]);
    exit;
}