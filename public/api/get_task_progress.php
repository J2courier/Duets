<?php
require_once '../../authentication/SessionManager.php';
require_once '../../authentication/DatabaseManager.php';

SessionManager::startSession();

if (!SessionManager::isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

$user_id = $_SESSION['user_id'];

// Create database connection
$db = new DatabaseManager();
$conn = $db->getConnection();

// Initialize progress array
$progress = [
    'work' => ['total' => 0, 'completed' => 0],
    'school' => ['total' => 0, 'completed' => 0],
    'personal' => ['total' => 0, 'completed' => 0],
    'total' => ['total' => 0, 'completed' => 0]
];

// Get work tasks
$workQuery = "SELECT COUNT(*) as total, SUM(completed) as completed FROM tasks WHERE user_id = ? AND category = 'work'";
$stmt = $conn->prepare($workQuery);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$workResult = $stmt->get_result()->fetch_assoc();
$progress['work']['total'] = (int)$workResult['total'];
$progress['work']['completed'] = (int)$workResult['completed'];

// Get school tasks
$schoolQuery = "SELECT COUNT(*) as total, SUM(completed) as completed FROM tasks WHERE user_id = ? AND category = 'school'";
$stmt = $conn->prepare($schoolQuery);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$schoolResult = $stmt->get_result()->fetch_assoc();
$progress['school']['total'] = (int)$schoolResult['total'];
$progress['school']['completed'] = (int)$schoolResult['completed'];

// Get personal tasks
$personalQuery = "SELECT COUNT(*) as total, SUM(completed) as completed FROM tasks WHERE user_id = ? AND category = 'personal'";
$stmt = $conn->prepare($personalQuery);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$personalResult = $stmt->get_result()->fetch_assoc();
$progress['personal']['total'] = (int)$personalResult['total'];
$progress['personal']['completed'] = (int)$personalResult['completed'];

// Get total tasks
$totalQuery = "SELECT COUNT(*) as total, SUM(completed) as completed FROM tasks WHERE user_id = ?";
$stmt = $conn->prepare($totalQuery);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$totalResult = $stmt->get_result()->fetch_assoc();
$progress['total']['total'] = (int)$totalResult['total'];
$progress['total']['completed'] = (int)$totalResult['completed'];

// Return progress data
echo json_encode(['success' => true, 'progress' => $progress]);

$stmt->close();
$conn->close();
?>