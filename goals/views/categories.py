from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.pagination import LimitOffsetPagination

from goals.filters import CategoryFilter
from goals.models import Goal, GoalCategory
from goals.permissions import CategoryPermission
from goals.serializers import CategoryCreateSerializer, CategorySerializer


class CategoryListView(ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = LimitOffsetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = CategoryFilter
    ordering_fields = ['title', 'created']
    ordering = ['title']
    search_fields = ['title']

    def get_queryset(self):
        return (
            GoalCategory.objects.select_related('user')
            .filter(board__participants__user=self.request.user)
            .exclude(is_deleted=True)
        )


class CategoryCreateView(CreateAPIView):
    serializer_class = CategoryCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class CategoryDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [CategoryPermission]

    def get_queryset(self):
        return GoalCategory.objects.select_related('user').exclude(is_deleted=True)

    def perform_destroy(self, instance: GoalCategory):
        with transaction.atomic():
            instance.is_deleted = True
            instance.save()
            # Changes goals status in "deleted" category to "Archived"
            Goal.objects.filter(category=instance.id).update(status=Goal.Status.archived)
