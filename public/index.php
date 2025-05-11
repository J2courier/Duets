<?php
// Clear PHP's file status cache to ensure fresh CSS loading
clearstatcache();
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/index.css?v=<?php echo time(); ?>">
    <title>Welcome to Duets!</title>
</head>
<body>
    <main>
        <nav>
            <ul>
                <li>Duets</li>
                <li><a href="login.php"><button>Login</button></a></li>
            </ul>
        </nav>
        <section class="img-section">
            <div class="welcome-img">    
                <img src="assets/images/welcome-robot.png" alt="welcome-robot-image">
            </div>
            <div class="welcome-txt">
                <h1>WELCOME TO DUETS</h1>
                <p>Duets is a web project in PHP for doing homeworks, review, and studying lesson.<br>
                   We provide productivity tools to help you manage your time and stay organized. 
                </p>
                <a href="signup.php"><button>Get Started</button></a>    
            </div>
        </section>
        <section class="credit-section">
            <div class="creators">
                <h1>GROUP MEMBERS</h1>
            </div>
            <div class="member-list">
                <ul>
                    <li> 
                        <div class="Lords">
                            <img src="assets/images/lords.jpg" alt="img" class="lords-img">
                            <h3>Lordenel Arroyo</h3>
                        </div>
                    </li>
                    <li> 
                        <div class="Jherson">
                            <img src="assets/images/jherson.jpg" alt="img">
                            <h3>Jherson Bartolay</h3>
                        </div>
                    </li>
                    <li> 
                        <div class="Japheth">
                            <img src="" alt="">
                            <h3>Japheth Batan</h3>
                        </div>
                    </li>
                    <li> 
                        <div class="vince">
                            <img src="assets/images/vince.jpg" alt="">
                            <h3>Vince Gabriel Cartujano</h3>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="subject-teacher">
                <h1>SUBJECT TEACHER</h1>
                <div class="teacher">
                    <img src="assets/images/teacher.jpg" alt="img">
                    <h3>John Mark Basa Anoche</h3>
                </div>
            </div>
        </section>
    </main>
</body>
</html>
