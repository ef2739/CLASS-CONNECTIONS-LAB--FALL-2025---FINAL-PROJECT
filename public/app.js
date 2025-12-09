//this document works both for index.html and main.html

// index.html
let loginBtn = document.getElementById("loginBtn");
let passwordInput = document.getElementById("passwordInput");

//create a process for the password verification
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


 //Create an hover effect on each word from the text in the background
    let underlinedwords = document.querySelectorAll('.highlight-words p');

    underlinedwords.forEach(p => {
        let text = p.textContent;

        // Divide the words and mantain the spaces
        let words = text.split(/(\s+)/);

        p.innerHTML = words.map(part => {
            // If there's a space, leave it as it is 
            if (/^\s+$/.test(part)) {
                return part;
            }
            // otherwise wrap the word in a span
            return `<span>${part}</span>`;
        }).join('');
    });
}

// main.html
let storyInput = document.getElementById('story-input');
let sendButton = document.getElementById('story-submit');
let storiesWrapper = document.getElementById('stories-wrapper'); 


//when the user writes the personal story and presses send, show the message on the page.
if (storyInput && sendButton && storiesWrapper) {
    alert("TRIGGER WARNING: gender violence, sexual assault, abuse, psychological violence");
    let socket = io();
    socket.on("history", (stories) => {
        console.log("history received");
        stories.forEach(sharedstory => {
            createStoryElement(sharedstory);
        })
    })

    socket.on('connect', function () {
        console.log("Connected to server!");
    });


    
// Auto-resize textarea where the user writes the story
    storyInput.addEventListener("input", () => {
        storyInput.style.height = "auto";
        storyInput.style.height = storyInput.scrollHeight + "px";
    });

    
    // receive messages from the server
    socket.on('msg', function (data) {
        console.log("Message received:", data);
        createStoryElement(data);
    });

    // send messages to the server
    //when the send button is pressed trigger a note 
    sendButton.addEventListener('click', async function () {
        console.log("but")
        if (Tone.context.state !== "running") {
            await Tone.start();
        }
        //play a middle 'C' for the duration of an 8th note
        synth.triggerAttackRelease("C4", "0,5n");

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

    // send with enter 
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

        // format the page so that the stories do not overlap on the screen
        let pos = findNonOverlappingPosition(storyContainer);
        pos = clampPosition(pos.x, pos.y);
        storyContainer.style.left = pos.x + '%';
        storyContainer.style.top = pos.y + '%';

        storiesWrapper.appendChild(storyContainer);
    }

    function findNonOverlappingPosition(el) {
        let stories = document.querySelectorAll('.story-item');
        let totalSectors = 12; // 

        if (stories.length >= totalSectors) {
            // if the apge it's full go back to random distribution on the page
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

        // divide the page inro sectors
        let cols = 4; // 4 invisible columns
        let rows = 3; // 3 invisible rows

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

    // mobile fix : avoid the stories to exit the screen
    function clampPosition(x, y) {
        if (window.innerWidth < 768) {
            x = Math.max(2, Math.min(x, 70));
            y = Math.max(2, Math.min(y, 70));
        }
        return {
            x,
            y
        };
    }

}




//tone.js --> synth
let synth = new Tone.Synth().toDestination();



