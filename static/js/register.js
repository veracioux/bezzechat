let registerForm = document.forms["register-form"];

/**
 * - Send form data
 * - Receive cookie
 * - Redirect to "/chat/"
 */
function onSubmit(event) {
    event.preventDefault();
    fetch("./submit", {
        method: "POST",
        headers: {
            "X-CSRFToken": csrfToken,
        },
        body: new FormData(registerForm),
    })
        .then(function (resp) {
            return resp.json();
        })
        .then(function (json) {
            if (!json.errors.length) {
                document.cookie = json.cookie;
                location.href = "/chat";
            } else {
                onDataError(json.errors);
            }
        });
}

function onDataError(errors) {
    // TODO
    if (errors.contains("unique")) {
    }
}

registerForm.addEventListener("submit", onSubmit);
