<?php

// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 86400");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit(0);
}

// Check if required fields are present
if(isset($_POST['name']) && isset($_POST['email']) && isset($_POST['dob']) && isset($_POST['password']) && isset($_POST['cpassword'])) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $dob = $_POST['dob'];
    $password = $_POST['password'];
    $cpassword = $_POST['cpassword'];
    
    $conn = new mysqli('localhost', 'root', '', 'test');
    if ($conn->connect_error) {
        die('Connection Failed : ' . $conn->connect_error);
    }

    $stmt = $conn->prepare("SELECT * FROM guvi WHERE Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(array("status" => "error", "message" => "User already Exists!"));
    } else {
        $stmt->close();
        $insertStmt = $conn->prepare("INSERT INTO guvi (Name, Email, Dob, Password, Cpassword) VALUES (?,?,?,?,?)");
        $insertStmt->bind_param("sssss", $name, $email, $dob, $password, $cpassword);
        $insertStmt->execute();

        if ($insertStmt->affected_rows > 0) {
            echo json_encode(array("status" => "success", "message" => "User Registered Successfully!"));
        } else {
            echo json_encode(array("status" => "error", "message" => "Failed to Register!"));
        }

        $insertStmt->close();
    }   

    $conn->close();
} else {
    echo "Error: Required fields are missing!";
}
?>
