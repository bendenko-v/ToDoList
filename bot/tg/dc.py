from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class Chat:
    id: int
    first_name: str
    username: str
    type: str


@dataclass
class MessageFrom:
    id: int
    is_bot: bool
    first_name: str
    username: str
    language_code: Optional[str] = field(default=None)


@dataclass
class Message:
    message_id: int
    chat: Chat
    date: int
    text: str
    from_: MessageFrom


@dataclass
class Update:
    update_id: int
    message: Message


@dataclass
class GetUpdatesResponse:
    ok: bool
    result: List[Update]


@dataclass
class SendMessageResponse:
    ok: bool
    result: Message
