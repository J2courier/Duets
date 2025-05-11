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
    // Get form data and sanitize inputs
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    
    // Basic validation
    $errors = [];
    
    // Validate name
    if (empty($name)) {
        $errors[] = "Name is required";
    }
    
    // Validate email
    if (empty($email)) {
        $errors[] = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    // Validate password
    if (empty($password)) {
        $errors[] = "Password is required";
    } elseif (strlen($password) < 6) {
        $errors[] = "Password must be at least 6 characters";
    }
    
    // Check if passwords match
    if ($password !== $confirm_password) {
        $errors[] = "Passwords do not match";
    }
    
    // If there are validation errors, redirect back with error message
    if (!empty($errors)) {
        $error_string = implode(", ", $errors);
        header("Location: ../signup.php?error=" . urlencode($error_string));
        exit();
    }
    
    // If validation passes, proceed with registration
    try {
        // Create database connection
        $db = new DatabaseManager();
        
        // Check if email already exists
        $checkEmailSql = "SELECT email FROM users WHERE email = ?";
        $stmt = $db->prepare($checkEmailSql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            header("Location: ../signup.php?error=Email already exists");
            exit();
        }
        
        // Hash the password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $insertSql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        $stmt = $db->prepare($insertSql);
        $stmt->bind_param("sss", $name, $email, $hashed_password);
        
        if ($stmt->execute()) {
            // Registration successful
            header("Location: ../login.php?success=Account created successfully! Please login.");
            exit();
        } else {
            // Registration failed
            header("Location: ../signup.php?error=Registration failed. Please try again.");
            exit();
        }
        
    } catch (Exception $e) {
        header("Location: ../signup.php?error=" . urlencode($e->getMessage()));
        exit();
    } finally {
        // Close database connection if it exists
        if (isset($db)) {
            $db->close();
        }
    }
} else {
    // If not a POST request, redirect to signup page
    header("Location: ../signup.php");
    exit();
}
?>
