import secrets

from django.core.management.base import BaseCommand, CommandError

from bot.models import TgUser
from bot.tg.client import TgClient
from bot.tg.dc import Message
from goals.models import Goal
from goals.serializers import GoalSerializer
from todolist.settings import TG_TOKEN

client = TgClient(TG_TOKEN)


def get_user_goals(user_id: int) -> str:
    """
    Get user goals from the db, filter it by main fields and return it to Telegram Chat

    Args:
        user_id:
    Returns:
        string with goals data
    """
    priority = dict(Goal.Priority.choices)
    status = dict(Goal.Status.choices)

    goals = (
        Goal.objects.select_related('user')
        .filter(category__board__participants__user_id=user_id, category__is_deleted=False)
        .exclude(status=Goal.Status.archived)
        .all()
    )

    serializer = GoalSerializer(goals, many=True)

    data = []
    for item in serializer.data:
        filtered_dict = {
            key: value for key, value in item.items() if key in ['title', 'due_date', 'priority', 'status']
        }
        data.append(filtered_dict)

    result = []
    for index, item in enumerate(data, start=1):
        goal = (
            f"{index}) {item['title']}, "
            f"status: {status[item['status']]}, "
            f"priority: {priority[item['priority']]}, "
            f"{'due_date: ' + item['due_date'][:10] if item['due_date'] else ''}"
        )
        result.append(goal)

    goals_data = '\n'.join(result)
    return goals_data


class Command(BaseCommand):
    help = 'Running telegram bot'
    commands = {
        '/goals': get_user_goals,
    }

    def add_arguments(self, parser):
        parser.add_argument('runbot', nargs='?', default='runbot')

    def handle(self, *args, **options):
        if options['runbot']:
            offset = 0
            is_user_verified = False
            try:
                while True:
                    res = client.get_updates(offset=offset)

                    for item in res.result:
                        offset = item.update_id + 1
                        message = item.message
                        chat_id = item.message.chat.id
                        if not is_user_verified:
                            if self.verify_user(message, chat_id):
                                is_user_verified = True
                            continue
                        self.handle_command(message, chat_id)

            except Exception as e:
                raise CommandError(f'An error occurred: {e}')

    def verify_user(self, message: Message, chat_id: int) -> bool:
        tg_user = TgUser.objects.filter(tg_id=chat_id)

        if tg_user and tg_user.filter(user_id__isnull=False).exists():  # user verified
            client.send_message(chat_id=chat_id, text=f'Hi, {message.chat.username}!')
            return True

        token = secrets.token_urlsafe()[:16]

        if tg_user.filter(user_id__isnull=True).exists():  # user created, but not verified
            TgUser.objects.update(verification_code=token)
        else:
            TgUser.objects.create(tg_id=chat_id, username=message.chat.username, verification_code=token)

        message = f'Hello!\nIt seems you need to link your account.\n' f"Here's the verification code: {token}"
        client.send_message(chat_id=chat_id, text=message)
        return False

    def handle_command(self, message: Message, chat_id: int):
        if message.text in self.commands:
            user_id = TgUser.objects.filter(tg_id=chat_id).first().user_id
            response = self.commands[message.text](user_id)
            return client.send_message(chat_id=chat_id, text=response)
        else:
            return client.send_message(chat_id=chat_id, text='Command not found!')
