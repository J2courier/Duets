<?php
require_once '../../authentication/SessionManager.php';
require_once '../../authentication/DatabaseManager.php';

SessionManager::startSession();

if (!SessionManager::isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

$user_id = $_SESSION['user_id'];

// Get task counts
$db = new DatabaseManager();
$conn = $db->getConnection();

// Total tasks
$totalQuery = "SELECT COUNT(*) as total FROM tasks WHERE user_id = ?";
$stmt = $conn->prepare($totalQuery);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$totalResult = $stmt->get_result()->fetch_assoc();
$total = $totalResult['total'];

// Work tasks
$workQuery = "SELECT COUNT(*) as work FROM tasks WHERE user_id = ? AND category = 'work'";
$stmt = $conn->prepare($workQuery);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$workResult = $stmt->get_result()->fetch_assoc();
$work = $workResult['work'];

// School tasks
$schoolQuery = "SELECT COUNT(*) as school FROM tasks WHERE user_id = ? AND category = 'school'";
$stmt = $conn->prepare($schoolQuery);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$schoolResult = $stmt->get_result()->fetch_assoc();
$school = $schoolResult['school'];

// Personal tasks
$personalQuery = "SELECT COUNT(*) as personal FROM tasks WHERE user_id = ? AND category = 'personal'";
$stmt = $conn->prepare($personalQuery);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$personalResult = $stmt->get_result()->fetch_assoc();
$personal = $personalResult['personal'];

echo json_encode([
    'success' => true,
    'total' => $total,
    'work' => $work,
    'school' => $school,
    'personal' => $personal
]);
