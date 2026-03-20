from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Amenity, Chalet, ChaletImage, Location
from .serializers import AmenitySerializer, ChaletImageSerializer, ChaletSerializer, LocationSerializer


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer


class ChaletViewSet(viewsets.ModelViewSet):
    queryset = Chalet.objects.filter(is_active=True).select_related("location", "company", "owner").prefetch_related("amenities", "images")
    serializer_class = ChaletSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["location__city", "location__country", "capacity", "bedrooms", "bathrooms"]
    search_fields = ["title", "description", "location__city"]
    ordering_fields = ["price_per_night", "capacity", "created"]


class ChaletImageViewSet(viewsets.ModelViewSet):
    queryset = ChaletImage.objects.all()
    serializer_class = ChaletImageSerializer

