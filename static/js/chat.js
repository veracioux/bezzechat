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
