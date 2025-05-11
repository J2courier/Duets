<?php
// Include required files
require_once '../../authentication/DatabaseManager.php';
require_once '../../authentication/SessionManager.php';

// Start session
SessionManager::startSession();

// Check if user is already logged in
if (SessionManager::isLoggedIn()) {
    header("Location: ../home.php");
    exit();
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    
    // Basic validation
    $errors = [];
    
    if (empty($email)) {
        $errors[] = "Email is required";
    }
    
    if (empty($password)) {
        $errors[] = "Password is required";
    }
    
    // If there are validation errors, redirect back with error message
    if (!empty($errors)) {
        $error_string = implode(", ", $errors);
        header("Location: ../login.php?error=" . urlencode($error_string));
        exit();
    }
    
    try {
        // Create database connection
        $db = new DatabaseManager();
        
        // Check if user exists
        $sql = "SELECT id, name, email, password FROM users WHERE email = ?";
        $stmt = $db->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            
            // Verify password
            if (password_verify($password, $user['password'])) {
                // Password is correct, create user session
                SessionManager::createUserSession($user['id'], $user['name'], $user['email']);
                
                // Redirect to home page
                header("Location: ../home.php");
                exit();
            } else {
                // Password is incorrect
                header("Location: ../login.php?error=Invalid email or password");
                exit();
            }
        } else {
            // User not found
            header("Location: ../login.php?error=Invalid email or password");
            exit();
        }
    } catch (Exception $e) {
        header("Location: ../login.php?error=" . urlencode($e->getMessage()));
        exit();
    } finally {
        // Close database connection if it exists
        if (isset($db)) {
            $db->close();
        }
    }
} else {
    // If not a POST request, redirect to login page
    header("Location: ../login.php");
    exit();
}
?>