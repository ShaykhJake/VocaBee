from django.db import models
from users.models import User


class Card(models.Model):
    """Model for the vocabulary card"""
    curator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    curation_date = models.DateTimeField(auto_now_add=True, editable=False)
    side_1 = models.TextField(default="", null=False)
    side_1_direction = models.CharField(max_length=5)
    side_2 = models.TextField(default="", null=False)
    side_2_direction = models.CharField(max_length=5)
    curator_note = models.CharField(max_length=255, default="", null=True)

    def serialize(self):
        return {
            "id": self.pk,
            "curator": self.curator.username,
            "curation_date": self.curation_date.strftime("%b %d %Y, %I:%M %p"),
            "side_1": self.side_1,
            "side_1_direction": self.side_1_direction,
            "side_2": self.side_2,
            "side_2_direction": self.side_2_direction,
            "curator_note": self.curator_note
        }

    def __str__(self):
        return f'{self.side_1} - {self.side_2}'


class CardStack(models.Model):
    """Model for the stack of vocabulary cards"""
    curator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    curation_date = models.DateTimeField(auto_now_add=True, editable=False)
    updated = models.DateTimeField(auto_now=True, editable=False)
    name = models.CharField(max_length=255, default="", null=False)
    description = models.CharField(max_length=255)
    default_side_1_direction = models.CharField(
        max_length=5, default="ltr", null=False)
    default_side_2_direction = models.CharField(
        max_length=5, default="ltr", null=False)
    public = models.BooleanField(default=False)
    cards = models.ManyToManyField(Card)

    def list_serialize(self):
        """Serializer for list representation"""
        return {
            "id": self.pk,
            "curator": self.curator.username,
            "curation_date": self.curation_date.strftime("%b %d %Y, %I:%M %p"),
            "updated": self.updated.strftime("%b %d %Y, %I:%M %p"),
            "name": self.name,
            "description": self.description,
            "public": self.public,
            "card_count": self.cards.count(),
        }

    def stack_serialize(self):
        """Serializer for individual stack representation"""
        return {
            "id": self.pk,
            "curator": self.curator.username,
            "curation_date": self.curation_date.strftime("%b %d %Y, %I:%M %p"),
            "updated": self.updated.strftime("%b %d %Y, %I:%M %p"),
            "name": self.name,
            "description": self.description,
            "public": self.public,
            "cards": [card.serialize() for card in self.cards.all()],
        }

    def __str__(self):
        return self.name


class CardLearning(models.Model):
    """Model for tracking the learning statistics of
    each card
    """
    curator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    curation_date = models.DateTimeField(auto_now_add=True, editable=False)
    lexeme_pair = models.ForeignKey(Card, on_delete=models.CASCADE, null=False)
    last_attempted = models.DateTimeField(auto_now=True, editable=False)
    attempts = models.PositiveIntegerField(default=0)
    number_correct = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)
