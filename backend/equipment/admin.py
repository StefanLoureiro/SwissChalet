from django.contrib import admin
from .models import Equipment, EquipmentBooking


class EquipmentBookingInline(admin.TabularInline):
    model = EquipmentBooking
    extra = 0
    fields = ('activity_booking', 'quantity', 'total_price', 'status')
    readonly_fields = ('total_price',)


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'chalet', 'total_quantity', 'price_per_unit', 'created')
    search_fields = ('name', 'chalet__title')
    list_filter = ('chalet',)
    inlines = [EquipmentBookingInline]


@admin.register(EquipmentBooking)
class EquipmentBookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'equipment', 'activity_booking', 'quantity', 'total_price', 'status')
    search_fields = ('equipment__name', 'activity_booking__chalet_booking__user__username')
    list_filter = ('status',)
    readonly_fields = ('total_price',)
