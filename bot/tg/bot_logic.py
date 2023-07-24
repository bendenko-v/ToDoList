from collections import namedtuple

from django.db import IntegrityError

from goals.models import BoardParticipant, Goal, GoalCategory
from goals.serializers import CategorySerializer, GoalSerializer

GoalData = namedtuple('GoalData', ['title', 'due_date', 'priority', 'status'])
CategoryData = namedtuple('CategoryData', ['cat_id', 'title'])


def get_user_goals(user_id: int) -> str:
    """
    Get user goals, filter it by main fields and return it to User Chat

    Args:
        user_id (int): User ID
    Returns:
        str: A message with goals to be sent back to the user.
    """
    priority = dict(Goal.Priority.choices)
    status = dict(Goal.Status.choices)

    goals = (
        Goal.objects.select_related('user')
        .filter(category__board__participants__user_id=user_id, category__is_deleted=False)
        .exclude(status=Goal.Status.archived)
        .all()
    )

    if not goals.exists():
        return "You don't have any goals."

    serializer = GoalSerializer(goals, many=True)

    data = []
    for item in serializer.data:
        filtered_dict = GoalData(
            title=item['title'],
            due_date=item['due_date'][:10] if item['due_date'] else '',
            priority=priority[item['priority']],
            status=status[item['status']],
        )
        data.append(filtered_dict)

    message = []
    for index, item in enumerate(data, start=1):
        goal = (
            f'{index}) {item.title}, status: {item.status}, priority: {item.priority}, '
            f"{'due_date: ' + item.due_date if item.due_date else ''}"
        )
        message.append(goal)

    response = '\n'.join(message)
    return response


def show_categories(user_id: int, chat_id: int, users_data: dict[int, dict[str | int, ...]]) -> str:
    """
    Get categories where the user is owner or writer,
    filter them by 'title' and return them to the user chat.

    After the user selects a category by index, prompt the user to enter goal details.

    Args:
        'user_id' (int): User ID
        'chat_id' (int): Telegram Chat ID
    Returns:
        str: A message with categories to be sent back to the user.
    """

    categories = (
        GoalCategory.objects.select_related('user')
        .filter(
            board__participants__user_id=user_id,
            board__participants__role__in=[BoardParticipant.Role.owner, BoardParticipant.Role.writer],
        )
        .exclude(is_deleted=True)
    )

    if not categories.exists():
        return "You don't have any categories to create a goal. Please create a category first."

    serializer = CategorySerializer(categories, many=True)

    data = []
    for item in serializer.data:
        category = CategoryData(cat_id=item['id'], title=item['title'])
        data.append(category)

    # Save 'index' to choose a user and link the category id to its index
    users_data[chat_id] = {index: item.cat_id for index, item in enumerate(data, start=1)}
    users_data[chat_id]['next_handler'] = choose_category

    message = [f'{index}) {item.title}' for index, item in enumerate(data, start=1)]

    response = '\n'.join(message)
    return 'Choose category for goal:\n' + response


def choose_category(**kwargs) -> str:
    """
    Handle the user's choice of category by index.

    Args:
        **kwargs: A dictionary containing keyword arguments:
            - chat_id (int): The Telegram chat ID.
            - message (str): The user's message.
            - users_data (Dict[int, Dict[str, Any]]): A dictionary containing user-specific data.

    Returns:
        str: A message to be sent back to the user.
    """
    chat_id: int = kwargs.get('chat_id')
    message: str = kwargs.get('message')
    users_data: dict[int, dict[str | int, ...]] = kwargs.get('users_data')
    if message.isdigit():
        value = int(message)
        category_id = users_data.get(chat_id, {}).get(value)
        if category_id is not None:
            users_data[chat_id]['next_handler'] = create_goal
            users_data[chat_id]['category_id'] = category_id
            return f'You chose category {value}. Please, send the title for the goal.'
        else:
            return f'Invalid category index. Please choose a valid category.'
    else:
        return f'You sent not valid category index.'


def create_goal(**kwargs) -> str:
    """
    Create a new goal based on the user's input.

    Args:
        **kwargs: A dictionary containing keyword arguments:
            - user_id (int): The ID of the user creating the goal.
            - chat_id (int): The Telegram chat ID.
            - message (str): The user's message containing the title of the goal.
            - users_data (Dict[int, Dict[str, Any]]): A dictionary containing user-specific data.

    Returns:
        str: A message to be sent back to the user.
    """
    user_id: int = kwargs.get('user_id')
    chat_id: int = kwargs.get('chat_id')
    message: str = kwargs.get('message')
    users_data: dict[int, dict[str | int, ...]] = kwargs.get('users_data')
    try:
        category_id = users_data.get(chat_id, {}).get('category_id')
        Goal.objects.create(title=message, user_id=user_id, category_id=category_id)
        users_data.pop(chat_id, None)  # Clean user cache
        return f'Goal "{message}" added!'
    except IntegrityError:
        return 'Something went wrong. Goal not created.'
    except Exception as e:
        return f'Error: {str(e)}'
