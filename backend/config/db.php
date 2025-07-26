<?php
$host = 'localhost';
$db = 'job_portal';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

try {
  $pdo = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $pass);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  echo "DB Connection Failed: " . $e->getMessage();
  exit();
}
?>
