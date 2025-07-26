<?php
// Allow requests from your frontend origin
header("Access-Control-Allow-Origin: http://localhost:3000");

// Allow specific methods (adjust if needed)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Allow specific headers (adjust if needed)
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'] ?? '';
$company = $data['company'] ?? '';
$location = $data['location'] ?? '';
$type = $data['type'] ?? '';
$salary = $data['salary'] ?? '';
$description = $data['description'] ?? '';
$skills = $data['skills'] ?? '';
$category = $data['category'] ?? '';
$posted_by = $data['posted_by'] ?? '';

if (!$title || !$company || !$location || !$type || !$salary || !$description || !$skills || !$category || !$posted_by) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO jobs (posted_by, title, company, location, type, salary, description, skills, category, postedDate) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$posted_by, $title, $company, $location, $type, $salary, $description, $skills, $category]);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
