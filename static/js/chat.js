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

// Get handles to DOM elements
let textarea = document.querySelector("textarea");
let send = document.querySelector("#send");
let messageContainer = document.querySelector("#message-container");

let msgMeta = {
    totalCount: 0,
    loadedCount: 0,
};
var fetchPending = false;

function appendMessageToDOM(content, sender) {
    messageContainer.appendChild(createMessage(content, sender));
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function prependMessagesToDOM(messages) {
    for (msg of messages) {
        messageContainer.prepend(createMessage(msg.content, msg.sender));
    }
}

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

function fetchMessages(count, callback = () => {}) {
    // Do not fetch until the last request is finished
    if (fetchPending) {
        return;
    }
    fetchPending = true;
    return fetch(
        "./",
        jsonPostRequest({
            action: "fetch_messages",
            loadedCount: msgMeta.loadedCount,
            fetchCount: count,
        })
    )
        .then((resp) => resp.json())
        .then((data) => {
            msgMeta.loadedCount += data.messages.length;
            msgMeta.totalCount = data.totalCount;
            prependMessagesToDOM(data.messages);
            fetchPending = false;
            callback();
        })
        .catch(() => {
            fetchPending = false;
        });
}

function fetchNewMessages() {
    if (fetchPending) {
        return;
    }
    fetchPending = true;
    fetch(
        "./",
        jsonPostRequest({
            action: "fetch_new_messages",
            totalCount: msgMeta.totalCount,
        })
    )
        .then((resp) => resp.json())
        .then((data) => {
            console.log(msg.sender);
            msgMeta.totalCount = data.totalCount;
            for (msg of data.messages) {
                appendMessageToDOM(msg.content, msg.sender);
            }
            fetchPending = false;
        });
}

function fetchUntilScrollBarVisible() {
    fetchMessages(10, () => {
        if (
            messageContainer.scrollHeight <= messageContainer.clientHeight &&
            msgMeta.loadedCount < msgMeta.totalCount
        ) {
            fetchUntilScrollBarVisible();
        } else {
            messageContainer.scrollTop = messageContainer.scrollHeight;
            onFinishInitialLoad();
        }
    });
}

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

////////////
// SCRIPT //
////////////

initialAnimation();
// Initial message fetch
fetchUntilScrollBarVisible();
// Start a periodic message refresh
setInterval(() => {
    fetchNewMessages();
}, 2000);

// Add event listeners
send.addEventListener("click", () => sendMessage(textarea.value));
textarea.addEventListener("keypress", (event) => {
    if (event.key == "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage(textarea.value);
    }
});
