from rest_framework import serializers

from .models import ChaletActivityBooking, ChaletBooking


class ChaletActivityBookingSerializer(serializers.ModelSerializer):
    activity_title = serializers.CharField(source="schedule.activity.title", read_only=True)
    schedule_start = serializers.DateTimeField(source="schedule.start", read_only=True)

    class Meta:
        model = ChaletActivityBooking
        fields = [
            "id",
            "chalet_booking",
            "schedule",
            "activity_title",
            "schedule_start",
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
    chalet_title = serializers.CharField(source='chalet.title', read_only=True)

    class Meta:
        model = ChaletBooking
        fields = [
            "id",
            "chalet",
            "chalet_title",
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
