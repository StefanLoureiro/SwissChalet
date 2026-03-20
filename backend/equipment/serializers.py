from rest_framework import serializers

from .models import Equipment, EquipmentBooking


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ["id", "chalet", "name", "description", "total_quantity", "price_per_unit", "created"]
        read_only_fields = ["created"]


class EquipmentBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentBooking
        fields = ["id", "activity_booking", "equipment", "quantity", "total_price", "status", "created", "updated"]
        read_only_fields = ["total_price", "created", "updated"]
