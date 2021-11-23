"""Defines views for the app."""
from django.shortcuts import render


def index(request):
    """The root page."""
    return render(request, "index.html", {})
