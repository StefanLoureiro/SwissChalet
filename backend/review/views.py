from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import viewsets, filters
from rest_framework.exceptions import ValidationError as DRFValidationError
from django_filters.rest_framework import DjangoFilterBackend

from .models import Review
from .serializers import ReviewSerializer


def _reraise_django_validation_error(exc):
    if hasattr(exc, "message_dict"):
        raise DRFValidationError(exc.message_dict)
    raise DRFValidationError(exc.messages)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(is_public=True).select_related("user", "chalet", "activity")
    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["chalet", "activity", "user", "rating"]
    ordering_fields = ["rating", "created"]

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

