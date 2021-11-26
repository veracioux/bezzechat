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

function createMessage(content, sender) {
    let temp = document.getElementsByTagName("template")[0];
    let msg = temp.content.cloneNode(true);
    let messageBubble = msg.querySelector(".message-bubble");
    let photoBubble = msg.querySelector(".photo-bubble");
    messageBubble.innerText = content;
    photoBubble.innerText = sender[0];

    return msg;
}

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
    fetch(
        "./",
        jsonPostRequest({
            action: "send_message",
            text: text,
        })
    ).then((resp) => {
        appendMessageToDOM(text, username);
    });
}

function fetchMessages(count) {
    fetch(
        "./",
        jsonPostRequest({
            action: "fetch_messages",
            totalCount: totalCount,
            loadedCount: loadedCount,
            fetchCount: count,
        })
    )
        .then((resp) => resp.json())
        .then((data) => {
            prependMessagesToDOM(data.messages);
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

fetchMessages(10);
