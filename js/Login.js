$(document).ready(function() {
    $("#submitButton").click(function(e) {
        e.preventDefault();
        validateForm();
    });
});

function validateForm(){
    var email = $("#email").val();
    var password = $("#password").val();
    var isValid = true;
    
    $(".error").text("");

    if(email === ""){
        $("#emailError").text("Email is required!");
        isValid = false;
    } else if(!validateEmail(email)){
        $("#emailError").text("Invalid Email format");
        isValid = false;
    }
    if(password === ""){
        $("#passwordError").text("Password is required!");
        isValid = false;
    } else if(password.length < 8){
        $("#passwordError").text("Password is too short");
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    sendDataToBackend(email ,password); 
}

function sendDataToBackend(email, password) {
    $.ajax({
        type: "POST",
        url: "http://localhost/guvi/php/login.php",
        data: {
            email: email,
            password: password
        },
        success: function(response) {
            console.log("AJAX call successful");
            var data = JSON.parse(response);
            var responseMessage = $("#responseMessage");
            $("#responseMessage").text(data.message);
            if (data.status === "success") {
                responseMessage.css('color' , 'green')
                $("#email").val("");
                $("#password").val("");
                localStorage.setItem("email", data.email);
                localStorage.setItem("username", data.username);
                window.location.href = "Profile.html";
            }else{
                responseMessage.css('color', 'red')
            }
        },
        error: function(xhr, status, error) {
            console.error("Failed to send data", error);
        }
    });
}


function validateEmail(email){
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}