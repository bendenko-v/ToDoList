from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.pagination import LimitOffsetPagination

from goals.filters import GoalDateFilter
from goals.models import BoardParticipant, Goal
from goals.permissions import GoalPermission
from goals.serializers import GoalCreateSerializer, GoalSerializer


class GoalListView(ListAPIView):
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = LimitOffsetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = GoalDateFilter
    ordering_fields = ['title', 'created', 'priority', 'due_date']
    search_fields = ['title']

    def get_queryset(self):
        return (
            Goal.objects.select_related('user')
            .filter(category__board__participants__user=self.request.user, category__is_deleted=False)
            .exclude(status=Goal.Status.archived)
        )


class GoalCreateView(CreateAPIView):
    serializer_class = GoalCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class GoalDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = GoalSerializer
    permission_classes = [GoalPermission]

    def get_queryset(self):
        return (
            Goal.objects.select_related('user')
            .filter(
                category__board__participants__user=self.request.user,
                category__is_deleted=False,
            )
            .exclude(status=Goal.Status.archived)
        )

    def perform_destroy(self, instance: Goal):
        instance.status = Goal.Status.archived
        instance.save()
