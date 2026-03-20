from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import viewsets, filters
from rest_framework.exceptions import ValidationError as DRFValidationError
from django_filters.rest_framework import DjangoFilterBackend

from .models import Equipment, EquipmentBooking
from .serializers import EquipmentSerializer, EquipmentBookingSerializer


def _reraise_django_validation_error(exc):
    if hasattr(exc, "message_dict"):
        raise DRFValidationError(exc.message_dict)
    raise DRFValidationError(exc.messages)


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.select_related("chalet")
    serializer_class = EquipmentSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["chalet"]
    search_fields = ["name", "description"]
    ordering_fields = ["name", "created"]


class EquipmentBookingViewSet(viewsets.ModelViewSet):
    queryset = EquipmentBooking.objects.select_related("equipment", "activity_booking")
    serializer_class = EquipmentBookingSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["activity_booking", "equipment", "status"]
    ordering_fields = ["created"]

    def perform_create(self, serializer):
        try:
            serializer.save()
        except DjangoValidationError as exc:
            _reraise_django_validation_error(exc)

    def perform_update(self, serializer):
        try:
            serializer.save()
        except DjangoValidationError as exc:
            _reraise_django_validation_error(exc)

