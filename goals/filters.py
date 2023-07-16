from django_filters import rest_framework

from goals.models import Goal, GoalCategory, GoalComment


class GoalDateFilter(rest_framework.FilterSet):
    class Meta:
        model = Goal
        fields = {
            'due_date': ['lte', 'gte'],
            'status': ['in'],
            'category': ['in'],
            'priority': ['in'],
        }


class CategoryFilter(rest_framework.FilterSet):
    class Meta:
        model = GoalCategory
        fields = ['board']


class CommentFilter(rest_framework.FilterSet):
    class Meta:
        model = GoalComment
        fields = ['goal']
