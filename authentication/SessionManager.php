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
        session_regenerate_id(true);
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_name'] = $name;
        $_SESSION['user_email'] = $email;
        $_SESSION['logged_in'] = true;
        $_SESSION['last_activity'] = time();
        $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT']; 
    }
    
    // Add session timeout check
    public static function checkSessionTimeout($maxLifetime = 1800) { 
        if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $maxLifetime)) {
            self::destroySession();
            return false;
        }
        $_SESSION['last_activity'] = time(); 
        return true;
    }

    // Validate session integrity
    public static function validateSession() {

        if (isset($_SESSION['user_agent']) && $_SESSION['user_agent'] !== $_SERVER['HTTP_USER_AGENT']) {
            self::destroySession();
            return false;
        }
        return true;
    }

    // Check if user is logged in with additional validations
    public static function isLoggedIn() {
        if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
            return false;
        }
        
        // Perform additional validations
        if (!self::validateSession() || !self::checkSessionTimeout()) {
            return false;
        }
        
        return true;
    }
    

    public static function destroySession() {
        $_SESSION = array();
        
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        
        session_destroy();
    }
    
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

    public static function initSession($options = []) {
        $default_options = [
            'lifetime' => 86400, 
            'path' => '/',
            'domain' => '',
            'secure' => true,
            'httponly' => true,
            'samesite' => 'Lax'
        ];
        
        $session_options = array_merge($default_options, $options);
        
        session_set_cookie_params(
            $session_options['lifetime'],
            $session_options['path'],
            $session_options['domain'],
            $session_options['secure'],
            $session_options['httponly']
        );
        
        // Start session
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Run garbage collection with 1% chance
        if (mt_rand(1, 100) === 1) {
            self::runGarbageCollection();
        }
    }

    // Run garbage collection manually
    public static function runGarbageCollection() {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return session_gc();
        }
        return false;
    }

    // Generate CSRF token
    public static function generateCsrfToken() {
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    // Validate CSRF token
    public static function validateCsrfToken($token) {
        if (!isset($_SESSION['csrf_token']) || $token !== $_SESSION['csrf_token']) {
            return false;
        }
        return true;
    }
}
?>


