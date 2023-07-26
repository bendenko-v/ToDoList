from typing import OrderedDict

import pytest
from django.test import Client

from core.models import User
from goals.models import Board, BoardParticipant, Goal, GoalCategory


@pytest.mark.django_db
class TestCoreAuthentication:
    def test_core_signup(self):
        """Test user sign up"""
        client = Client()
        response = client.post(
            '/core/signup',
            {'username': 'test_user', 'password': 'Pass112233', 'password_repeat': 'Pass112233'},
            content_type='application/json',
        )
        expected_response = {'id': 1, 'username': 'test_user', 'email': '', 'first_name': '', 'last_name': ''}
        assert response.status_code == 201
        assert response.data == expected_response

    def test_core_login(self, authenticated_user: dict):
        """Test user login"""
        client = authenticated_user.get('client')
        user = authenticated_user.get('user')
        password = authenticated_user.get('password')

        response = client.post(
            '/core/login',
            {'username': user.username, 'password': password},
            content_type='application/json',
        )
        expected_response = {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
        }
        assert response.status_code == 200
        assert response.data == expected_response

    def test_core_profile(self, authenticated_user: dict):
        """
        Test for user profile retrieval,
        Test for user profile update,
        Test for user profile patch (with validation error for username)"""
        client = authenticated_user.get('client')
        user = authenticated_user.get('user')

        response = client.get('/core/profile')
        expected_response = {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
        }
        assert response.status_code == 200
        assert response.data == expected_response

        changes_data = {
            'username': 'changed_name',
            'email': 'test_email@wrong.me',
            'first_name': 'Name',
            'last_name': 'Surname',
        }

        # Check PUT method with user data changing
        response = client.put('/core/profile', changes_data, content_type='application/json')
        changes_data['id'] = user.id

        assert response.status_code == 200
        assert response.data == changes_data

        # Check PATCH method with username already exists bad request
        User.objects.create(username='user_exists', password='testPassword')
        response = client.patch('/core/profile', {'username': 'user_exists'}, content_type='application/json')

        assert response.status_code == 400
        assert 'username already exists' in response.data.get('username')[0]

    def test_core_update_password(self, authenticated_user: dict):
        """Test user update password"""
        client = authenticated_user.get('client')
        password = authenticated_user.get('password')

        response = client.put(
            '/core/update_password',
            {'old_password': password, 'new_password': 'new_password1234'},
            content_type='application/json',
        )
        assert response.status_code == 200
        assert response.data == {}


@pytest.mark.django_db
class TestBoards:
    expected_fields = ['id', 'created', 'updated', 'title', 'is_deleted']

    def test_board_list(self, authenticated_user: dict):
        """Test user get boards list"""
        client = authenticated_user.get('client')
        response = client.get('/goals/board/list')

        assert response.status_code == 200
        for field in self.expected_fields:
            assert field in response.data[0]

    def test_board_get_by_id(self, authenticated_user: dict):
        """Test user get the board"""
        client = authenticated_user.get('client')
        user = authenticated_user.get('user')
        board = Board.objects.filter(participants__user=user).first()

        response = client.get(f'/goals/board/{board.id}')
        expected_fields = self.expected_fields + ['participants']

        assert response.status_code == 200
        for field in expected_fields:
            assert field in response.data.keys()
        assert isinstance(response.data.get('participants')[0], OrderedDict)

    def test_board_create_update_delete(self, authenticated_user: dict, users: list):
        """
        Test user create a board
        Test user update the board with other participants
        Test user delete the board
        """
        client = authenticated_user.get('client')
        user = authenticated_user.get('user')

        response = client.post(
            '/goals/board/create',
            {'title': 'New board'},
            content_type='application/json',
        )

        assert response.status_code == 201
        for field in self.expected_fields:
            assert field in response.data

        board = Board.objects.filter(participants__user=user).first()
        changes_data = {
            'participants': [{'role': 2, 'user': users[0].username}, {'role': 3, 'user': users[1].username}],
            'title': 'Changed board',
            'is_deleted': False,
        }
        response = client.put(f'/goals/board/{board.id}', changes_data, content_type='application/json')
        participants = response.data.get('participants')
        user1_data = participants[0]
        user2_data = participants[1]
        user3_data = participants[2]

        assert response.status_code == 200
        assert response.data['title'] == 'Changed board'
        assert user1_data.get('user') == user.username
        assert user1_data.get('role') == BoardParticipant.Role.owner
        assert user2_data.get('user') == users[0].username
        assert user2_data.get('role') == BoardParticipant.Role.writer
        assert user3_data.get('user') == users[1].username
        assert user3_data.get('role') == BoardParticipant.Role.reader

        response = client.delete(f'/goals/board/{board.id}')
        assert response.status_code == 204


@pytest.mark.django_db
class TestCategory:
    expected_fields = ('id', 'user', 'board', 'created', 'updated', 'title', 'is_deleted')

    def test_category_list(self, authenticated_user: dict):
        """Test user get categories list"""
        client = authenticated_user.get('client')
        user = authenticated_user.get('user')

        response = client.get('/goals/goal_category/list')

        assert response.status_code == 200
        assert len(response.data) == 2
        for field in self.expected_fields:
            assert field in response.data[0]
        assert response.data[0].get('user').get('username') == user.username

    def test_category_get_by_id(self, authenticated_user: dict):
        """Test user get category by id"""
        client = authenticated_user.get('client')
        user = authenticated_user.get('user')
        category = GoalCategory.objects.filter(user=user).first()

        response = client.get(f'/goals/goal_category/{category.id}')

        assert response.status_code == 200
        for field in self.expected_fields:
            assert field in response.data
        assert response.data.get('user', {}).get('username') == user.username

    def test_category_create_update_delete(self, authenticated_user: dict):
        """
        Test user create a category
        Test user update the category
        Test user delete the category
        """
        client = authenticated_user.get('client')
        user = authenticated_user.get('user')
        board = Board.objects.filter(participants__user=user).first()

        response = client.post(
            '/goals/goal_category/create',
            {'title': 'New category', 'board': board.id},
            content_type='application/json',
        )

        assert response.status_code == 201
        assert response.data.get('title') == 'New category'
        assert response.data.get('board') == board.id

        category_id = response.data.get('id')

        response = client.put(
            f'/goals/goal_category/{category_id}', {'title': 'Title updated'}, content_type='application/json'
        )
        assert response.status_code == 200
        assert response.data.get('title') == 'Title updated'

        response = client.delete(f'/goals/goal_category/{category_id}')
        assert response.status_code == 204


@pytest.mark.django_db
class TestGoal:
    expected_fields = (
        'id',
        'user',
        'created',
        'updated',
        'title',
        'description',
        'due_date',
        'status',
        'priority',
        'category',
    )

    def test_goals_list(self, authenticated_user: dict):
        """
        Test user get goals list
        Test user get goals with query params (status, priority, category)
        """
        client = authenticated_user.get('client')
        user = authenticated_user.get('user')

        response = client.get('/goals/goal/list')

        assert response.status_code == 200
        assert len(response.data) == 2
        for field in self.expected_fields:
            assert field in response.data[0]
        assert response.data[0].get('user', {}).get('username') == user.username

        category_1 = GoalCategory.objects.filter(user=user)[0]
        category_2 = GoalCategory.objects.filter(user=user)[1]
        [
            Goal.objects.create(title=f'To do {i}', user=user, category=category_1, status=2, priority=3)
            for i in range(8)
        ]
        [
            Goal.objects.create(title=f'In progress {i}', user=user, category=category_2, status=3, priority=4)
            for i in range(5)
        ]
        response = client.get('/goals/goal/list?limit=10')
        results = response.data.get('results')

        assert len(results) == 10
        assert response.data.get('count') == 15

        response = client.get('/goals/goal/list?status__in=2')
        assert len(response.data) == 8

        response = client.get('/goals/goal/list?priority__in=4')
        assert len(response.data) == 5

        response = client.get(f'/goals/goal/list?category__in={category_1.id}')
        assert len(response.data) == 9

    def test_category_get_by_id(self, authenticated_user: dict):
        """Test user get goal by id"""
        client = authenticated_user.get('client')
        user = authenticated_user.get('user')
        goal = Goal.objects.filter(user=user).first()

        response = client.get(f'/goals/goal/{goal.id}')

        assert response.status_code == 200
        for field in self.expected_fields:
            assert field in response.data
        assert response.data.get('user', {}).get('username') == user.username

    def test_goal_create_update_delete(self, authenticated_user: dict):
        """
        Test user create a goal
        Test user update the goal
        Test user delete the goal
        """
        client = authenticated_user.get('client')
        user = authenticated_user.get('user')
        category = GoalCategory.objects.filter(user=user).first()

        response = client.post(
            '/goals/goal/create',
            {'title': 'New goal', 'category': category.id},
            content_type='application/json',
        )

        assert response.status_code == 201
        assert response.data.get('title') == 'New goal'
        assert response.data.get('category') == category.id

        goal_id = response.data.get('id')

        response = client.put(
            f'/goals/goal/{goal_id}',
            {'title': 'Goal title updated', 'category': category.id},
            content_type='application/json',
        )
        assert response.status_code == 200
        assert response.data.get('title') == 'Goal title updated'

        response = client.delete(f'/goals/goal/{goal_id}')
        assert response.status_code == 204

    def test_goal_change_with_role(self, authenticated_user: dict, users: list):
        """
        Test user try to change the goal of another user with 'writer' rights
        Test with 'reader' rights
        """
        client = authenticated_user.get('client')
        user = authenticated_user.get('user')

        board_user2 = Board.objects.filter(
            participants__user=users[0], participants__role=BoardParticipant.Role.owner
        ).first()
        BoardParticipant.objects.create(user=user, board=board_user2, role=BoardParticipant.Role.writer)
        goal_user2 = Goal.objects.filter(category__board=board_user2).first()

        response = client.patch(
            f'/goals/goal/{goal_user2.id}',
            {
                'user': user.username,
                'title': f'{user.username} changed {users[0].username} goal',
                'category': goal_user2.category.id,
            },
            content_type='application/json',
        )
        assert response.status_code == 200
        assert response.data.get('title') == f'{user.username} changed {users[0].username} goal'

        board_user3 = Board.objects.filter(
            participants__user=users[1], participants__role=BoardParticipant.Role.owner
        ).first()
        BoardParticipant.objects.create(user=user, board=board_user3, role=BoardParticipant.Role.reader)
        goal_user3 = Goal.objects.filter(category__board=board_user3).first()

        response = client.patch(
            f'/goals/goal/{goal_user3.id}',
            {'user': user.username, 'title': f'Do not have rights to change', 'category': goal_user3.category.id},
            content_type='application/json',
        )
        assert response.status_code == 403
        assert 'You do not have permission to perform this action' in response.data.get('detail')
