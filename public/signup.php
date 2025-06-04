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
    <link rel="icon" href="assets/images/sk_img.jpg" type="image/png">

    <link rel="stylesheet" href="assets/css/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="assets/css/auth.css?v=<?php echo time(); ?>">
    <title>Sign Up - Duets</title>
</head>
<body>
    <img src="assets/images/sk_img.jpg" alt="img" class="sk-img">
    <main>
        <div class="auth-container">
            <div class="auth-form-container">
                <h2>Create an Account</h2>
                
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
                
                <form action="auth/signup_process.php" method="POST">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="password-container">
                            <input type="password" id="password" name="password" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="confirm_password">Confirm Password</label>
                        <div class="password-container">
                            <input type="password" id="confirm_password" name="confirm_password" required>
                            <div class="show-password">
                                <input type="checkbox" id="showPassword">
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="auth-button">Sign Up</button>
                </form>
                <p class="auth-switch">Already have an account? <a href="login.php">Login</a></p>
            </div>
        </div>
    </main>

    <script>
        // Show/hide password functionality
        document.getElementById('showPassword').addEventListener('change', function() {
            const passwordField = document.getElementById('password');
            const confirmPasswordField = document.getElementById('confirm_password');
            
            passwordField.type = this.checked ? 'text' : 'password';
            confirmPasswordField.type = this.checked ? 'text' : 'password';
        });
    </script>
</body>
</html>








