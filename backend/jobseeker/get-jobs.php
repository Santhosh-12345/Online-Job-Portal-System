<?php
// getjobs.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $sql = "SELECT id, posted_by, title, company, location, type, salary, description, postedDate, skills, category 
            FROM jobs 
            ORDER BY postedDate DESC";

    $stmt = $pdo->query($sql);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($jobs);
} catch (Exception $e) {
    echo json_encode(['error' => 'Failed to fetch jobs.']);
}
?>
