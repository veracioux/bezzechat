"""Defines views for the app."""
from django.shortcuts import render


def index(request):
    """The root page."""
    return render(request, "index.html", {})


def chat(request):
    """The page with chat and sidebar."""
    return render(request, "chat.html", {})
