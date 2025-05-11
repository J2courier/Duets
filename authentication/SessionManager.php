<?php
class SessionManager {
    // Start or resume a session
    public static function startSession() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
    
    // Set user session after successful login
    public static function createUserSession($userId, $name, $email) {
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_name'] = $name;
        $_SESSION['user_email'] = $email;
        $_SESSION['logged_in'] = true;
        $_SESSION['last_activity'] = time();
    }
    
    // Check if user is logged in
    public static function isLoggedIn() {
        return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
    }
    
    // Destroy session on logout
    public static function destroySession() {
        // Unset all session variables
        $_SESSION = array();
        
        // If it's desired to kill the session, also delete the session cookie
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        
        // Finally, destroy the session
        session_destroy();
    }
    
    // Redirect if not logged in
    public static function requireLogin() {
        self::startSession();
        if (!self::isLoggedIn()) {
            header("Location: login.php");
            exit();
        }
    }
    
    // Redirect if already logged in
    public static function redirectIfLoggedIn() {
        self::startSession();
        if (self::isLoggedIn()) {
            header("Location: home.php");
            exit();
        }
    }
}
?>