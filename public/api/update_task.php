<?php
require_once '../../authentication/SessionManager.php';
require_once '../../authentication/DatabaseManager.php';

SessionManager::startSession();

if (!SessionManager::isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

// Get the JSON data from the request
$data = json_decode(file_get_contents('php://input'), true);
$user_id = $_SESSION['user_id'];

// Check if required data is present
if (isset($data['task_id']) && isset($data['title']) && isset($data['type']) && isset($data['category'])) {
    $task_id = $data['task_id'];
    $title = $data['title'];
    $type = $data['type'];
    $category = $data['category'];
    
    // Validate data
    if (empty($title) || empty($category) || empty($type)) {
        echo json_encode(['success' => false, 'message' => 'Empty fields are not allowed']);
        exit();
    }
    
    // Create database connection using DatabaseManager
    $db = new DatabaseManager();
    $conn = $db->getConnection();
    
    // Make sure the task belongs to the current user (security check)
    $query = "UPDATE tasks SET title = ?, type = ?, category = ? WHERE id = ? AND user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sssii", $title, $type, $category, $task_id, $user_id);
    
    if ($stmt->execute()) {
        // Success
        echo json_encode(['success' => true, 'message' => 'Task updated successfully']);
    } else {
        // Error
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    }
    
    $stmt->close();
    $conn->close();
} else {
    // Missing required data
    echo json_encode(['success' => false, 'message' => 'Missing required data']);
}
?>
