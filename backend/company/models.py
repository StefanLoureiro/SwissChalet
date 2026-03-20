from django.conf import settings
from django.db import models


class Company(models.Model):
	name = models.CharField(max_length=200)
	description = models.TextField(blank=True)
	owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="companies", on_delete=models.SET_NULL, null=True, blank=True)
	is_active = models.BooleanField(default=True)
	created = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-created"]

	def __str__(self):
		return self.name
