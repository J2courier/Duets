<?php
    require_once '../authentication/SessionManager.php';
    require_once '../authentication/DatabaseManager.php'; // Changed from Database.php
    SessionManager::startSession();
    // Clear PHP's file status cache to ensure fresh CSS loading
    clearstatcache();

    // Redirect if not logged in
    if (!SessionManager::isLoggedIn()) {
        header("Location: login.php");
        exit();
    }

    // Get user information
    $user_name = $_SESSION['user_name'];
    $user_id = $_SESSION['user_id'];

    // Get task counts
    function getTaskCounts($user_id) {
        $db = new DatabaseManager(); // Changed from Database
        $conn = $db->getConnection();
        
        // Total tasks
        $totalQuery = "SELECT COUNT(*) as total FROM tasks WHERE user_id = ?";
        $stmt = $conn->prepare($totalQuery);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $totalResult = $stmt->get_result()->fetch_assoc();
        $total = $totalResult['total'];
        
        // Work tasks
        $workQuery = "SELECT COUNT(*) as work FROM tasks WHERE user_id = ? AND category = 'work'";
        $stmt = $conn->prepare($workQuery);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $workResult = $stmt->get_result()->fetch_assoc();
        $work = $workResult['work'];
        
        // School tasks
        $schoolQuery = "SELECT COUNT(*) as school FROM tasks WHERE user_id = ? AND category = 'school'";
        $stmt = $conn->prepare($schoolQuery);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $schoolResult = $stmt->get_result()->fetch_assoc();
        $school = $schoolResult['school'];
        
        // Personal tasks
        $personalQuery = "SELECT COUNT(*) as personal FROM tasks WHERE user_id = ? AND category = 'personal'";
        $stmt = $conn->prepare($personalQuery);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $personalResult = $stmt->get_result()->fetch_assoc();
        $personal = $personalResult['personal'];
        
        return [
            'total' => $total,
            'work' => $work,
            'school' => $school,
            'personal' => $personal
        ];
    }

    $taskCounts = getTaskCounts($user_id);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/home.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="assets/css/styles.css?v=<?php echo time(); ?>">
    <title>Duets - Dashboard</title>
</head>
<body>
    <main>
        <section class="body-section">
            <nav class="horizontal-nav">
                <ul>
                    <li><h1><?php echo htmlspecialchars($user_name); ?></h1></li>
                    <li><a href="auth/logout.php"><button>Logout</button></a></li>
                </ul>
            </nav>

            <div class="dashboard">
                <div class="counter-card-1">
                    <h3>Total Tasks</h3>
                    <p class="counter"><?php echo $taskCounts['total']; ?></p>
                </div>
                <div class="counter-card-2">
                    <h3>Work Tasks</h3>
                    <p class="counter"><?php echo $taskCounts['work']; ?></p>
                </div>
                <div class="counter-card-3">
                    <h3>School Tasks</h3>
                    <p class="counter"><?php echo $taskCounts['school']; ?></p>
                </div>
                <div class="counter-card-4">
                    <h3>Personal Tasks</h3>
                    <p class="counter"><?php echo $taskCounts['personal']; ?></p>
                </div>
                <div class="task-container">
                    <div class="task-container-head">
                        <div class="head-north">
                            <h1>Daily Task</h1>
                            <div>
                                <button id="addTaskBtn">Add Task</button>
                                <button id="addLessonBtn">Add Lesson</button>
                            </div>
                        </div>
                        <div class="categories">
                            <!-- Category filter buttons will be added here by JavaScript -->
                        </div>
                    </div>
                    <div class="task-container-body">
                        <!-- Task items will be added here -->
                    </div>
                </div>
                <div class="progress-container">
                    <h1>Progress Container</h1>
                    <div class="progress-container-body">
                        
                    </div>
                </div>
            </div>
        </section>
    </main>
    <script src="assets/js/progress-tracker.js?v=<?php echo time(); ?>"></script>
    <script src="assets/js/task-description.js?v=<?php echo time(); ?>"></script>
    <script src="assets/js/task-manager.js?v=<?php echo time(); ?>"></script>

</body>
</html>

