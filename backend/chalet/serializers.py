from rest_framework import serializers

from .models import Amenity, Chalet, ChaletImage, Location


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = "__all__"


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = "__all__"


class ChaletImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChaletImage
        fields = ["id", "image", "caption", "order"]


class ChaletSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(), source="location", write_only=True, required=False
    )
    amenities = AmenitySerializer(many=True, read_only=True)
    amenity_ids = serializers.PrimaryKeyRelatedField(
        queryset=Amenity.objects.all(), source="amenities", many=True, write_only=True, required=False
    )
    images = ChaletImageSerializer(many=True, read_only=True)

    class Meta:
        model = Chalet
        fields = [
            "id",
            "title",
            "description",
            "company",
            "owner",
            "location",
            "location_id",
            "amenities",
            "amenity_ids",
            "images",
            "price_per_night",
            "capacity",
            "bedrooms",
            "bathrooms",
            "is_active",
            "created",
            "updated",
        ]
        read_only_fields = ["created", "updated"]
