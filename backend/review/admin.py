from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'chalet', 'activity', 'rating', 'is_public', 'created')
    search_fields = ('user__username', 'comment', 'chalet__title', 'activity__title')
    list_filter = ('is_public', 'rating', 'created')
    readonly_fields = ('created', 'updated')
