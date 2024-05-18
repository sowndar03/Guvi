<?php 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 86400");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    exit(0);
}

if(isset($_POST['phone']) && isset($_POST['course']) && isset($_POST['branch']) && isset($_POST['name']) && isset($_POST['email'])){
    $phone = $_POST['phone'];
    $course = $_POST['course'];
    $branch = $_POST['branch'];
    $email = $_POST['email'];
    $name = $_POST['name'];

    $conn = new mysqli("localhost", "root", "", "test");
    if($conn->connect_error){
        die("Connection failed: " . $conn->connect_error);
    }

    // Check if user already exists
    $stmt = $conn->prepare("SELECT * FROM guviprofile WHERE Email = ? OR Phone = ?");
    $stmt->bind_param("ss", $email, $phone);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if($result->num_rows > 0){
        echo json_encode(array("status" => "success", "message" => "Profile has already been updated!"));
    } else {
        // Insert new user
        $stmt = $conn->prepare("INSERT INTO guviprofile (Name, Email, Phone, Course, Branch) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $name, $email, $phone, $course, $branch);
        $stmt->execute();
        
        if($stmt->affected_rows > 0){
            echo json_encode(array("status" => "success", "message" => "Profile Updated Successfully!"));
        } else {
            echo json_encode(array("status" => "error", "message" => "Failed to update!"));
        }
    }
    
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(array("status" => "error", "message" => "Required fields are missing!"));
}

?>
