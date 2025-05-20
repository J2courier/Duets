<?php
require_once '../../authentication/DatabaseManager.php';
require_once '../../authentication/SessionManager.php';


SessionManager::startSession();


if (SessionManager::isLoggedIn()) {
    header("Location: ../home.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    
    $errors = [];
    
    if (empty($email)) {
        $errors[] = "Email is required";
    }
    
    if (empty($password)) {
        $errors[] = "Password is required";
    }
    
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
          
            if (password_verify($password, $user['password'])) {
               
                SessionManager::createUserSession($user['id'], $user['name'], $user['email']);
                
                
                header("Location: ../home.php");
                exit();
            } else {
                
                header("Location: ../login.php?error=Invalid email or password");
                exit();
            }
        } else {
            
            header("Location: ../login.php?error=Invalid email or password");
            exit();
        }
    } catch (Exception $e) {
        header("Location: ../login.php?error=" . urlencode($e->getMessage()));
        exit();
    } finally {
        
        if (isset($db)) {
            $db->close();
        }
    }
} else {

    header("Location: ../login.php");
    exit();
}
?>