from django_filters import rest_framework

from goals.models import Goal


class GoalDateFilter(rest_framework.FilterSet):
    class Meta:
        model = Goal
        fields = {
            'due_date': ['lte', 'gte'],
            'status': ['in'],
            'category': ['in'],
            'priority': ['in'],
        }
