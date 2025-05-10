<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/index.css">
    <link rel="stylesheet" href="assets/css/auth.css">
    <title>Sign Up - Duets</title>
</head>
<body>
    <main>
        <div class="auth-container">
            <div class="auth-form-container">
                <h2>Create an Account</h2>
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
                        <input type="password" id="password" name="password" required>
                    </div>
                    <div class="form-group">
                        <label for="confirm_password">Confirm Password</label>
                        <input type="password" id="confirm_password" name="confirm_password" required>
                    </div>
                    <button type="submit" class="auth-button">Sign Up</button>
                </form>
                <p class="auth-switch">Already have an account? <a href="login.php">Login</a></p>
            </div>
        </div>
    </main>
</body>
</html>