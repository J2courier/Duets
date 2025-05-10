<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/home.css">
    <title>Duets - Dashboard</title>
</head>
<body>
    <main>
        <nav class="vertical-nav">
            <ul>
                <li><button><img src="assets/images/home.png" alt="img"></button></li>
                <li><button><img src="assets/images/task.png" alt="img"></button></li>
                <li><button><img src="assets/images/FlashcardIcon.png" alt="img"></button></li>
                <li><button><img src="assets/images/settings.png" alt="img"></button></li>
            </ul>
        </nav>
        <section class="body-section">
            <nav class="horizontal-nav">
                <ul>
                    <li>Welcome, User!</li>
                </ul>
            </nav>

            <div class="dashboard">
                <div class="counter-card-1">Counter Card 1</div>
                <div class="counter-card-2">Counter Card 2</div>
                <div class="counter-card-3">Counter Card 3</div>
                <div class="counter-card-4">Counter Card 4</div>
                <div class="task-container">
                    <div class="task-container-head">
                        <div class="head-north">
                            <h1>Daily Task</h1>
                            <button id="addTaskBtn">Add Task</button>
                            <button id="addLessonBtn">Add Lesson</button>
                        </div>
                        <div class="head-south">
                            <button class="school">School</button>
                            <button class="work">Work</button>
                            <button class="personal">Personal</button>
                        </div>
                    </div>
                    <div class="task-container-body">
                        
                    </div>
                </div>
                <div class="progress-container">Progress Container</div>
            </div>
        </section>
    </main>

    <!-- Include the external JavaScript file -->
    <script src="assets/js/task-manager.js"></script>
</body>
</html>
