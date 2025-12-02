alert("TW: SA");


window.addEventListener('load', function () {
    //Open and connect socket
    let socket = io();

    //Listen for confirmation of connection
    socket.on('connect', function () {
        console.log("connected!");
    });
});


//PASSWORD: verify the entered password and check if it's correct. --For SAFETY PURPOSES the next process is to "hide" the password through server side file

document.getElementById("enter-main-page-btn").addEventListener("click", async () => {
    const input = document.getElementById("passwordbox").value;

    const response = await fetch('/check-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: input })
    });

    const data = await response.json();

    if(data.success){
        sessionStorage.setItem("authenticated", "true");
        window.location.href = "main.html";
    } else {
        document.getElementById("error").innerText = "Wrong password!";
    }
});

// Verify also with enter

document.getElementById("passwordbox").addEventListener("keyup", (e) => {
    if(e.key === "Enter"){
        document.getElementById("enter-main-page-btn").click();
    }
});


//let the hover function on the index.html text work

let paragraphs = document.querySelectorAll('.highlight-words');

paragraphs.forEach(p => {
  let text = p.textContent;
  let words = text.split(' ');
  p.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');
});
