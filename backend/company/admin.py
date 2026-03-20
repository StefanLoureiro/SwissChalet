from django.contrib import admin
from .models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'owner', 'is_active', 'created')
    search_fields = ('name', 'owner__username')
    list_filter = ('is_active',)
