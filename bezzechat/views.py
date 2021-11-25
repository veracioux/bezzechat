"""Defines views for the app."""
from django.http import Http404, JsonResponse
from django.shortcuts import redirect, render

from .models import User


def index(request):
    """The root page."""
    return render(request, "index.html", {})


def register(request):
    """New user registration page."""
    return render(request, "register.html", {})


def register_submit(request):
    """Submit a 'register' form."""
    try:
        username = request.POST["username"]
        password = request.POST["password"]
    except Exception as e:
        raise Http404 from e

    errors = _register_check(username, password)
    if errors:
        raise Http404

    user = User()
    user.username = username
    user.set_password(password)
    user.save()

    resp = redirect("chat")
    resp.set_signed_cookie("username", username)
    resp.set_signed_cookie("password", password)
    return resp


def _register_check(username: str, password: str) -> list[str]:
    """Return a list of errors with the given username and password."""
    errors = []
    if not User.is_username_valid(username):
        errors.append("username_format")
    if not User.is_password_valid(password):
        errors.append("password_format")
    if User.objects.filter(username=username).exists():
        errors.append("username_not_unique")

    return errors


def register_check(request):
    """Validate register form data and return a JSON with detected errors."""
    data = {}
    try:
        data["errors"] = _register_check(
            request.POST["username"], request.POST["password"]
        )
    except Exception as e:
        raise Http404 from e
    return JsonResponse(data)


def login(request):
    """Login page for existing users."""
    return render(request, "login.html", {})


def login_submit(_):
    """Submit login data and expect a data validity confirmation."""
    # TODO


def chat(request):
    """The page with chat and sidebar."""
    print(request.COOKIES)
    return render(request, "chat.html", {})
