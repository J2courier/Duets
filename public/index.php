<?php
// Clear PHP's file status cache to ensure fresh CSS loading
clearstatcache();
?>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="assets/images/sk_img.jpg" type="image/png">
    <link rel="stylesheet" href="assets/css/index.css?v=<?php echo time(); ?>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    <title>Welcome to Sangguiniang Kabataan of Brgy Sibaguan Roxas City Website</title>
</head>
<body>
    <main>
        <nav>
            <ul>
                <li>
                    <div class="nav-name-logo">
                        <img src="assets/images/Seal_of_Capiz.png" alt="logo">    
                        <h3>Sk Sibaguan Database</h3>
                    </div>
                </li>
                <li>
                    <div class="nav-double-btn">
                        <a href="login.php"><button>Login</button></a>
                    </div>
                </li>
            </ul>
        </nav>
        <section class="img-section">
            <div class="hero">

                <div class="welcome-img">
                    <div class="img-container1">
                        <img src="assets/images/sk_img.jpg" alt="image">    
                    </div>
                </div>

                <div class="welcome-txt">
                    <h1> <strong class="gradient-text"> SANGGUNIANG KABATAAN</strong> </h1>
                    <h3 class="text-secondary">Barangay Sibaguan, Roxas City</h3>
                    <a href="signup.php"><button>Get Started</button></a>    
                </div>
            </div>

            <div class="spacer-img">    
                <img src="assets/images/spacer-img.png" alt="spacer-image">
            </div>            

        </section>
        <section class="credit-section">'
            <img src="assets/images/sk_img.jpg" alt="img" class="sk-img">
            <div class="creators">
                <h1>ACKNOWLEDGEMENT</h1>
            </div>
            <div class="acknowledgement-txt">
                
                 <p>
                    This project was made possible through the initiative of 
                    <strong>HON. JAYV B. ASTORIAS, RCrim SK Chairman of Brgy. Sibaguan</strong>, 
                    whose dedication and passion laid the foundation for its creation and development,
                    together with <strong><a href="https://www.facebook.com/johnmark.anoche">Mrs. John Mark Basa Anoche</a> and Jherson Bartolay</strong>.
                    Their commitment to innovation and excellence continues to inspire the team and 
                    drive the project forward. We extend our deepest gratitude for their leadership 
                    and the opportunity to bring this idea to life.
                </p>
            </div>
                <div class="developers-list">
                    <ul>
                        <li class="developer-card">
                            <div class="dev-list-container">
                                <img src="assets/images/j1.jpg" alt="Jherson Bartolay">
                            </div>
                            <p><strong class="text-primary">Jherson Bartolay</strong><br><span class="text-muted">Co-developer</span></p>
                        </li>
                        <li class="developer-card">
                            <div class="dev-list-container">
                                <img src="assets/images/teacher.jpg" alt="John Mark Basa Anoche">
                            </div>
                            <p><strong class="text-primary">John Mark Basa Anoche</strong><br><span class="text-muted">Co-developer</span></p>
                        </li>
                        <li class="developer-card">
                            <div class="dev-list-container">
                                <img src="assets/images/Sir_Javy.jpg" alt="HON. JAYV B. ASTORIAS">
                            </div>
                            <p><strong class="text-primary">HON. JAYV B. ASTORIAS</strong><br><span class="text-muted">SK Chairman of Brgy. Sibaguan</span></p>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    <footer>
        <div class="footer-content">
            <div class="footer-about">
                <h3>About Duets</h3>
                <p>
                    Duets is a productivity and data collection platform design for Sangguniang Kabataan of Barangay Sibaguan, Roxas City.
                </p>
            </div>
            <div class="footer-contact">
                <h3>Contact Us</h3>
                <p>Email: bartolayjherson@gmail.com</p>
                <!-- <p>Phone: </p> -->
            </div>
            <div class="footer-links">
                <h3>Developers</h3>
                <ul>
                    <li>Jherson Bartolay</li>
                    <li>John Mark Anoche</li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; <span id="year"></span> SK. All rights reserved.</p>
        </div>
    </footer>
    </main>
    <script>
        document.getElementById("year").textContent = new Date().getFullYear();
    </script>
</body>
</html>
