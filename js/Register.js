$(document).ready(function() {
    $("#dateInput").click(function() {
        this.type = "date";
    });

    $("#submitButton").click(function(e) {
        e.preventDefault();
        validateForm();
    });
});

function validateForm() {
    var name = $("#name").val();
    var email = $("#email").val();
    var dob = $("#dateInput").val();
    var password = $("#password").val();
    var cpassword = $("#cpassword").val();
    console.log(dob);
    var isValid = true; 
    
    $(".error").text("");

    if(name === ""){
        $("#nameError").text("Name is required!");
        isValid = false;
    }
    if(email === ""){
        $("#emailError").text("Email is required!");
        isValid = false;
    } else if(!validateEmail(email)){
        $("#emailError").text("Invalid Email format");
        isValid = false;
    }
    if(dob === ""){
        $("#dobError").text("Date of birth is required!");
        isValid = false;
    }
    if(password === ""){
        $("#passwordError").text("Password is required!");
        isValid = false;
    } else if(password.length < 8){
        $("#passwordError").text("Password is too short");
        isValid = false;
    }
    if(cpassword === ""){
        $("#cpasswordError").text("Confirm password is required!");
        isValid = false;
    } else if(password != cpassword){
        $("#cpasswordError").text("Password mismatch");
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    sendDataToBackend(name, email, dob, password, cpassword);
}

function sendDataToBackend(name, email, dob, password, cpassword){
    $.ajax({
        type: "POST",
        url: "http://localhost/guvi/php/register.php",
        data: {
            name: name,
            email: email,
            dob: dob,
            password: password,
            cpassword: cpassword
        },
        success: function(response){
            var data = JSON.parse(response);
            var responseMessage = $("#responseMessage"); 
            $("#responseMessage").text(data.message);
            if(data.status == "success"){
                responseMessage.css("color", "green");
                $("#name").val("");
                $("#email").val("");
                $("#dateInput").val("");
                $("#password").val("");
                $("#cpassword").val("");
                window.location.href = "login.html";
            }  else{
                responseMessage.css("color", "red");
            }
        },
        error: function(xhr, status, error){
            console.error("Failed to send data", error);
        }
    });
}

function validateEmail(email){
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
