/**
 * First lift up the container (using shadows), then fade in the child elements.
 */
function initialAnimation() {
    // Query elements
    container = document.querySelector("#chat-container");
    anim_overlay = container.querySelector("#animation-overlay");

    container.addEventListener(
        "animationend",
        function () {
            anim_overlay.addEventListener(
                "animationend",
                function () {
                    anim_overlay.style.opacity = 0;
                },
                { once: true }
            );
            anim_overlay.style.animation = "fade-out 1s";
            anim_overlay.style.pointerEvents = "none";
        },
        { once: true }
    );

    container.style.animation = "rise 0.7s";
}
initialAnimation();

// Get element handles
let textarea = document.querySelector("textarea");
let send = document.querySelector("#send");
let messageContainer = document.querySelector("#message-container");

// Add event listeners
send.addEventListener("click", () => sendMessage(textarea.value));
textarea.addEventListener("keypress", (event) => {
    if (event.key == "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage(textarea.value);
    }
});

function appendMessageToDOM(content, sender) {
    messageContainer.appendChild(createMessage(content, sender));
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function prependMessagesToDOM(messages) {
    for (msg of messages) {
        messageContainer.prepend(createMessage(msg.content, msg.sender));
    }
}

let totalCount = 0;
let loadedCount = 0;

function sendMessage(text) {
    textarea.value = "";
    fetch(
        "./",
        jsonPostRequest({
            action: "send_message",
            text: text,
        })
    ).then((resp) => {
        if (resp.ok) {
            fetchNewMessages();
        } else {
            textarea.value = text;
        }
    });
}

var resolved = true;
function fetchMessages(count, callback = () => {}) {
    // Do not fetch until the last request is finished
    if (!resolved) {
        return;
    }
    resolved = false;
    return fetch(
        "./",
        jsonPostRequest({
            action: "fetch_messages",
            loadedCount: loadedCount,
            fetchCount: count,
        })
    )
        .then((resp) => resp.json())
        .then((data) => {
            loadedCount += data.messages.length;
            totalCount = data.totalCount;
            prependMessagesToDOM(data.messages);
            resolved = true;
            callback();
        })
        .catch(() => {
            resolved = true;
        });
}

function fetchNewMessages() {
    if (!resolved) {
        return;
    }
    resolved = false;
    fetch(
        "./",
        jsonPostRequest({
            action: "fetch_new_messages",
            totalCount: totalCount,
        })
    )
        .then((resp) => resp.json())
        .then((data) => {
            console.log(msg.sender);
            totalCount = data.totalCount;
            for (msg of data.messages) {
                appendMessageToDOM(msg.content, msg.sender);
            }
            resolved = true;
        });
}

function fetchUntilScrollBarVisible() {
    fetchMessages(10, () => {
        if (
            messageContainer.scrollHeight <= messageContainer.clientHeight &&
            loadedCount < totalCount
        ) {
            fetchUntilScrollBarVisible();
        } else {
            messageContainer.scrollTop = messageContainer.scrollHeight;
            onFinishInitialLoad();
        }
    });
}

// Initial message fetch
fetchUntilScrollBarVisible();
// Start a periodic message refresh
setInterval(() => {
    fetchNewMessages();
}, 2000);

function onFinishInitialLoad() {
    messageContainer.addEventListener("wheel", (event) => {
        if (
            event.deltaY / event.target.clientHeight < -0.4 &&
            event.target.scrollTop == 0
        ) {
            fetchMessages(10, () => (event.target.scrollTop = 0));
        }
    });
}

// Helper functions

function jsonPostRequest(data) {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(data),
    };
}

function createMessage(content, sender) {
    console.log(content, sender);
    let temp = document.getElementsByTagName("template")[0];
    let msg = temp.content.cloneNode(true);
    let messageBubble = msg.querySelector(".message-bubble");
    let photoBubble = msg.querySelector(".photo-bubble");
    messageBubble.innerText = content;
    photoBubble.title = sender;
    photoBubble.innerText = sender[0];

    return msg;
}
