from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from chalet.models import Chalet
from activity.models import ActivitySchedule


class ChaletBooking(models.Model):
	STATUS_CHOICES = (
		("pending", "Pending"),
		("confirmed", "Confirmed"),
		("cancelled", "Cancelled"),
	)

	chalet = models.ForeignKey(Chalet, related_name="bookings", on_delete=models.CASCADE)
	user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="chalet_bookings", on_delete=models.CASCADE)
	start_date = models.DateField()
	end_date = models.DateField()
	guests = models.PositiveIntegerField(default=1)
	total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
	status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-created"]

	def __str__(self):
		return f"ChaletBooking {self.id} - {self.chalet.title} by {self.user} ({self.start_date} to {self.end_date})"

	def clean(self):
		# Basic date sanity
		if self.end_date <= self.start_date:
			raise ValidationError({"end_date": "End date must be after start date."})

		if self.start_date < timezone.now().date():
			raise ValidationError({"start_date": "Start date cannot be in the past."})

		# Guests fit in chalet capacity
		if self.guests > self.chalet.capacity:
			raise ValidationError({"guests": f"Chalet capacity is {self.chalet.capacity}."})

		# Check overlapping bookings (exclude cancelled)
		qs = ChaletBooking.objects.filter(chalet=self.chalet).exclude(status="cancelled")
		if self.pk:
			qs = qs.exclude(pk=self.pk)

		overlap = qs.filter(start_date__lt=self.end_date, end_date__gt=self.start_date).exists()
		if overlap:
			raise ValidationError("The chalet is already booked for the selected dates.")

	def nights(self):
		return (self.end_date - self.start_date).days

	def save(self, *args, **kwargs):
		# Auto-calc total_price if missing
		if self.total_price in (None, ""):
			try:
				nights = Decimal(self.nights())
				unit = Decimal(self.chalet.price_per_night)
				self.total_price = (nights * unit)
			except Exception:
				self.total_price = Decimal("0.00")

		self.full_clean()
		super().save(*args, **kwargs)


class ChaletActivityBooking(models.Model):
	STATUS_CHOICES = ChaletBooking.STATUS_CHOICES
	chalet_booking = models.ForeignKey(ChaletBooking, related_name="activity_bookings", on_delete=models.CASCADE)
	schedule = models.ForeignKey(ActivitySchedule, related_name="chalet_bookings", on_delete=models.PROTECT)
	guests = models.PositiveIntegerField(default=1)
	total_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
	status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-created"]

	def __str__(self):
		return f"ChaletActivityBooking {self.id} - {self.schedule.activity.title} for {self.chalet_booking}"

	def clean(self):
		# Schedule must fall within the chalet stay dates
		sch_date = self.schedule.start.date()
		cb = self.chalet_booking
		if sch_date < cb.start_date or sch_date >= cb.end_date:
			raise ValidationError({"schedule": "Activity schedule must fall within the chalet booking dates."})

		# Check seat availability on the schedule
		available = self.schedule.seats_available()
		if self.pk:
			try:
				orig = ChaletActivityBooking.objects.get(pk=self.pk)
				available += orig.guests
			except ChaletActivityBooking.DoesNotExist:
				pass

		if self.guests > available:
			raise ValidationError({"guests": f"Only {available} seats available for this activity schedule."})

	def save(self, *args, **kwargs):
		# Calculate total_price if missing
		if self.total_price in (None, ""):
			unit = self.schedule.price_override if self.schedule.price_override is not None else self.schedule.activity.price
			try:
				self.total_price = (Decimal(unit) * Decimal(self.guests))
			except Exception:
				self.total_price = Decimal("0.00")

		self.full_clean()
		super().save(*args, **kwargs)


