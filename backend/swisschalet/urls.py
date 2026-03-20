"""
URL configuration for swisschalet project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from chalet import views as chalet_views
from activity import views as activity_views
from booking import views as booking_views
from company import views as company_views
from equipment import views as equipment_views
from review import views as review_views

router = DefaultRouter()
router.register(r"chalets", chalet_views.ChaletViewSet, basename="chalet")
router.register(r"locations", chalet_views.LocationViewSet, basename="location")
router.register(r"amenities", chalet_views.AmenityViewSet, basename="amenity")
router.register(r"chalet-images", chalet_views.ChaletImageViewSet, basename="chalet-image")
router.register(r"activities", activity_views.ActivityViewSet, basename="activity")
router.register(r"activity-schedules", activity_views.ActivityScheduleViewSet, basename="activity-schedule")
router.register(r"bookings", booking_views.ChaletBookingViewSet, basename="booking")
router.register(r"activity-bookings", booking_views.ChaletActivityBookingViewSet, basename="activity-booking")
router.register(r"companies", company_views.CompanyViewSet, basename="company")
router.register(r"equipment", equipment_views.EquipmentViewSet, basename="equipment")
router.register(r"equipment-bookings", equipment_views.EquipmentBookingViewSet, basename="equipment-booking")
router.register(r"reviews", review_views.ReviewViewSet, basename="review")

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include(router.urls)),
    path("api-auth/", include('rest_framework.urls'))
]
