from django.conf import settings
from django.db import models
from django.db.models import Sum


class Activity(models.Model):
	DIFFICULTY_CHOICES = (
		("easy", "Easy"),
		("moderate", "Moderate"),
		("hard", "Hard"),
	)

	title = models.CharField(max_length=200)
	description = models.TextField(blank=True)
	location = models.CharField(max_length=255)
	duration = models.DurationField(null=True, blank=True)
	difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default="easy")
	price = models.DecimalField(max_digits=8, decimal_places=2)
	capacity = models.PositiveIntegerField(default=10)
	owner = models.ForeignKey(
		settings.AUTH_USER_MODEL, related_name="activities", on_delete=models.SET_NULL, null=True, blank=True
	)
	is_active = models.BooleanField(default=True)
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.title


class ActivitySchedule(models.Model):
	activity = models.ForeignKey(Activity, related_name="schedules", on_delete=models.CASCADE)
	start = models.DateTimeField()
	end = models.DateTimeField()
	price_override = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
	capacity = models.PositiveIntegerField(null=True, blank=True)
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["start"]

	def __str__(self):
		return f"{self.activity.title} @ {self.start.strftime('%Y-%m-%d %H:%M')}"

	@property
	def seats_total(self):
		return self.capacity if self.capacity is not None else self.activity.capacity

	def seats_booked(self):
		res = self.chalet_bookings.exclude(status="cancelled").aggregate(total=Sum("guests"))
		return res.get("total") or 0

	def seats_available(self):
		return max(0, self.seats_total - self.seats_booked())
