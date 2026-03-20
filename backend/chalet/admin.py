from django.contrib import admin
from .models import Location, Amenity, Chalet, ChaletImage


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'city', 'country')
    search_fields = ('name', 'city', 'country')
    list_filter = ('country',)


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


class ChaletImageInline(admin.TabularInline):
    model = ChaletImage
    extra = 1
    fields = ('image', 'caption', 'order')


@admin.register(Chalet)
class ChaletAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'company', 'owner', 'location', 'price_per_night', 'capacity', 'is_active', 'created')
    search_fields = ('title', 'owner__username', 'company__name')
    list_filter = ('is_active', 'location__country')
    filter_horizontal = ('amenities',)
    inlines = [ChaletImageInline]


@admin.register(ChaletImage)
class ChaletImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'chalet', 'caption', 'order', 'created')
    search_fields = ('chalet__title', 'caption')

