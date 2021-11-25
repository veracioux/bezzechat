let loginForm = document.forms["form"];

function onSubmit(event) {
    event.preventDefault();
    fetch("./check/", {
        method: "POST",
        headers: {
            "X-CSRFToken": csrfToken,
        },
        body: new FormData(loginForm),
    })
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            if (data.errors) {
                onAuthenticationFailed();
                alert("login");
                loginForm.addEventListener("submit", onSubmit, {
                    once: true,
                });
            } else {
                loginForm.submit();
            }
        });
}

function onAuthenticationFailed() {
    err = document.getElementById("errors");
    err.innerHTML = "";
}

loginForm.addEventListener("submit", onSubmit, { once: true });
