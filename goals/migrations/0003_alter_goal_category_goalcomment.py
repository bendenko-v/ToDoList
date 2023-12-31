# Generated by Django 4.2.3 on 2023-07-07 08:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('goals', '0002_goal'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goal',
            name='category',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to='goals.goalcategory', verbose_name='Category'
            ),
        ),
        migrations.CreateModel(
            name='GoalComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(verbose_name='Created')),
                ('updated', models.DateTimeField(verbose_name='Updated')),
                ('text', models.TextField(verbose_name='Text')),
                (
                    'goal',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to='goals.goal', verbose_name='Goal'
                    ),
                ),
                (
                    'user',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL, verbose_name='Author'
                    ),
                ),
            ],
            options={
                'verbose_name': 'Comment',
                'verbose_name_plural': 'Comments',
            },
        ),
    ]
