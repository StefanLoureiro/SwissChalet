from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "user", "chalet", "activity", "rating", "comment", "is_public", "created", "updated"]
        read_only_fields = ["created", "updated"]

    def validate(self, attrs):
        instance = self.instance
        chalet = attrs.get("chalet", instance.chalet if instance else None)
        activity = attrs.get("activity", instance.activity if instance else None)
        if bool(chalet) == bool(activity):
            raise serializers.ValidationError("A review must target either a chalet or an activity, not both or neither.")
        return attrs
