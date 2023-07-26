from factory import Faker
from factory.django import DjangoModelFactory

from core.models import User
from goals.models import Board, BoardParticipant, Goal, GoalCategory


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    username = Faker('user_name')
    first_name = Faker('first_name')
    last_name = Faker('last_name')
    email = Faker('email')
    password = Faker('password')


class BoardFactory(DjangoModelFactory):
    class Meta:
        model = Board

    title = Faker('word')
    is_deleted = False


class BoardParticipantFactory(DjangoModelFactory):
    class Meta:
        model = BoardParticipant

    user = None
    board = None
    role = 1


class CategoryFactory(DjangoModelFactory):
    class Meta:
        model = GoalCategory

    title = Faker('word')
    is_deleted = False
    user = None
    board = None


class GoalFactory(DjangoModelFactory):
    class Meta:
        model = Goal

    title = Faker('word')
    user = None
    category = None
