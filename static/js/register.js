let registerForm = document.forms["register-form"];

function createSubmitData() {
    return {
        method: "GET",
        body: new URLSearchParams(new FormData(event.target)),
    };
}

function onSubmit(event) {
    event.preventDefault();
    let req = new XMLHttpRequest();
    req.onload = function () {
        alert(this.responseText);
    };
    req.open("POST", "./submit", true);
    req.setRequestHeader("X-CSRFToken", csrfToken);
    req.send(new URLSearchParams(new FormData(registerForm)));
}

function onDataError(errors) {
    alert(errors);
}

registerForm.addEventListener("submit", onSubmit /* TODO, { once: true }*/);
