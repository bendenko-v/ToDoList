from django.contrib import admin

from bot.models import TgUser


@admin.register(TgUser)
class TgUserAdmin(admin.ModelAdmin):
    list_display = ('tg_id', 'username', 'verification_code')
    search_fields = ('user', 'tg_id')
    readonly_fields = ('verification_code',)
