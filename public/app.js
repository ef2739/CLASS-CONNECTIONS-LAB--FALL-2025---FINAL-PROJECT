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

    socket.on("history", (stories) => {
        stories.forEach(sharedstory => {
            createStoryElement(sharedstory);
        })
    })

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
        createStoryElement(data);
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

    function createStoryElement(data) {
        let storyContainer = document.createElement("div");
        storyContainer.className = 'story-item';

        let msgEl = document.createElement('p');
        msgEl.textContent = data.msg;

        storyContainer.appendChild(msgEl);
        storyContainer.style.position = 'absolute';

        // funzione che prova finché non trova uno spazio libero
        let pos = findNonOverlappingPosition(storyContainer);
        pos = clampPosition(pos.x, pos.y);
        storyContainer.style.left = pos.x + '%';
        storyContainer.style.top = pos.y + '%';

        storiesWrapper.appendChild(storyContainer);
    }

    function findNonOverlappingPosition(el) {
        let stories = document.querySelectorAll('.story-item');
        let totalSectors = 12; // puoi aumentare se vuoi più spazio

        if (stories.length >= totalSectors) {
            // se pieno: torna alla distribuzione casuale
            return {
                x: Math.random() * 80,
                y: Math.random() * 80
            };
        }

        let used = [];
        stories.forEach(story => {
            used.push(story.dataset.sector);
        });

        let sector;
        do {
            sector = Math.floor(Math.random() * totalSectors);
        } while (used.includes(sector.toString()));

        el.dataset.sector = sector;

        // trasformiamo i settori in coordinate
        let cols = 4; // 4 colonne invisibili
        let rows = 3; // 3 righe invisibili

        let cellWidth = 80 / cols;
        let cellHeight = 80 / rows;

        let col = sector % cols;
        let row = Math.floor(sector / cols);

        let x = col * cellWidth + Math.random() * (cellWidth - 10);
        let y = row * cellHeight + Math.random() * (cellHeight - 10);

        return {
            x,
            y
        };
    }

    // --- MOBILE FIX: impedisce che i box escano fuori dallo schermo ---
    function clampPosition(x, y) {
        if (window.innerWidth < 768) {
            // limiti più stretti sui telefoni
            x = Math.max(2, Math.min(x, 70));
            y = Math.max(2, Math.min(y, 70));
        }
        return {
            x,
            y
        };
    }


}


// //TONE.JS--> SOUND DESIGN

//create a synth and connect it to the main output (your speakers)
let synth = new Tone.Synth().toDestination();


let playBtn = document.getElementById("story-submit");



//autoplay policies 
playBtn.addEventListener("click", () => {
    if (Tone.context.state !== "running") {
        Tone.start();
    }
    //play a middle 'C' for the duration of an 8th note
    synth.triggerAttackRelease("A5", "0,5n");
})
