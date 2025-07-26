<?php
include_once('../config/db.php');
header('Content-Type: application/json');

// Validate user_id input
$employerId = $_GET['user_id'] ?? null;
if (!$employerId) {
    echo json_encode(['error' => 'Missing user_id']);
    exit;
}

// Fix: Use PDO and correct table/column names
$sql = "SELECT j.id AS job_id, j.title, j.category, j.location, j.postedDate,
               a.seeker_id, u.full_name AS applicant_name, a.applied_at
        FROM jobs j
        LEFT JOIN applications a ON j.id = a.job_id
        LEFT JOIN users u ON a.seeker_id = u.id
        WHERE j.posted_by = ?
        ORDER BY j.postedDate DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute([$employerId]);
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Group applications under each job
$dashboardData = [];

foreach ($result as $row) {
    $jobId = $row['job_id'];
    if (!isset($dashboardData[$jobId])) {
        $dashboardData[$jobId] = [
            'job_id' => $jobId,
            'title' => $row['title'],
            'category' => $row['category'],
            'location' => $row['location'],
            'postedDate' => $row['postedDate'],
            'applications' => []
        ];
    }

    if ($row['seeker_id']) {
        $dashboardData[$jobId]['applications'][] = [
            'seeker_id' => $row['seeker_id'],
            'name' => $row['applicant_name'],
            'applied_at' => $row['applied_at']
        ];
    }
}

echo json_encode(array_values($dashboardData));
?>
