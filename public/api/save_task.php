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
    $user_id = $_SESSION['user_id'];
    $title = $data['title'];
    $category = $data['category'];
    $type = $data['type'];

    // Validate data
    if (empty($title) || empty($category) || empty($type)) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit();
    }

    $db = new DatabaseManager();
    $conn = $db->getConnection();

    $query = "INSERT INTO tasks (user_id, title, category, type) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("isss", $user_id, $title, $category, $type);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Task saved successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error saving task: ' . $conn->error]);
    }
?>