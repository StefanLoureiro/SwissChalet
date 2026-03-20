from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import Activity, ActivitySchedule
from .serializers import ActivitySerializer, ActivityScheduleSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.filter(is_active=True).prefetch_related("schedules")
    serializer_class = ActivitySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["difficulty", "capacity"]
    search_fields = ["title", "description", "location"]
    ordering_fields = ["price", "created"]


class ActivityScheduleViewSet(viewsets.ModelViewSet):
    queryset = ActivitySchedule.objects.select_related("activity").all()
    serializer_class = ActivityScheduleSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["activity"]
    ordering_fields = ["start"]

