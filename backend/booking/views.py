from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import viewsets, filters
from rest_framework.exceptions import ValidationError as DRFValidationError
from django_filters.rest_framework import DjangoFilterBackend

from .models import ChaletActivityBooking, ChaletBooking
from .serializers import ChaletActivityBookingSerializer, ChaletBookingSerializer


def _reraise_django_validation_error(exc):
    if hasattr(exc, "message_dict"):
        raise DRFValidationError(exc.message_dict)
    raise DRFValidationError(exc.messages)


class ChaletBookingViewSet(viewsets.ModelViewSet):
    queryset = ChaletBooking.objects.select_related("chalet", "user").prefetch_related("activity_bookings__schedule__activity")
    serializer_class = ChaletBookingSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["chalet", "user", "status"]
    ordering_fields = ["start_date", "created"]

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


class ChaletActivityBookingViewSet(viewsets.ModelViewSet):
    queryset = ChaletActivityBooking.objects.select_related("chalet_booking", "schedule__activity")
    serializer_class = ChaletActivityBookingSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["chalet_booking", "schedule", "status"]
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

