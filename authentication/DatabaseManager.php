<?php
class DatabaseManager {
    private $host = "localhost";
    private $username = "JFCompany";
    private $password = "";
    private $database = "duetsdb";
    private $conn;

    // Constructor - establishes connection when object is created
    public function __construct() {
        $this->connect();
    }

    // Connect to the database
    private function connect() {
        try {
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->database);
            
            // Check connection
            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }
        } catch (Exception $e) {
            die("Database connection error: " . $e->getMessage());
        }
    }

    // Get the connection object
    public function getConnection() {
        return $this->conn;
    }

    // Execute a query
    public function query($sql) {
        return $this->conn->query($sql);
    }

    // Prepare a statement
    public function prepare($sql) {
        return $this->conn->prepare($sql);
    }

    // Close the connection
    public function close() {
        if ($this->conn) {
            $this->conn->close();
        }
    }

    // Escape string to prevent SQL injection
    public function escapeString($string) {
        return $this->conn->real_escape_string($string);
    }
}
?>