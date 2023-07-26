import pytest
from django.test import Client
from pytest_factoryboy import register

from tests.factories import BoardFactory, BoardParticipantFactory, CategoryFactory, GoalFactory, UserFactory

# Factories
register(UserFactory)
register(BoardFactory)
register(BoardParticipantFactory)
register(CategoryFactory)
register(GoalFactory)


@pytest.fixture
@pytest.mark.django_db
def authenticated_user():
    user = UserFactory.create()
    password = user.password
    user.set_password(password)
    user.save()
    create_instances_for_user(user)
    client = Client()
    client.login(username=user.username, password=password)
    return {'client': client, 'user': user, 'password': password}


@pytest.fixture
@pytest.mark.django_db
def users():
    users = UserFactory.create_batch(2)
    for user in users:
        create_instances_for_user(user)
    return users


def create_instances_for_user(user) -> None:
    board = BoardFactory()
    BoardParticipantFactory(user=user, board=board, role=1)
    categories = CategoryFactory.create_batch(2, user=user, board=board)
    for cat in categories:
        GoalFactory.create(user=user, category=cat)
