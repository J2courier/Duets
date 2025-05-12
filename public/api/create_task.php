<?php
require_once '../../authentication/SessionManager.php';
require_once '../../authentication/DatabaseManager.php';

// Start session and check if user is logged in
SessionManager::startSession();
if (!SessionManager::isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$user_id = $_SESSION['user_id'];

// Check if required fields are present
if (!isset($data['title']) || !isset($data['category']) || !isset($data['type'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Sanitize inputs
$title = filter_var($data['title'], FILTER_SANITIZE_STRING);
$category = filter_var($data['category'], FILTER_SANITIZE_STRING);
$type = filter_var($data['type'], FILTER_SANITIZE_STRING);
$description = isset($data['description']) ? filter_var($data['description'], FILTER_SANITIZE_STRING) : '';
$due_date = isset($data['due_date']) && !empty($data['due_date']) ? $data['due_date'] : null;
$repeat_type = isset($data['repeat_type']) ? filter_var($data['repeat_type'], FILTER_SANITIZE_STRING) : 'none';
$repeat_days = isset($data['repeat_days']) ? filter_var($data['repeat_days'], FILTER_SANITIZE_STRING) : '';

try {
    // Connect to database
    $db = new DatabaseManager();
    $conn = $db->getConnection();
    
    // Prepare SQL statement
    $query = "INSERT INTO tasks (user_id, title, category, type, description, due_date, repeat_type, repeat_days, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("isssssss", $user_id, $title, $category, $type, $description, $due_date, $repeat_type, $repeat_days);
    
    // Execute statement
    if ($stmt->execute()) {
        $task_id = $stmt->insert_id;
        echo json_encode(['success' => true, 'message' => 'Task created successfully', 'task_id' => $task_id]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create task']);
    }
    
    // Close statement and connection
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>