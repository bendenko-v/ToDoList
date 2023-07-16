from django.db import models

from core.models import User
from todolist.models import BaseModel


class Board(BaseModel):
    class Meta:
        verbose_name = 'Board'
        verbose_name_plural = 'Boards'

    title = models.CharField(verbose_name='Title', max_length=255)
    is_deleted = models.BooleanField(verbose_name='Deleted', default=False)

    def __str__(self):
        return self.title


class BoardParticipant(BaseModel):
    class Meta:
        unique_together = ('board', 'user')
        verbose_name = 'Participant'
        verbose_name_plural = 'Participants'

    class Role(models.IntegerChoices):
        owner = 1, 'Owner'
        writer = 2, 'Editor'
        reader = 3, 'Reader'

    user = models.ForeignKey(
        User,
        verbose_name='Participant',
        on_delete=models.PROTECT,
        related_name='participants',
    )
    board = models.ForeignKey(
        Board,
        verbose_name='Board',
        on_delete=models.PROTECT,
        related_name='participants',
    )
    role = models.PositiveSmallIntegerField(verbose_name='Role', choices=Role.choices, default=Role.owner)


class GoalCategory(BaseModel):
    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    title = models.CharField(verbose_name='Title', max_length=255)
    user = models.ForeignKey(User, verbose_name='Author', on_delete=models.PROTECT)
    is_deleted = models.BooleanField(verbose_name='Deleted', default=False)
    board = models.ForeignKey(
        Board,
        verbose_name='Board',
        on_delete=models.PROTECT,
        related_name='categories',  # null=True
    )


class Goal(BaseModel):
    class Meta:
        verbose_name = 'Goal'
        verbose_name_plural = 'Goals'

    class Status(models.IntegerChoices):
        to_do = 1, 'To do'
        in_progress = 2, 'In progress'
        done = 3, 'Done'
        archived = 4, 'Archived'

    class Priority(models.IntegerChoices):
        low = 1, 'Low'
        medium = 2, 'Medium'
        high = 3, 'High'
        critical = 4, 'Critical'

    title = models.CharField(verbose_name='Title', max_length=255, null=False)
    description = models.TextField(verbose_name='Description', null=True, blank=True)
    due_date = models.DateTimeField(verbose_name='Due Date', null=True, blank=True)
    user = models.ForeignKey(User, verbose_name='Author', on_delete=models.PROTECT)
    category = models.ForeignKey(GoalCategory, verbose_name='Category', on_delete=models.PROTECT)
    status = models.PositiveSmallIntegerField(verbose_name='Status', choices=Status.choices, default=Status.to_do)
    priority = models.PositiveSmallIntegerField(
        verbose_name='Priority', choices=Priority.choices, default=Priority.medium
    )


class GoalComment(BaseModel):
    class Meta:
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'

    text = models.TextField(verbose_name='Text', null=False)
    user = models.ForeignKey(User, verbose_name='Author', on_delete=models.PROTECT)
    goal = models.ForeignKey(Goal, verbose_name='Goal', on_delete=models.PROTECT)
