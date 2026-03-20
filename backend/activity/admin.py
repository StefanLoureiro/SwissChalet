from django.contrib import admin
from .models import Activity, ActivitySchedule


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'difficulty', 'price', 'capacity', 'is_active', 'created')
    search_fields = ('title', 'location')
    list_filter = ('difficulty', 'is_active')


@admin.register(ActivitySchedule)
class ActivityScheduleAdmin(admin.ModelAdmin):
    list_display = ('id', 'activity', 'start', 'end', 'seats_total', 'price_override')
    search_fields = ('activity__title',)
    list_filter = ('activity',)