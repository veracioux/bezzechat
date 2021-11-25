"""Defines models for database interacion."""
import re

from django.contrib.auth import models as auth
from django.db import models


class User(auth.User):
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


class ChatChannel(models.Model):
    """Chat channel. Currently global chat is the only instance."""

    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=32)


class PrivateChat(models.Model):
    """Private chat between two users."""

    id = models.IntegerField(primary_key=True)
    user1 = models.ForeignKey(
        User, related_name="user1", on_delete=models.CASCADE
    )
    user2 = models.ForeignKey(
        User, related_name="user2", on_delete=models.CASCADE
    )


class Message(models.Model):
    """A chat message."""

    id = models.IntegerField(primary_key=True)
    sender_id = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    content = models.CharField(max_length=300)
