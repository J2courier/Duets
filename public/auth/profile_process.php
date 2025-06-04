
<?php
// Include required files
require_once '../../authentication/DatabaseManager.php';
require_once '../../authentication/SessionManager.php';

// Start session
SessionManager::startSession();

// Check if user is logged in
if (!SessionManager::isLoggedIn()) {
    header("Location: ../login.php");
    exit();
}

// Get user ID from session
$user_id = $_SESSION['user_id'];

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and sanitize inputs
    $first_name = trim($_POST['first_name']);
    $middle_name = trim($_POST['middle_name'] ?? '');
    $last_name = trim($_POST['last_name']);
    $age = (int)$_POST['age'];
    $birthday = $_POST['birthday'];
    $sex = $_POST['sex'];
    $civil_status = $_POST['civil_status'];
    $parents_guardian_name = trim($_POST['parents_guardians']);
    $barangay = trim($_POST['barangay']);
    $sitio = trim($_POST['sitio'] ?? '');
    $city = trim($_POST['city']);
    $province = trim($_POST['province']);
    $mobile_number = trim($_POST['mobile_number']);
    $email_address = trim($_POST['email_address']);
    
    // Basic validation
    $errors = [];
    
    // Validate required fields
    if (empty($first_name)) $errors[] = "First name is required";
    if (empty($last_name)) $errors[] = "Last name is required";
    if (empty($age) || $age < 0) $errors[] = "Valid age is required";
    if (empty($birthday)) $errors[] = "Birthday is required";
    if (empty($sex)) $errors[] = "Sex is required";
    if (empty($civil_status)) $errors[] = "Civil status is required";
    if (empty($parents_guardian_name)) $errors[] = "Parents/Guardians name is required";
    if (empty($barangay)) $errors[] = "Barangay is required";
    if (empty($city)) $errors[] = "City is required";
    if (empty($province)) $errors[] = "Province is required";
    if (empty($mobile_number)) $errors[] = "Mobile number is required";
    if (empty($email_address)) $errors[] = "Email address is required";
    
    // If there are validation errors, redirect back with error message
    if (!empty($errors)) {
        $error_string = implode(", ", $errors);
        header("Location: ../demographic_profile.php?error=" . urlencode($error_string));
        exit();
    }
    
    // If validation passes, proceed with saving the profile
    try {
        // Create database connection
        $db = new DatabaseManager();
        $conn = $db->getConnection();
        
        // Enable error reporting
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        
        // Check if profile already exists for this user
        $checkSql = "SELECT id FROM demographic WHERE email_address = ?";
        $stmt = $conn->prepare($checkSql);
        if ($stmt === false) {
            throw new Exception("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param("s", $email_address);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            // Update existing profile
            $updateSql = "UPDATE demographic SET 
                first_name = ?, 
                middle_name = ?, 
                last_name = ?, 
                age = ?, 
                birthday = ?, 
                sex = ?, 
                civil_status = ?, 
                parents_guardian_name = ?, 
                barangay = ?, 
                sitio = ?, 
                city = ?, 
                province = ?, 
                mobile_number = ? 
                WHERE email_address = ?";
                
            $stmt = $conn->prepare($updateSql);
            if ($stmt === false) {
                throw new Exception("Prepare failed for update: " . $conn->error);
            }
            
            $stmt->bind_param(
                "sssississsssss", 
                $first_name, 
                $middle_name, 
                $last_name, 
                $age, 
                $birthday, 
                $sex, 
                $civil_status, 
                $parents_guardian_name, 
                $barangay, 
                $sitio, 
                $city, 
                $province, 
                $mobile_number, 
                $email_address
            );
            
            if ($stmt->execute()) {
                header("Location: ../home.php?success=Profile updated successfully!");
                exit();
            } else {
                throw new Exception("Execute failed for update: " . $stmt->error);
            }
        } else {
            // Insert new profile
            $insertSql = "INSERT INTO demographic (
                first_name, 
                middle_name, 
                last_name, 
                age, 
                birthday, 
                sex, 
                civil_status, 
                parents_guardian_name, 
                barangay, 
                sitio, 
                city, 
                province, 
                mobile_number, 
                email_address
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $conn->prepare($insertSql);
            if ($stmt === false) {
                throw new Exception("Prepare failed for insert: " . $conn->error);
            }
            
            $stmt->bind_param(
                "sssississsssss", 
                $first_name, 
                $middle_name, 
                $last_name, 
                $age, 
                $birthday, 
                $sex, 
                $civil_status, 
                $parents_guardian_name, 
                $barangay, 
                $sitio, 
                $city, 
                $province, 
                $mobile_number, 
                $email_address
            );
            
            if ($stmt->execute()) {
                header("Location: ../home.php?success=Profile submitted successfully!");
                exit();
            } else {
                throw new Exception("Execute failed for insert: " . $stmt->error);
            }
        }
    } catch (Exception $e) {
        // Display detailed error for debugging
        echo "Error: " . $e->getMessage();
        // Uncomment the line below when going to production
        // header("Location: ../demographic_profile.php?error=" . urlencode($e->getMessage()));
        exit();
    } finally {
        // Close database connection if it exists
        if (isset($db)) {
            $db->close();
        }
    }
} else {
    // If not a POST request, redirect to profile page
    header("Location: ../demographic_profile.php");
    exit();
}
?>

