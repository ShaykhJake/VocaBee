from django.contrib import admin
from .models import Card, CardStack, CardLearning
# Register your models here.

admin.site.register(Card)
admin.site.register(CardStack)
admin.site.register(CardLearning)