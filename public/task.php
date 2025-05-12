<?php
    require_once '../authentication/SessionManager.php';
    require_once '../authentication/DatabaseManager.php';
    
    SessionManager::startSession();
    
    // Redirect if not logged in
    if (!SessionManager::isLoggedIn()) {
        header("Location: login.php");
        exit();
    }
    
    $user_id = $_SESSION['user_id'];
    clearstatcache();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Include the main CSS for layout structure -->
    <link rel="stylesheet" href="assets/css/home.css?v=<?php echo time(); ?>">
    <!-- Include the task page specific CSS -->
    <link rel="stylesheet" href="assets/css/task-page.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="assets/css/styles.css?v=<?php echo time(); ?>">
    <title>Tasks</title>
</head>
<body>
    <main>
        <nav class="vertical-nav">
            <ul>
                <li><a href="home.php"><button><img src="assets/images/home.png" alt="Home"></button></a></li>
                <li><a href="task.php"><button><img src="assets/images/task.png" alt="Tasks"></button></a></li>
                <li><button><img src="assets/images/FlashcardIcon.png" alt="Flashcards"></button></li>
                <li><button><img src="assets/images/settings.png" alt="Settings"></button></a></li>
            </ul>
        </nav>
        <section class="body-section">
            <div class="task-page-container">
                <div class="task-header">
                    <h1>My Tasks</h1>
                </div>
                
                <div class="task-filters">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <button class="filter-btn" data-filter="school">School</button>
                    <button class="filter-btn" data-filter="work">Work</button>
                    <button class="filter-btn" data-filter="personal">Personal</button>
                </div>
                
                <div class="task-container-body">
                    <!-- Tasks will be loaded here -->
                </div>
            </div>
        </section>
    </main>
    
    <!-- Use the dedicated task page JavaScript file -->
    <script src="assets/js/task-page.js?v=<?php echo time(); ?>"></script>
    <script src="assets/js/task-description.js"></script>
</body>
</html>
