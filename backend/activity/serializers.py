from rest_framework import serializers

from .models import Activity, ActivitySchedule


class ActivityScheduleSerializer(serializers.ModelSerializer):
    seats_total = serializers.ReadOnlyField()
    seats_booked = serializers.SerializerMethodField()
    seats_available = serializers.SerializerMethodField()

    class Meta:
        model = ActivitySchedule
        fields = [
            "id",
            "activity",
            "start",
            "end",
            "price_override",
            "capacity",
            "seats_total",
            "seats_booked",
            "seats_available",
            "created",
            "updated",
        ]
        read_only_fields = ["created", "updated"]

    def get_seats_booked(self, obj):
        return obj.seats_booked()

    def get_seats_available(self, obj):
        return obj.seats_available()


class ActivitySerializer(serializers.ModelSerializer):
    schedules = ActivityScheduleSerializer(many=True, read_only=True)

    class Meta:
        model = Activity
        fields = [
            "id",
            "title",
            "description",
            "location",
            "duration",
            "difficulty",
            "price",
            "capacity",
            "owner",
            "is_active",
            "schedules",
            "created",
            "updated",
        ]
        read_only_fields = ["created", "updated"]
