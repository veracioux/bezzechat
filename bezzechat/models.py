"""Defines models for database interacion."""
import re

from django.contrib.auth import models as auth
from django.db import models


class User(auth.User):
    """Extension of auth user model for the purposes of BezzeChat."""

    online = models.BooleanField(default=True)

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
    """Chat channel.

    There are two types of channels: public and private. Public channels can
    have any number of participants, whereas private channels are between two
    users. Public chats have a non-null name and `user1` and `user2` equal to
    null. For private chats the opposite is true.

    Currently global chat is the only public chat."""

    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=32, null=True)
    user1 = models.ForeignKey(
        User, related_name="user1", on_delete=models.CASCADE, null=True
    )
    user2 = models.ForeignKey(
        User, related_name="user2", on_delete=models.CASCADE, null=True
    )


class Message(models.Model):
    """A chat message."""

    id = models.IntegerField(primary_key=True)
    sender = models.ForeignKey(auth.User, on_delete=models.SET_NULL, null=True)
    # channel = models.ForeignKey(
    #     ChatChannel, on_delete=models.CASCADE, null=False
    # )
    content = models.CharField(max_length=300)
    time_sent = models.DateTimeField(auto_now=True)

    def json(self):
        """Get a JSON representation of the message."""
        return {
            "content": self.content,
            "sender": self.sender.username,  # pylint: disable=no-member
        }
