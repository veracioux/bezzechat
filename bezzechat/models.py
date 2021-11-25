"""Defines models for database interacion."""
import re

from django.contrib.auth import models


class User(models.User):
    """Extension of auth user model for the purposes of BezzeChat."""

    @staticmethod
    def is_username_valid(username):
        """Test if `username` consists of valid characters."""
        return (
            len(username) >= 2
            and len(username) <= 32
            and re.match("^[a-zA-Z0-9_-]*$", username)
        )

    @staticmethod
    def is_password_valid(password):
        """Test if `password` consists of valid characters."""
        return len(password) >= 4 and len(password) <= 32
