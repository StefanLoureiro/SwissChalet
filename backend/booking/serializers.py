from rest_framework import serializers

from .models import ChaletActivityBooking, ChaletBooking


class ChaletActivityBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChaletActivityBooking
        fields = [
            "id",
            "chalet_booking",
            "schedule",
            "guests",
            "total_price",
            "status",
            "created",
            "updated",
        ]
        read_only_fields = ["total_price", "created", "updated"]


class ChaletBookingSerializer(serializers.ModelSerializer):
    activity_bookings = ChaletActivityBookingSerializer(many=True, read_only=True)
    nights = serializers.SerializerMethodField()

    class Meta:
        model = ChaletBooking
        fields = [
            "id",
            "chalet",
            "user",
            "start_date",
            "end_date",
            "guests",
            "total_price",
            "status",
            "nights",
            "activity_bookings",
            "created",
            "updated",
        ]
        read_only_fields = ["total_price", "created", "updated"]

    def get_nights(self, obj):
        return obj.nights()
