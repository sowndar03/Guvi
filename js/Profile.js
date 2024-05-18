$(document).ready(function() {
    
    var email = localStorage.getItem("email");
    var username = localStorage.getItem("username");
    if(email) {
        $("#email").val(email);
    }
    if(username) {
        $("#name").val(username);
    }

    $("#submitButton").click(function(e) { 
        e.preventDefault();
        validateForm(email, username);
    });
});

function validateForm(email, username) {
    var phone = $("#phone").val();
    var course = $("#course").val(); 
    var branch = $("#branch").val(); 
    var isValid = true;
    
    $(".error").text("");

    if(phone === ""){
        $("#phoneError").text("Phone number is required"); 
        isValid = false;
    }
    if(course === ""){
        $("#courseError").text("Course is required"); 
    }
    if(branch === ""){
        $("#branchError").text("Branch is required"); 
        isValid = false;
    }

    if(!isValid){
        return;
    }

    sendDataToBackend(phone, course, branch, email, username); 
}


function sendDataToBackend(phone, course, branch, email, username) { 
    $.ajax({
        type: "POST",
        url: "http://localhost/guvi/php/profile.php",
        data: {
            phone: phone,
            course: course,
            branch: branch,
            email: email,
            name: username
        },
        success: function(response){
            var data = JSON.parse(response);

            var responseMessage = $("#responseMessage");
            responseMessage.text(data.message);

            setTimeout(() => {
                responseMessage.text('');
            }, 5000);   
            
            var responseMessage = $("#responseMessage");
            if(data.status == "success"){
                responseMessage.css("color" , "green");
                // $("#email").val("");
                // $("#phone").val("");
                // $("#name").val("");
                // $("#course").val("");
                // $("#branch").val("");
                showConfetti();
            }
            else{
                responseMessage.css("color", "red")
            }
        },
        error: function(xhr, status, error){
            console.error("Failed to send data", error);
        }
    });
}

const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
const confettiContainer = document.getElementById('confetti-container');
const submitButton = document.getElementById('submitButton');

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration  = `${Math.random() * 3 + 2}s`;
    confettiContainer.appendChild(confetti);
}


function showConfetti(){
    for (let i =0; i<100; i++){
        createConfetti();
    }
    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 5000)
}
