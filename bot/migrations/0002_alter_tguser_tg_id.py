# Generated by Django 4.2.3 on 2023-07-24 10:12

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('bot', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tguser',
            name='tg_id',
            field=models.BigIntegerField(unique=True, verbose_name='Telegram Chat Id'),
        ),
    ]
