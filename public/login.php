<?php
require_once '../authentication/SessionManager.php';
SessionManager::startSession();
// Clear PHP's file status cache to ensure fresh CSS loading
clearstatcache();

// Redirect if already logged in
if (SessionManager::isLoggedIn()) {
    header("Location: home.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="assets/css/auth.css?v=<?php echo time(); ?>">
    <title>Login - Duets</title>
</head>
<body>
    <main>
        <div class="auth-container">
            <div class="auth-form-container">
                <h2>Login to Duets</h2>
                
                <?php if (isset($_GET['error'])): ?>
                <div class="error-message" style="color: red; margin-bottom: 15px; text-align: center;">
                    <?php echo htmlspecialchars($_GET['error']); ?>
                </div>
                <?php endif; ?>
                
                <?php if (isset($_GET['success'])): ?>
                <div class="success-message" style="color: green; margin-bottom: 15px; text-align: center;">
                    <?php echo htmlspecialchars($_GET['success']); ?>
                </div>
                <?php endif; ?>
                
                <form action="auth/login_process.php" method="POST">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="password-container">
                            <input type="password" id="password" name="password" required>
                            <div class="show-password">                               
                                <!-- <label for="showPassword">Show</label> -->
                                <input type="checkbox" id="showPassword">
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="auth-button">Login</button>
                </form>
                <p class="auth-switch">Don't have an account? <a href="signup.php">Sign up</a></p>
            </div>
        </div>
    </main>

    <script>
        // Show/hide password functionality
        document.getElementById('showPassword').addEventListener('change', function() {
            const passwordField = document.getElementById('password');
            passwordField.type = this.checked ? 'text' : 'password';
        });
    </script>
</body>
</html>





