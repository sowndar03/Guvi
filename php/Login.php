<?php 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 86400");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    exit(0);
}

if (isset($_POST['email']) && isset($_POST['password'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $conn = new mysqli("localhost", "root", "", "test");
    if ($conn->connect_error) {
        die(json_encode(array("status" => "error", "message" => 'Connection failed: ' . $conn->connect_error)));
    }

    $stmt = $conn->prepare("SELECT * FROM guvi WHERE Email = ? AND Password = ?");
    $stmt->bind_param("ss", $email, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();



        echo json_encode(array("status" => "success", "message" => "Login Successfully" ,  "email" => $row['Email'],
        "username" => $row['Name']));
    } else {
        echo json_encode(array("status" => "error", "message" => "Invalid email or password"));
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(array("status" => "error", "message" => "Required fields are missing!"));
}
?>
