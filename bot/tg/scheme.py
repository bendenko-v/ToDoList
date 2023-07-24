from pydantic.main import BaseModel


class Chat(BaseModel):
    id: int
    username: str | None = None


class Message(BaseModel):
    message_id: int
    chat: Chat
    text: str


class Update(BaseModel):
    update_id: int
    message: Message


class GetUpdatesResponse(BaseModel):
    ok: bool
    result: list[Update] = []


class SendMessageResponse(BaseModel):
    ok: bool
    result: Message
