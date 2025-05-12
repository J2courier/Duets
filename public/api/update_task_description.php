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
if (!isset($data['task_id']) || !isset($data['description'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Sanitize inputs
$task_id = filter_var($data['task_id'], FILTER_SANITIZE_NUMBER_INT);
$description = filter_var($data['description'], FILTER_SANITIZE_STRING);

try {
    // Connect to database
    $db = new DatabaseManager();
    $conn = $db->getConnection();
    
    // Prepare SQL statement
    $query = "UPDATE tasks SET description = ?, updated_at = NOW() WHERE id = ? AND user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sii", $description, $task_id, $user_id);
    
    // Execute statement
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Description updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'No changes made or task not found']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update description']);
    }
    
    // Close statement and connection
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>