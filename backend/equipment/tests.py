import pytest
from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone
from rest_framework.test import APIClient

from activity.models import Activity, ActivitySchedule
from booking.models import ChaletBooking, ChaletActivityBooking
from chalet.models import Chalet, Location
from .models import Equipment, EquipmentBooking

User = get_user_model()

TODAY = timezone.now().date()
TOMORROW = TODAY + timedelta(days=1)
NEXT_WEEK = TODAY + timedelta(days=7)


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def user(db):
    return User.objects.create_superuser(username="equipuser", password="pass1234")


@pytest.fixture
def location(db):
    return Location.objects.create(city="Zermatt")


@pytest.fixture
def chalet(db, user, location):
    return Chalet.objects.create(
        title="Alpine Retreat",
        location=location,
        price_per_night="100.00",
        capacity=6,
        owner=user,
    )


@pytest.fixture
def equipment(db, chalet):
    return Equipment.objects.create(
        chalet=chalet,
        name="Ski Set",
        description="Full ski set.",
        total_quantity=5,
        price_per_unit="20.00",
    )


@pytest.fixture
def activity(db):
    return Activity.objects.create(
        title="Ski Tour",
        location="Alps",
        difficulty="easy",
        price="30.00",
        capacity=10,
    )


@pytest.fixture
def schedule(db, activity):
    # Future schedule so clean() won't raise "past schedule"
    start = timezone.now() + timedelta(days=1)
    return ActivitySchedule.objects.create(
        activity=activity,
        start=start,
        end=start + timedelta(hours=3),
    )


@pytest.fixture
def chalet_booking(db, user, chalet):
    return ChaletBooking.objects.create(
        chalet=chalet,
        user=user,
        start_date=TOMORROW,
        end_date=NEXT_WEEK,
        guests=2,
        status="confirmed",
    )


@pytest.fixture
def activity_booking(db, chalet_booking, schedule):
    return ChaletActivityBooking.objects.create(
        chalet_booking=chalet_booking,
        schedule=schedule,
        guests=2,
        status="confirmed",
    )


@pytest.fixture
def equipment_booking(db, activity_booking, equipment):
    return EquipmentBooking.objects.create(
        activity_booking=activity_booking,
        equipment=equipment,
        quantity=2,
        status="confirmed",
    )


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


# ---------------------------------------------------------------------------
# Model: Equipment
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestEquipmentModel:
    def test_str(self, equipment):
        assert str(equipment) == "Ski Set"

    def test_default_total_quantity(self, db, chalet):
        e = Equipment.objects.create(chalet=chalet, name="Helmet", price_per_unit="5.00")
        assert e.total_quantity == 1

    def test_default_price_per_unit(self, db, chalet):
        e = Equipment.objects.create(chalet=chalet, name="Goggles")
        assert e.price_per_unit == Decimal("0")

    def test_description_optional(self, db, chalet):
        e = Equipment.objects.create(chalet=chalet, name="Poles")
        assert e.description == ""

    def test_cascade_delete_with_chalet(self, db, chalet, equipment):
        equipment_pk = equipment.pk
        chalet.delete()
        assert not Equipment.objects.filter(pk=equipment_pk).exists()


# ---------------------------------------------------------------------------
# Model: EquipmentBooking
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestEquipmentBookingModel:
    def test_str(self, equipment_booking):
        assert str(equipment_booking) == f"EquipmentBooking {equipment_booking.id} - Ski Set x2"

    def test_total_price_auto_calculated(self, equipment_booking):
        assert equipment_booking.total_price == Decimal("20.00") * 2

    def test_default_status_pending(self, db, activity_booking, equipment):
        eb = EquipmentBooking.objects.create(
            activity_booking=activity_booking, equipment=equipment, quantity=1
        )
        assert eb.status == "pending"

    def test_clean_past_schedule_raises(self, db, activity, chalet_booking, equipment):
        past_start = timezone.now() - timedelta(hours=5)
        past_schedule = ActivitySchedule.objects.create(
            activity=activity,
            start=past_start,
            end=past_start + timedelta(hours=2),
        )
        # Use bulk_create to bypass ChaletActivityBooking.save() / full_clean()
        ab = ChaletActivityBooking.objects.bulk_create([
            ChaletActivityBooking(
                chalet_booking=chalet_booking,
                schedule=past_schedule,
                guests=1,
                status="confirmed",
            )
        ])[0]
        eb = EquipmentBooking(activity_booking=ab, equipment=equipment, quantity=1)
        with pytest.raises(ValidationError, match="past schedule"):
            eb.clean()

    def test_clean_exceeds_available_quantity_raises(self, db, activity_booking, equipment):
        # Use all 5 units
        EquipmentBooking.objects.create(
            activity_booking=activity_booking, equipment=equipment, quantity=5, status="confirmed"
        )
        eb = EquipmentBooking(activity_booking=activity_booking, equipment=equipment, quantity=1)
        with pytest.raises(ValidationError, match="units available"):
            eb.clean()

    def test_clean_cancelled_bookings_excluded_from_availability(self, db, activity_booking, equipment):
        # Cancel 5 units — should still leave all 5 available
        EquipmentBooking.objects.create(
            activity_booking=activity_booking, equipment=equipment, quantity=5, status="cancelled"
        )
        eb = EquipmentBooking(activity_booking=activity_booking, equipment=equipment, quantity=5)
        eb.clean()  # should not raise

    def test_save_raises_for_past_schedule(self, db, activity, chalet_booking, equipment):
        past_start = timezone.now() - timedelta(hours=5)
        past_schedule = ActivitySchedule.objects.create(
            activity=activity, start=past_start, end=past_start + timedelta(hours=2)
        )
        # Use bulk_create to bypass ChaletActivityBooking.save() / full_clean()
        ab = ChaletActivityBooking.objects.bulk_create([
            ChaletActivityBooking(
                chalet_booking=chalet_booking,
                schedule=past_schedule,
                guests=1,
                status="confirmed",
            )
        ])[0]
        eb = EquipmentBooking(activity_booking=ab, equipment=equipment, quantity=1)
        with pytest.raises(ValidationError):
            eb.save()


# ---------------------------------------------------------------------------
# API: EquipmentViewSet
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestEquipmentAPI:
    BASE_URL = "/api/equipment/"

    def test_list(self, auth_client, equipment):
        response = auth_client.get(self.BASE_URL)
        assert response.status_code == 200
        assert any(e["id"] == equipment.id for e in response.data)

    def test_list_unauthenticated(self, api_client, equipment):
        response = api_client.get(self.BASE_URL)
        assert response.status_code == 200

    def test_create(self, auth_client, chalet):
        data = {"chalet": chalet.pk, "name": "Snowboard", "total_quantity": 3, "price_per_unit": "25.00"}
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 201
        assert response.data["name"] == "Snowboard"

    def test_retrieve(self, auth_client, equipment):
        response = auth_client.get(f"{self.BASE_URL}{equipment.id}/")
        assert response.status_code == 200
        assert response.data["name"] == "Ski Set"
        assert response.data["total_quantity"] == 5

    def test_partial_update(self, auth_client, equipment):
        response = auth_client.patch(f"{self.BASE_URL}{equipment.id}/", {"total_quantity": 10})
        assert response.status_code == 200
        assert response.data["total_quantity"] == 10

    def test_delete(self, auth_client, equipment):
        response = auth_client.delete(f"{self.BASE_URL}{equipment.id}/")
        assert response.status_code == 204
        assert not Equipment.objects.filter(pk=equipment.id).exists()

    def test_filter_by_chalet(self, auth_client, equipment, chalet, location):
        chalet2 = Chalet.objects.create(title="Other Chalet", location=location, price_per_night="80.00", capacity=2)
        other_eq = Equipment.objects.create(chalet=chalet2, name="Boots", total_quantity=2, price_per_unit="10.00")
        response = auth_client.get(self.BASE_URL, {"chalet": chalet.pk})
        assert response.status_code == 200
        ids = [e["id"] for e in response.data]
        assert equipment.id in ids
        assert other_eq.id not in ids

    def test_search_by_name(self, auth_client, equipment):
        response = auth_client.get(self.BASE_URL, {"search": "Ski"})
        assert response.status_code == 200
        assert any(e["id"] == equipment.id for e in response.data)

    def test_search_by_description(self, auth_client, equipment):
        response = auth_client.get(self.BASE_URL, {"search": "Full ski"})
        assert response.status_code == 200
        assert any(e["id"] == equipment.id for e in response.data)

    def test_ordering_by_name_asc(self, auth_client, chalet):
        Equipment.objects.create(chalet=chalet, name="Zebra Gear", price_per_unit="5.00")
        Equipment.objects.create(chalet=chalet, name="Alpha Gear", price_per_unit="5.00")
        response = auth_client.get(self.BASE_URL, {"ordering": "name"})
        assert response.status_code == 200
        names = [e["name"] for e in response.data]
        assert names == sorted(names)


# ---------------------------------------------------------------------------
# API: EquipmentBookingViewSet
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestEquipmentBookingAPI:
    BASE_URL = "/api/equipment-bookings/"

    def test_list(self, auth_client, equipment_booking):
        response = auth_client.get(self.BASE_URL)
        assert response.status_code == 200
        assert any(eb["id"] == equipment_booking.id for eb in response.data)

    def test_create(self, auth_client, activity_booking, equipment):
        data = {"activity_booking": activity_booking.pk, "equipment": equipment.pk, "quantity": 1}
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 201
        assert Decimal(response.data["total_price"]) == Decimal("20.00") * 1

    def test_create_rejects_exceeding_quantity(self, auth_client, activity_booking, equipment):
        # Fill all 5 units first
        EquipmentBooking.objects.create(
            activity_booking=activity_booking, equipment=equipment, quantity=5, status="confirmed"
        )
        data = {"activity_booking": activity_booking.pk, "equipment": equipment.pk, "quantity": 1}
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 400

    def test_retrieve(self, auth_client, equipment_booking):
        response = auth_client.get(f"{self.BASE_URL}{equipment_booking.id}/")
        assert response.status_code == 200
        assert response.data["quantity"] == 2

    def test_partial_update_status(self, auth_client, equipment_booking):
        response = auth_client.patch(f"{self.BASE_URL}{equipment_booking.id}/", {"status": "cancelled"})
        assert response.status_code == 200
        assert response.data["status"] == "cancelled"

    def test_delete(self, auth_client, equipment_booking):
        response = auth_client.delete(f"{self.BASE_URL}{equipment_booking.id}/")
        assert response.status_code == 204
        assert not EquipmentBooking.objects.filter(pk=equipment_booking.id).exists()

    def test_filter_by_status(self, auth_client, equipment_booking, activity_booking, equipment):
        pending = EquipmentBooking.objects.create(
            activity_booking=activity_booking, equipment=equipment, quantity=1, status="pending"
        )
        response = auth_client.get(self.BASE_URL, {"status": "confirmed"})
        assert response.status_code == 200
        ids = [eb["id"] for eb in response.data]
        assert equipment_booking.id in ids
        assert pending.id not in ids

    def test_filter_by_activity_booking(self, auth_client, equipment_booking, activity_booking):
        response = auth_client.get(self.BASE_URL, {"activity_booking": activity_booking.pk})
        assert response.status_code == 200
        assert all(eb["activity_booking"] == activity_booking.pk for eb in response.data)

    def test_filter_by_equipment(self, auth_client, equipment_booking, equipment):
        response = auth_client.get(self.BASE_URL, {"equipment": equipment.pk})
        assert response.status_code == 200
        assert all(eb["equipment"] == equipment.pk for eb in response.data)

