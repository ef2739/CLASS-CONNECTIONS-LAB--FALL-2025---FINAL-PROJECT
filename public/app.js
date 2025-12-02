alert("TW: SA");


window.addEventListener('load', function () {
    //Open and connect socket
    let socket = io();

    //Listen for confirmation of connection
    socket.on('connect', function () {
        console.log("connected!");
    });
});


//create a password. establish the connection with main.html through a password check//

// document.getElementById("enter-main-page-btn").addEventListener("click", checkPassword);

// function checkPassword() {
//     let correctpswd = "123";
//     let entered = document.getElementById("passwordbox").value;

//     if (entered === correctpswd) {
//         window.location.href = "main.html"; 
//     } else {
//         alert("Wrong password!");
//     }
// }


