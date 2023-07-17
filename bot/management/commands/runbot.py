from django.core.management.base import BaseCommand, CommandError

from bot.tg.client import TgClient
from todolist.settings import TG_TOKEN

client = TgClient(TG_TOKEN)


class Command(BaseCommand):
    help = 'Running telegram echo-bot'

    def add_arguments(self, parser):
        parser.add_argument('runbot', nargs='?', default='runbot')

    def handle(self, *args, **options):
        if options['runbot']:
            offset = 0
            try:
                while True:
                    res = client.get_updates(offset=offset)
                    print(f'Got message: {res.result[0].message}')
                    for item in res.result:
                        offset = item.update_id + 1
                        chat_id = item.message.chat.id
                        client.send_message(chat_id=chat_id, text=item.message.text)
                        print(f'Sent message: {item.message.text} to chat: {chat_id}')
            except Exception as e:
                raise CommandError(f'An error occurred: {e}')
