from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Company
from .serializers import CompanySerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.filter(is_active=True).select_related("owner")
    serializer_class = CompanySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["is_active", "owner"]
    search_fields = ["name", "description"]
    ordering_fields = ["name", "created"]

