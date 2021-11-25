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

function sendMessage(text) {
    let temp = document.getElementsByTagName("template")[0];
    let msg = temp.content.cloneNode(true);
    let bubble = msg.querySelector(".message-bubble");
    bubble.innerText = text;
    messageContainer.appendChild(msg);
    messageContainer.scrollIntoView(msg);
}

let messageCount = 0;

function fetchMessages(count) {
    // TODO
}
