<?php
    require_once '../../authentication/SessionManager.php';
    SessionManager::startSession();
    SessionManager::destroySession();
    header("Location: ../index.php");
    exit();
?>
