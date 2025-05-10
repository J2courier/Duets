<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/index.css">
    <link rel="stylesheet" href="assets/css/auth.css">
    <title>Login - Duets</title>
</head>
<body>
    <main>
        <div class="auth-container">
            <div class="auth-form-container">
                <h2>Login to Duets</h2>
                <form action="auth/login_process.php" method="POST">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="auth-button">Login</button>
                </form>
                <p class="auth-switch">Don't have an account? <a href="signup.php">Sign up</a></p>
            </div>
        </div>
    </main>
</body>
</html>