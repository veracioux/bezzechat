"""Defines views for the app."""
import json

from django.contrib.auth import authenticate
from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import redirect, render

from .models import Message, User


def index(request):
    """The root page."""
    return render(request, "index.html", {})


def register(request):
    """New user registration page."""
    return render(
        request,
        "login_register.html",
        {
            "title": "Register",
        },
    )


def login(request):
    """Login page for existing users."""
    if _authenticate_cookie(request):
        return redirect("chat_global")

    return render(
        request,
        "login_register.html",
        {
            "title": "Log in",
        },
    )


def register_check(request):
    """Validate register form and return JSON with detected errors."""
    data = {}
    try:
        data["errors"] = _register_check(**_login_data(request))
    except Exception as e:
        raise Http404 from e
    return JsonResponse(data)


def register_submit(request):
    """Submit a register form that was previously validated client-side.

    If the form is valid:
    - the new user is stored in the database
    - the client receives a cookie
    - the client is redirected to the chat
    Otherwise, redirects to a 404 page.
    """
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

    return _redirect_to_chat_with_cookie(username, password)


def login_check(request):
    """Validate login form and return JSON with detected errors."""
    user = authenticate(**_login_data(request))

    if user is None:
        return JsonResponse({"errors": True})

    return JsonResponse({"errors": False})


def login_submit(request):
    """Submit a login form that was previously validated client-side."""
    user = authenticate(**_login_data(request))

    if user is None:
        raise Http404

    return _redirect_to_chat_with_cookie(**_login_data(request))


def chat(request, user):
    """Private chat with `user` or global chat (if `user` empty)."""

    this_user = _authenticate_cookie(request)

    if request.method == "POST":
        data = json.loads(request.body)
        if data["action"] == "send_message":
            return _send_message(this_user, data["text"], user)

        return _fetch_messages(
            this_user, data["loadedCount"], data["fetchCount"], user
        )

    if this_user is None:
        return redirect("login")

    return render(request, "chat.html", {"username": this_user.username})


def chat_global(request):
    """Global chat page."""
    return chat(request, user="")


def chat_private(request, user):
    """Private chat page with user `user`."""
    return chat(request, user)


# Helper functions


def _register_check(username: str, password: str) -> list[str]:
    """Return a list of errors in the given username and password."""
    errors = []
    if not User.is_username_valid(username):
        errors.append("username_format")
    if not User.is_password_valid(password):
        errors.append("password_format")
    if User.objects.filter(username=username).exists():
        errors.append("username_not_unique")

    return errors


def _login_data(request):
    return dict(
        username=request.POST["username"], password=request.POST["password"]
    )


def _authenticate_cookie(request):
    """Authenticate and return a user."""
    try:
        username = request.get_signed_cookie("username")
        password = request.get_signed_cookie("password")
    except KeyError:
        return None

    return authenticate(username=username, password=password)


def _redirect_to_chat_with_cookie(username, password):
    resp = redirect("chat_global")
    resp.set_signed_cookie("username", username)
    resp.set_signed_cookie("password", password)
    return resp


def _send_message(this_user, text, user):
    if not user:
        # Send to global chat
        msg = Message(content=text, sender=this_user)
        msg.save()
    else:
        # TODO
        user = User.objects.get(username=user)
    return HttpResponse()


# TODO remove
# pylint: disable=unused-argument
def _fetch_messages(this_user, loaded_count, fetch_count, user):
    data = {}
    # if not user:
    #     channel =
    # TODO query only target channel
    query_set = Message.objects.all()  # pylint: disable=no-member
    messages = query_set.order_by("time_sent").reverse()[
        loaded_count : loaded_count + fetch_count
    ]
    data["messages"] = [
        {
            "content": msg.content,
            "sender": msg.sender.username,
        }
        for msg in messages
    ]
    data["totalCount"] = query_set.count()
    return JsonResponse(data)
