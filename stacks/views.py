import json
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Card, CardStack, CardLearning
from django.http import JsonResponse

# Create your views here.


def index(request):
    """Renders the primary landing page as a mostly single page application"""
    return render(request, "stacks/index.html")


def card_crud(request, pk=None):
    """This is the primary view for CRUD operations on
    individual vocab cards, except that there currently
    is no retrieve/GET operations because the functionality
    is unnecessary at this stage in the app development.
    """
    response = {}
    data = json.loads(request.body)
    # Creating a new card
    if request.method == "POST":
        card = Card()
        card.curator = request.user
        card.side_1 = data["side_1"]
        card.side_1_direction = data["side_1_direction"]
        card.side_2 = data["side_2"]
        card.side_2_direction = data["side_2_direction"]
        card.curator_note = data["curator_note"]
        card.save()
        # Retrieve the stack to which the card is added
        stack = get_object_or_404(CardStack, pk=data["stack_id"])
        stack.cards.add(card)
        # Return the entire stack in which the card appears:
        response["stack"] = stack.stack_serialize()
        response["success"] = True
    # Updating an existing card
    elif request.method == "PATCH":
        card = get_object_or_404(Card, pk=pk)
        if card.curator == request.user:
            card.side_1 = data["side_1"]
            card.side_1_direction = data["side_1_direction"]
            card.side_2 = data["side_2"]
            card.side_2_direction = data["side_2_direction"]
            card.curator_note = data["curator_note"]
            card.save()
            stack = get_object_or_404(CardStack, pk=data["stack_id"])
            # Return the entire stack:
            response["stack"] = stack.stack_serialize()
            response["success"] = True
        else:
            response["success"] = False
            response["message"] = "Unauthorized"
    # Deleting an existing card
    elif request.method == "DELETE":
        card = get_object_or_404(Card, pk=pk)
        if card.curator == request.user:
            card.delete()
            stack = get_object_or_404(CardStack, pk=data["stack_id"])
            response["stack"] = stack.stack_serialize()
            response["success"] = True
    else:
        response["message"] = "Bad request"
    return JsonResponse(response, safe=False)


def get_community_stacks(request):
    """This is the master stack list view for all community stacks, except
    one's own stacks. Only publicly available stacks are retrieved.
    """
    if request.method == "GET":
        stack_queryset = CardStack.objects.filter(
            public=True).order_by("-curation_date")
        if request.user.is_authenticated:
            stack_queryset = stack_queryset.exclude(curator=request.user)
        response = {
            "stacks": [stack.list_serialize() for stack in stack_queryset],
        }
        return JsonResponse(response, safe=False)


@login_required
def get_personal_stacks(request):
    """This is the master stack list view for a
    user's personal list of card stacks
    """
    if request.method == "GET":
        stack_queryset = CardStack.objects.filter(
            curator=request.user).order_by("-curation_date")
        response = {
            "stacks": [stack.list_serialize() for stack in stack_queryset],
        }
        return JsonResponse(response, safe=False)


def stack_crud(request, pk=None):
    """This is the master CRUD view for card stacks
    """
    response = {}
    if request.method == "GET":
        stack = get_object_or_404(CardStack, pk=pk)
        if stack.public or stack.curator == request.user:
            response = {
                "success": True,
                "stack": stack.stack_serialize()
            }
        else:
            response = {
                "success": False,
                "message": "You do not have permission."
            }

    if request.method == "POST":
        data = json.loads(request.body)
        stack = CardStack()
        stack.curator = request.user
        stack.name = data["name"]
        stack.description = data["description"]
        stack.public = data["public"]
        stack.save()
        response["success"] = True
        response["stack"] = stack.stack_serialize()
        response["message"] = "Stack info successfully created."
    if request.method == "PATCH":
        data = json.loads(request.body)
        stack = get_object_or_404(CardStack, pk=data["id"])
        if stack.curator == request.user:
            stack.name = data["name"]
            stack.description = data["description"]
            stack.public = data["public"]
            stack.save()
            response["success"] = True
            response["stack"] = stack.stack_serialize()
            response["message"] = "Stack info successfully updated."
        else:
            response["success"] = False
            response["message"] = "You are not authorized."
    if request.method == "DELETE":
        stack = get_object_or_404(CardStack, pk=pk)
        if stack.curator == request.user:
            stack.delete()
            response["success"] = True
            response["message"] = "Stack successfully deleted."
        else:
            response["success"] = False
            response["message"] = "You are not authorized."

        pass
    return JsonResponse(response, safe=False)


def stack_fork(request, pk):
    """This creates an exact copy of a stack and its
    cards and returns the new stack to the user.
    """
    response = {}
    if request.method == "POST":
        stack = get_object_or_404(CardStack, pk=pk)
        new_stack = CardStack()
        new_stack.curator = request.user
        new_stack.name = stack.name
        new_stack.description = stack.description
        new_stack.public = False
        new_stack.save()
        for card in stack.cards.all():
            new_card = card
            new_card.pk = None
            new_card.curator = request.user
            new_card.save()
            new_stack.cards.add(new_card)
        response["success"] = True
        response["stack"] = new_stack.stack_serialize()
        response["message"] = "Stack successfully cloned."
    return JsonResponse(response, safe=False)
