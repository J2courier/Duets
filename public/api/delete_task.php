<?php
require_once '../../authentication/SessionManager.php';
require_once '../../authentication/DatabaseManager.php';

SessionManager::startSession();

if (!SessionManager::isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$task_id = $data['task_id'];
$user_id = $_SESSION['user_id'];

// Validate data
if (empty($task_id)) {
    echo json_encode(['success' => false, 'message' => 'Missing task ID']);
    exit();
}

// Delete from database
$db = new DatabaseManager();
$conn = $db->getConnection();

// Make sure the task belongs to the current user (security check)
$query = "DELETE FROM tasks WHERE id = ? AND user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ii", $task_id, $user_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Task deleted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error deleting task: ' . $conn->error]);
}
?>