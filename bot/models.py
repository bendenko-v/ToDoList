from django.db import models

from core.models import User


class TgUser(models.Model):
    class Meta:
        verbose_name = 'Telegram User'
        verbose_name_plural = 'Telegram Users'

    chat_id = models.IntegerField(verbose_name='Telegram Chat Id', unique=True)
    telegram_user_id = models.IntegerField(verbose_name='Telegram User Id', unique=True)
    user_id = models.ForeignKey(User, verbose_name='User', on_delete=models.PROTECT, null=True)

    def __str__(self):
        return f'Telegram User: {self.telegram_user_id}'
