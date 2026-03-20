from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class Location(models.Model):
	name = models.CharField(max_length=200, blank=True)
	address = models.CharField(max_length=255, blank=True)
	city = models.CharField(max_length=100)
	country = models.CharField(max_length=100, default="Switzerland")
	latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
	longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

	def __str__(self):
		parts = [self.name or "", self.city, self.country]
		return ", ".join([p for p in parts if p])


class Amenity(models.Model):
	name = models.CharField(max_length=100, unique=True)
	description = models.TextField(blank=True)

	def __str__(self):
		return self.name


class Chalet(models.Model):
	company = models.ForeignKey("company.Company", related_name="chalets", on_delete=models.SET_NULL, null=True, blank=True)
	title = models.CharField(max_length=200)
	description = models.TextField(blank=True)
	owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="chalets", on_delete=models.SET_NULL, null=True, blank=True)
	location = models.ForeignKey(Location, related_name="chalets", on_delete=models.SET_NULL, null=True, blank=True)
	amenities = models.ManyToManyField(Amenity, related_name="chalets", blank=True)
	price_per_night = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0)])
	capacity = models.PositiveIntegerField(default=2, validators=[MinValueValidator(1)])
	bedrooms = models.PositiveIntegerField(default=1)
	bathrooms = models.PositiveIntegerField(default=1)
	is_active = models.BooleanField(default=True)
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-created"]

	def __str__(self):
		return self.title



class ChaletImage(models.Model):
	chalet = models.ForeignKey(Chalet, related_name="images", on_delete=models.CASCADE)
	image = models.ImageField(upload_to="chalets/%Y/%m/%d/", null=True, blank=True)
	caption = models.CharField(max_length=200, blank=True)
	order = models.PositiveIntegerField(default=0)
	created = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ["order"]

	def __str__(self):
		return f"Image {self.id} for {self.chalet.title}"
