from rest_framework import permissions
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request

from goals.models import Board, BoardParticipant, Goal, GoalCategory, GoalComment


class BoardPermission(permissions.BasePermission):
    def has_object_permission(self, request: Request, view: GenericAPIView, obj: Board) -> bool:
        if not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return BoardParticipant.objects.filter(user=request.user, board=obj).exists()
        return BoardParticipant.objects.filter(user=request.user, board=obj, role=BoardParticipant.Role.owner).exists()


class CategoryPermission(permissions.BasePermission):
    def has_object_permission(self, request: Request, view: GenericAPIView, obj: GoalCategory) -> bool:
        if not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return BoardParticipant.objects.filter(user=request.user, board=obj.board).exists()
        return BoardParticipant.objects.filter(
            user=request.user, board=obj.board, role__in=[BoardParticipant.Role.owner, BoardParticipant.Role.writer]
        ).exists()


class GoalPermission(permissions.BasePermission):
    def has_object_permission(self, request: Request, view: GenericAPIView, obj: Goal) -> bool:
        if not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return BoardParticipant.objects.filter(user=request.user, board__categories=obj.category).exists()
        return BoardParticipant.objects.filter(
            user=request.user,
            board__categories=obj.category,
            role__in=[BoardParticipant.Role.owner, BoardParticipant.Role.writer],
        ).exists()


class CommentPermission(permissions.BasePermission):
    def has_object_permission(self, request: Request, view: GenericAPIView, obj: GoalComment) -> bool:
        if not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return BoardParticipant.objects.filter(user=request.user, board__categories__goals=obj.goal).exists()
        else:
            return request.user == obj.user
