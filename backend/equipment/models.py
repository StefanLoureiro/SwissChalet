from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from booking.models import ChaletActivityBooking
from chalet.models import Chalet


class Equipment(models.Model):
	chalet = models.ForeignKey(Chalet, related_name="equipment", on_delete=models.CASCADE)
	name = models.CharField(max_length=200)
	description = models.TextField(blank=True)
	total_quantity = models.PositiveIntegerField(default=1)
	price_per_unit = models.DecimalField(max_digits=8, decimal_places=2, default=0)
	created = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.name

class EquipmentBooking(models.Model):
	activity_booking = models.ForeignKey(ChaletActivityBooking, related_name="equipment_bookings", on_delete=models.CASCADE)
	equipment = models.ForeignKey(Equipment, related_name="bookings", on_delete=models.PROTECT)
	quantity = models.PositiveIntegerField(default=1)
	total_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
	status = models.CharField(max_length=10, choices=(("pending","Pending"),("confirmed","Confirmed"),("cancelled","Cancelled")), default="pending")
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f"EquipmentBooking {self.id} - {self.equipment.name} x{self.quantity}"

	def clean(self):
		# schedule not past
		if self.activity_booking.schedule.end <= timezone.now():
			raise ValidationError("Cannot book equipment for a past schedule.")
		# availability check:
		schedule = self.activity_booking.schedule
		reserved = EquipmentBooking.objects.filter(
			equipment=self.equipment,
			activity_booking__schedule=schedule
		).exclude(status="cancelled").exclude(pk=self.pk).aggregate(total=models.Sum("quantity"))["total"] or 0
		available = self.equipment.total_quantity - reserved
		if self.quantity > available:
			raise ValidationError({"quantity": f"Only {available} units available for this schedule."})

	def save(self, *args, **kwargs):
		if self.total_price in (None, ""):
			self.total_price = Decimal(self.equipment.price_per_unit) * Decimal(self.quantity)
		self.full_clean()
		super().save(*args, **kwargs)
