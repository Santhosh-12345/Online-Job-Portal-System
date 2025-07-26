<?php
include_once('../config/db.php');
header('Content-Type: application/json');

// Validate user_id input
$userId = $_GET['user_id'] ?? null;
if (!$userId) {
    echo json_encode(['error' => 'Missing user_id']);
    exit;
}

// Fix: Use PDO and correct table/column names
$sql = "SELECT j.id, j.title, j.company, j.location, j.category, a.applied_at 
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.seeker_id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$userId]);
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($result);
?>
