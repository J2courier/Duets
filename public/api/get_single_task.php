<?php
require_once '../../authentication/SessionManager.php';
require_once '../../authentication/DatabaseManager.php';

SessionManager::startSession();

if (!SessionManager::isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

$user_id = $_SESSION['user_id'];

// Check if task_id is provided
if (isset($_GET['task_id'])) {
    $task_id = $_GET['task_id'];
    
    // Create database connection
    $db = new DatabaseManager();
    $conn = $db->getConnection();
    
    // Prepare query to get task (ensuring it belongs to the current user)
    $query = "SELECT * FROM tasks WHERE id = ? AND user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $task_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $task = $result->fetch_assoc();
        echo json_encode(['success' => true, 'task' => $task]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Task not found or access denied']);
    }
    
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Task ID not provided']);
}
?>
