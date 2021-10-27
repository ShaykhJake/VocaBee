from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('stack/', views.stack_crud, name="stack_create"),
    path('stack/fork/<int:pk>/', views.stack_fork, name="stack_fork"),
    path('stack/<int:pk>/', views.stack_crud, name="stack_rud"),
    path('card/', views.card_crud, name="card_create"),
    path('card/<int:pk>/', views.card_crud, name="card_rud"),
    path('stacks/commstacks/', views.get_community_stacks, name="get_stacks"),
    path('stacks/persstacks/', views.get_personal_stacks, name="get_stacks"),
]
