<?php
require_once '../../authentication/SessionManager.php';
require_once '../../authentication/DatabaseManager.php';

SessionManager::startSession();

if (!SessionManager::isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

// Check if request is POST and contains JSON
if ($_SERVER['REQUEST_METHOD'] === 'POST' && 
    isset($_SERVER['CONTENT_TYPE']) && 
    strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
    
    // Get JSON data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    // Validate data
    if (!isset($data['task_id']) || !isset($data['title']) || !isset($data['category'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit();
    }
    
    $task_id = $data['task_id'];
    $title = trim($data['title']);
    $category = $data['category'];
    $user_id = $_SESSION['user_id'];
    
    // Validate title
    if (empty($title)) {
        echo json_encode(['success' => false, 'message' => 'Title cannot be empty']);
        exit();
    }
    
    // Validate category
    $valid_categories = ['work', 'school', 'personal'];
    if (!in_array($category, $valid_categories)) {
        echo json_encode(['success' => false, 'message' => 'Invalid category']);
        exit();
    }
    
    // Update in database
    $db = new DatabaseManager();
    $conn = $db->getConnection();
    
    // Make sure the task belongs to the current user (security check)
    $query = "UPDATE tasks SET title = ?, category = ? WHERE id = ? AND user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssii", $title, $category, $task_id, $user_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Task updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating task: ' . $conn->error]);
    }
    
    $stmt->close();
    $conn->close();
}
?>


