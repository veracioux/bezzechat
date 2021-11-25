let registerForm = document.forms["register-form"];

function onSubmit(event) {
    event.preventDefault();
    fetch("./check/", {
        method: "POST",
        headers: {
            "X-CSRFToken": csrfToken,
        },
        body: new FormData(registerForm),
    })
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            if (data.errors.length) {
                onDataErrors(data.errors);
                registerForm.addEventListener("submit", onSubmit, {
                    once: true,
                });
            } else {
                registerForm.submit();
            }
        });
}

function onDataErrors(errors) {
    err = document.getElementById("errors");
    err.innerHTML = "";
    if (errors.includes("username_not_unique")) {
        err.innerHTML += `<li>User with that name already exists</li>`;
    }
    if (errors.includes("username_format")) {
        err.innerHTML += `<li>User name can contain only letters, numbers and _ characters</li>`;
        err.innerHTML += `<li>User name must contain between 2 and 32 characters</li>`;
    }
    if (errors.includes("password_format")) {
        err.innerHTML += `<li>Password must contain between 4 and 32 characters</li>`;
    }
    err.style.display = "block";
}

registerForm.addEventListener("submit", onSubmit, { once: true });
