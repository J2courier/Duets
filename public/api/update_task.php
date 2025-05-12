<?php
// Include database connection
require_once '../../config/database.php';

// Set content type to JSON
header('Content-Type: application/json');

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get JSON data from request body
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Check if required fields are present
if (!isset($data['task_id']) || !isset($data['title']) || !isset($data['type']) || !isset($data['category'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Sanitize inputs
$task_id = filter_var($data['task_id'], FILTER_SANITIZE_NUMBER_INT);
$title = filter_var($data['title'], FILTER_SANITIZE_STRING);
$type = filter_var($data['type'], FILTER_SANITIZE_STRING);
$category = filter_var($data['category'], FILTER_SANITIZE_STRING);

// Validate inputs
if (empty($title) || empty($type) || empty($category)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Validate category
$valid_categories = ['work', 'school', 'personal'];
if (!in_array($category, $valid_categories)) {
    echo json_encode(['success' => false, 'message' => 'Invalid category']);
    exit;
}

// Validate type
$valid_types = ['Task', 'Lesson'];
if (!in_array($type, $valid_types)) {
    echo json_encode(['success' => false, 'message' => 'Invalid type']);
    exit;
}

try {
    // Prepare SQL statement
    $stmt = $pdo->prepare("UPDATE tasks SET title = :title, type = :type, category = :category, updated_at = NOW() WHERE id = :task_id");
    
    // Bind parameters
    $stmt->bindParam(':task_id', $task_id, PDO::PARAM_INT);
    $stmt->bindParam(':title', $title, PDO::PARAM_STR);
    $stmt->bindParam(':type', $type, PDO::PARAM_STR);
    $stmt->bindParam(':category', $category, PDO::PARAM_STR);
    
    // Execute statement
    $stmt->execute();
    
    // Check if task was updated
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Task updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Task not found or no changes made']);
    }
} catch (PDOException $e) {
    // Log error and return error message
    error_log('Database error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error occurred']);
}
?>

