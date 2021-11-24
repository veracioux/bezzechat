"""Defines views for the app."""
from django.shortcuts import render


def index(request):
    """The root page."""
    return render(request, "index.html", {})


def register(request):
    """New user registration page."""
    return render(request, "register.html", {})


def login(request):
    """Login page for existing users."""
    return render(request, "login.html", {})


def chat(request):
    """The page with chat and sidebar."""
    return render(request, "chat.html", {})
