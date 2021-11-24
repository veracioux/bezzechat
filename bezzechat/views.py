"""Defines views for the app."""
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import render

from .models import User


def index(request):
    """The root page."""
    return render(request, "index.html", {})


def register(request):
    """New user registration page."""
    return render(request, "register.html", {})


def register_submit(request):
    """Submit a 'register' form."""
    user = User()
    username = request.POST["username"]
    if not User.is_username_valid(username):
        # TODO Return error stating allowed characters
        pass

    user.username = username
    user.set_password(request.POST["password"])
    try:
        user.save()
    except IntegrityError as e:
        if str(e).startswith("UNIQUE constraint failed"):
            # TODO document
            data = {"errors": ["unique"]}
            return JsonResponse(data)

    return JsonResponse({"errors": []})


def login(request):
    """Login page for existing users."""
    return render(request, "login.html", {})


def chat(request):
    """The page with chat and sidebar."""
    return render(request, "chat.html", {})
