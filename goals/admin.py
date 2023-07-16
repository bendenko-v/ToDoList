from django.contrib import admin

from goals.models import Board, Goal, GoalCategory, GoalComment


class BoardAdmin(admin.ModelAdmin):
    list_display = ('title', 'created', 'updated')
    search_fields = ('title',)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'board', 'created', 'updated')
    search_fields = ('title',)


class GoalAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'category', 'created', 'updated')
    search_fields = ('title',)


class CommentAdmin(admin.ModelAdmin):
    list_display = ('text', 'user', 'goal', 'created', 'updated')
    search_fields = ('text',)


admin.site.register(Board, BoardAdmin)
admin.site.register(GoalCategory, CategoryAdmin)
admin.site.register(Goal, GoalAdmin)
admin.site.register(GoalComment, CommentAdmin)
