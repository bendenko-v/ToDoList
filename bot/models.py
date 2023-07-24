from django.db import models

from core.models import User


class TgUser(models.Model):
    class Meta:
        verbose_name = 'Telegram User'
        verbose_name_plural = 'Telegram Users'

    tg_id = models.BigIntegerField(verbose_name='Telegram Chat Id', unique=True)
    username = models.CharField(verbose_name='Telegram Username', unique=True)
    verification_code = models.CharField(verbose_name='Verification Code', max_length=16)
    user = models.ForeignKey(User, verbose_name='User', on_delete=models.PROTECT, null=True)

    @property
    def is_verified(self) -> bool:
        return bool(self.user)

    def __str__(self):
        return f'User chat id: {self.tg_id}'
