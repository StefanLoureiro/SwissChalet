from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Review(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="reviews", on_delete=models.CASCADE)
	chalet = models.ForeignKey("chalet.Chalet", related_name="reviews", on_delete=models.CASCADE, null=True, blank=True)
	activity = models.ForeignKey("activity.Activity", related_name="reviews", on_delete=models.CASCADE, null=True, blank=True)
	rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
	comment = models.TextField(blank=True)
	is_public = models.BooleanField(default=True)
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-created"]

	def __str__(self):
		target = self.chalet or self.activity
		target_name = getattr(target, "title", str(target)) if target else "Unknown"
		return f"Review {self.id} by {self.user} on {target_name} ({self.rating})"

	def clean(self):
		# Ensure review targets exactly one of chalet or activity
		if bool(self.chalet) == bool(self.activity):
			raise ValidationError("A review must be for either a chalet or an activity, not both or neither.")

		# Rating bounds are already enforced by validators, but double-check
		if self.rating < 1 or self.rating > 5:
			raise ValidationError({"rating": "Rating must be an integer between 1 and 5."})

	def save(self, *args, **kwargs):
		self.full_clean()
		super().save(*args, **kwargs)

