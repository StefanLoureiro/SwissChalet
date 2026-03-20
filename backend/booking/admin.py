from django.contrib import admin
from .models import ChaletBooking, ChaletActivityBooking


@admin.register(ChaletBooking)
class ChaletBookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'chalet', 'user', 'start_date', 'end_date', 'guests', 'total_price', 'status', 'created')
    search_fields = ('user__username', 'chalet__title')
    list_filter = ('status', 'start_date')


@admin.register(ChaletActivityBooking)
class ChaletActivityBookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'chalet_booking', 'schedule', 'guests', 'total_price', 'status', 'created')
    search_fields = ('chalet_booking__user__username', 'schedule__activity__title')
    list_filter = ('status',)