import logging
from typing import Type, TypeVar

import requests
from pydantic.error_wrappers import ValidationError
from pydantic.main import BaseModel

from bot.tg.scheme import GetUpdatesResponse, SendMessageResponse

T = TypeVar('T', bound=BaseModel)

logger = logging.getLogger(__name__)


class TgClient:
    def __init__(self, token: str):
        self.__token = token
        self.__url = f'https://api.telegram.org/bot{self.__token}/'

    def __get_url(self, method: str):
        return f'{self.__url}{method}'

    def get_updates(self, offset: int = 0, timeout: int = 10) -> GetUpdatesResponse:
        url = self.__get_url('getUpdates')
        response = requests.get(url, params={'timeout': timeout, 'offset': offset, 'allowed_updates': ['message']})

        if response.ok:
            data = response.json()
            return self.__deserialize_response(GetUpdatesResponse, data)
        else:
            logger.error(f'Bad request getUpdates, ', response.status_code)

    def send_message(self, chat_id: int, text: str, timeout: int = 10) -> SendMessageResponse:
        url = self.__get_url('sendMessage')
        response = requests.get(url, params={'timeout': timeout, 'chat_id': chat_id, 'text': text})

        if response.ok:
            data = response.json()
            return self.__deserialize_response(SendMessageResponse, data)
        else:
            logger.warning(f'Bad request sendMessage, ', response.status_code)

    @staticmethod
    def __deserialize_response(serializer_class: Type[T], data: dict) -> T:
        try:
            return serializer_class(**data)
        except ValidationError:
            logger.error(f'Failed to deserialize JSON response: {data}')
