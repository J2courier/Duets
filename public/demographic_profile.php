<?php
require_once '../authentication/SessionManager.php';
require_once '../authentication/DatabaseManager.php';
SessionManager::startSession();
// Clear PHP's file status cache to ensure fresh CSS loading
clearstatcache();

// Redirect if not logged in
if (!SessionManager::isLoggedIn()) {
    header("Location: login.php");
    exit();
}

// Get user information
$user_id = $_SESSION['user_id'];
$user_email = $_SESSION['user_email'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="assets/images/sk_img.jpg" type="image/png">
    <link rel="stylesheet" href="assets/css/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="assets/css/auth.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="assets/css/demographic.css?v=<?php echo time(); ?>">
    <title>Demographic Profile - Duets</title>
</head>
<body>
    <img src="assets/images/sk_img.jpg" alt="img" class="sk-img">
    <main class="demographic-main">
        <div class="demographic-container">
            <div class="header-txt-logo">
                <img src="assets/images/sk_img.jpg" alt="img">
                <h1>Demographic Profile</h1>

            </div>
            <p class="subtitle">Please provide your personal information</p>
            
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
            
            <form action="auth/profile_process.php" method="POST">
                <!-- Personal Information Section -->
                <div class="form-section blue-section">
                    <div class="section-header">
                        <i class="icon">👤</i>
                        <div>
                            <h2>Personal Information</h2>
                            <p>Basic personal details</p>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="first_name">First Name <span class="required">*</span></label>
                                <input type="text" id="first_name" name="first_name" placeholder="Enter first name" required>
                            </div>
                            <div class="form-group">
                                <label for="middle_name">Middle Name</label>
                                <input type="text" id="middle_name" name="middle_name" placeholder="Enter middle name">
                            </div>
                            <div class="form-group">
                                <label for="last_name">Last Name <span class="required">*</span></label>
                                <input type="text" id="last_name" name="last_name" placeholder="Enter last name" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="age">Age <span class="required">*</span></label>
                                <input type="number" id="age" name="age" placeholder="Enter age" min="0" required>
                            </div>
                            <div class="form-group">
                                <label for="birthday">Birthday <span class="required">*</span></label>
                                <input type="date" id="birthday" name="birthday" required>
                            </div>
                            <div class="form-group">
                                <label for="sex">Sex <span class="required">*</span></label>
                                <select id="sex" name="sex" required>
                                    <option value="" disabled selected>Select sex</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Family Information Section -->
                <div class="form-section green-section">
                    <div class="section-header">
                        <i class="icon">👪</i>
                        <div>
                            <h2>Family Information</h2>
                            <p>Civil status and family details</p>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="civil_status">Civil Status <span class="required">*</span></label>
                                <select id="civil_status" name="civil_status" required>
                                    <option value="" disabled selected>Select civil status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Widowed">Widowed</option>
                                    <option value="Separated">Separated</option>
                                    <option value="Divorced">Divorced</option>
                                </select>
                            </div>
                            <div class="form-group wide">
                                <label for="parents_guardians">Parents/Guardians Name <span class="required">*</span></label>
                                <input type="text" id="parents_guardians" name="parents_guardians" placeholder="Enter parents/guardians name" required>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Address Information Section -->
                <div class="form-section purple-section">
                    <div class="section-header">
                        <i class="icon">📍</i>
                        <div>
                            <h2>Address Information</h2>
                            <p>Current residential address</p>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="barangay">Barangay <span class="required">*</span></label>
                                <input type="text" id="barangay" name="barangay" placeholder="Enter barangay" required>
                            </div>
                            <div class="form-group">
                                <label for="sitio">Sitio</label>
                                <input type="text" id="sitio" name="sitio" placeholder="Enter sitio">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="city">City <span class="required">*</span></label>
                                <input type="text" id="city" name="city" placeholder="Enter city" required>
                            </div>
                            <div class="form-group">
                                <label for="province">Province <span class="required">*</span></label>
                                <input type="text" id="province" name="province" placeholder="Enter province" required>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Contact Information Section -->
                <div class="form-section red-section">
                    <div class="section-header">
                        <i class="icon">📞</i>
                        <div>
                            <h2>Contact Information</h2>
                            <p>How we can reach you</p>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="mobile_number">Mobile Number <span class="required">*</span></label>
                                <input type="text" id="mobile_number" name="mobile_number" placeholder="+63 XXX XXX XXXX" required>
                            </div>
                            <div class="form-group">
                                <label for="email_address">Email Address <span class="required">*</span></label>
                                <input type="email" id="email_address" name="email_address" value="<?php echo htmlspecialchars($user_email); ?>" readonly>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="submit-btn">Submit Profile</button>
                </div>
                
                <p class="required-note">Fields marked with <span class="required">*</span> are required</p>
            </form>
        </div>
    </main>
</body>
</html>