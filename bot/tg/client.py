import requests

from bot.tg.dc import Chat, GetUpdatesResponse, Message, MessageFrom, SendMessageResponse, Update


class TgClient:
    def __init__(self, token):
        self.token = token

    def get_url(self, method: str):
        return f'https://api.telegram.org/bot{self.token}/{method}'

    def get_updates(self, offset: int = 0, timeout: int = 60) -> GetUpdatesResponse:
        url = self.get_url('getUpdates')
        response = requests.get(url, params={'timeout': timeout, 'offset': offset})

        if response.status_code == 200:
            data_dict = response.json()
            updates = []
            try:
                if data_dict['ok']:
                    for update in data_dict['result']:
                        updates.append(
                            Update(
                                update_id=update['update_id'],
                                message=Message(
                                    message_id=update['message']['message_id'],
                                    from_=MessageFrom(**update['message']['from']),
                                    chat=Chat(**update['message']['chat']),
                                    date=update['message']['date'],
                                    text=update['message']['text'],
                                ),
                            )
                        )
                    return GetUpdatesResponse(ok=data_dict['ok'], result=[*updates])
            except Exception as e:
                print(f'Deserialization error: {e}')
        else:
            print('Request failed:', response.status_code)

    def send_message(self, chat_id: int, text: str) -> SendMessageResponse:
        url = self.get_url('sendMessage')
        response = requests.get(url, params={'chat_id': chat_id, 'text': text})

        if response.status_code == 200:
            data_dict = response.json()
            try:
                if data_dict['ok']:
                    message = Message(
                        message_id=data_dict['result']['message_id'],
                        from_=MessageFrom(**data_dict['result']['from']),
                        chat=Chat(**data_dict['result']['chat']),
                        date=data_dict['result']['date'],
                        text=data_dict['result']['text'],
                    )
                    return SendMessageResponse(ok=data_dict['ok'], result=message)
            except Exception as e:
                print(f'Deserialization error: {e}')
        else:
            print('Error, message not delivered:', response.status_code)
