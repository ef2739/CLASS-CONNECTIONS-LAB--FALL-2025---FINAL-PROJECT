// app.js - Funziona per ENTRAMBE le pagine (index.html e main.html)

// ===== CODICE PER INDEX.HTML (LOGIN) =====
let loginBtn = document.getElementById("loginBtn");
let passwordInput = document.getElementById("passwordInput");

if (loginBtn && passwordInput) {
    loginBtn.addEventListener("click", async () => {
        let input = passwordInput.value;

        let response = await fetch('/check-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: input
            })
        });

        let data = await response.json();

        if (data.success) {
            sessionStorage.setItem("authenticated", "true");
            window.location.href = "main.html";
        } else {
            document.getElementById("error").innerText = "Wrong password!";
        }
    });

    passwordInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            loginBtn.click();
        }
    });

    let paragraphs = document.querySelectorAll('.highlight-words');
    paragraphs.forEach(p => {
        let text = p.textContent;
        let words = text.split(' ');
        p.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');
    });
}

// ===== CODICE PER MAIN.HTML (STORIE) =====
let storyInput = document.getElementById('story-input');
let sendButton = document.getElementById('story-submit');
let storiesWrapper = document.getElementById('stories-wrapper'); // ⚠️ Cambiato in wrapper

if (storyInput && sendButton && storiesWrapper) {

    alert("TRIGGER WARNING: gender violence, sexual assault, abuse, psychological violence");

    let socket = io();

    socket.on('connect', function () {
        console.log("Connected to server!");
    });

    // Auto-resize textarea
    storyInput.addEventListener("input", () => {
        storyInput.style.height = "auto";
        storyInput.style.height = storyInput.scrollHeight + "px";
    });

    // Ricevi messaggi dal server
    socket.on('msg', function (data) {
        console.log("Message received:", data);

        // Crea un nuovo container per ogni storia
        let storyContainer = document.createElement("div");
        storyContainer.className = 'story-item';

        // Crea il paragrafo con il testo
        let msgEl = document.createElement('p');
        msgEl.textContent = data.msg;

        // Aggiungi il paragrafo al container
        storyContainer.appendChild(msgEl);

        // ⭐ POSIZIONE RANDOM (con parentesi!) ⭐
        let randomX = Math.random() * 80; // ✅ CORRETTO
        let randomY = Math.random() * 80; // ✅ CORRETTO

        // Applica la posizione
        storyContainer.style.position = 'absolute';
        storyContainer.style.left = randomX + '%';
        storyContainer.style.top = randomY + '%';

        // Aggiungi al wrapper
        storiesWrapper.appendChild(storyContainer);
    });

    // Invia messaggi al server
    sendButton.addEventListener('click', function () {
        console.log("Sending message...");

        let curStory = storyInput.value;

        if (curStory.trim() !== "") {
            let msgObj = {
                msg: curStory
            };
            socket.emit('msg', msgObj);

            storyInput.value = "";
            storyInput.style.height = "auto";
        } else {
            alert("Please write something before sending!");
        }
    });

    // Invio con Enter
    storyInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });
}


// //TONE.JS--> SOUND DESIGN

//create a synth and connect it to the main output (your speakers)
let synth = new Tone.Synth().toDestination();


let playBtn = document.getElementById("story-submit");



//autoplay policies 
playBtn.addEventListener("click", ()=> {
    if (Tone.context.state !==  "running"){
        Tone.start ();
    }
//play a middle 'C' for the duration of an 8th note
synth.triggerAttackRelease("A5", "n");
})





