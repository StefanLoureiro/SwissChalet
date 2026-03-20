from datetime import timedelta

import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient

from .models import Activity, ActivitySchedule

User = get_user_model()


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def user(db):
    return User.objects.create_superuser(username="testuser", password="pass1234")


@pytest.fixture
def activity(db, user):
    return Activity.objects.create(
        title="Ski Tour",
        description="A guided ski tour.",
        location="Alps",
        difficulty="moderate",
        price="50.00",
        capacity=10,
        owner=user,
        is_active=True,
    )


@pytest.fixture
def inactive_activity(db):
    return Activity.objects.create(
        title="Hidden Activity",
        location="Nowhere",
        difficulty="easy",
        price="0.00",
        is_active=False,
    )


@pytest.fixture
def schedule(db, activity):
    now = timezone.now()
    return ActivitySchedule.objects.create(
        activity=activity,
        start=now + timedelta(days=1),
        end=now + timedelta(days=1, hours=3),
    )


@pytest.fixture
def schedule_with_capacity(db, activity):
    now = timezone.now()
    return ActivitySchedule.objects.create(
        activity=activity,
        start=now + timedelta(days=2),
        end=now + timedelta(days=2, hours=2),
        capacity=4,
    )


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


# ---------------------------------------------------------------------------
# Model: Activity
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestActivityModel:
    def test_str(self, activity):
        assert str(activity) == "Ski Tour"

    def test_default_is_active(self, db):
        a = Activity.objects.create(title="X", location="Y", difficulty="easy", price="10.00")
        assert a.is_active is True

    def test_default_difficulty(self, db):
        a = Activity.objects.create(title="X", location="Y", price="10.00")
        assert a.difficulty == "easy"

    def test_default_capacity(self, db):
        a = Activity.objects.create(title="X", location="Y", price="10.00")
        assert a.capacity == 10


# ---------------------------------------------------------------------------
# Model: ActivitySchedule
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestActivityScheduleModel:
    def test_str(self, schedule):
        expected = f"Ski Tour @ {schedule.start.strftime('%Y-%m-%d %H:%M')}"
        assert str(schedule) == expected

    def test_ordering_by_start(self, db, activity):
        now = timezone.now()
        s2 = ActivitySchedule.objects.create(
            activity=activity,
            start=now + timedelta(days=5),
            end=now + timedelta(days=5, hours=1),
        )
        s1 = ActivitySchedule.objects.create(
            activity=activity,
            start=now + timedelta(days=3),
            end=now + timedelta(days=3, hours=1),
        )
        schedules = list(ActivitySchedule.objects.filter(activity=activity))
        assert schedules[0].pk == s1.pk
        assert schedules[1].pk == s2.pk

    # seats_total -----------------------------------------------------------

    def test_seats_total_uses_schedule_capacity_when_set(self, schedule_with_capacity):
        assert schedule_with_capacity.seats_total == 4

    def test_seats_total_falls_back_to_activity_capacity(self, schedule):
        # schedule has no capacity override → falls back to activity.capacity (10)
        assert schedule.seats_total == 10

    # seats_booked ----------------------------------------------------------

    def test_seats_booked_zero_when_no_bookings(self, schedule):
        assert schedule.seats_booked() == 0

    def test_seats_booked_counts_non_cancelled(self, db, schedule, user):
        from chalet.models import Chalet, Location
        from booking.models import ChaletBooking, ChaletActivityBooking

        location = Location.objects.create(city="Alps")
        chalet = Chalet.objects.create(
            title="Test Chalet",
            location=location,
            price_per_night="100.00",
            capacity=5,
            owner=user,
        )
        start = schedule.start.date()
        cb = ChaletBooking.objects.create(
            chalet=chalet,
            user=user,
            start_date=start - timedelta(days=1),
            end_date=start + timedelta(days=2),
            guests=2,
            status="confirmed",
        )
        ChaletActivityBooking.objects.create(
            chalet_booking=cb,
            schedule=schedule,
            guests=3,
            status="confirmed",
        )
        assert schedule.seats_booked() == 3

    def test_seats_booked_excludes_cancelled(self, db, schedule, user):
        from chalet.models import Chalet, Location
        from booking.models import ChaletBooking, ChaletActivityBooking

        location = Location.objects.create(city="Alps")
        chalet = Chalet.objects.create(
            title="Test Chalet",
            location=location,
            price_per_night="100.00",
            capacity=5,
            owner=user,
        )
        start = schedule.start.date()
        cb = ChaletBooking.objects.create(
            chalet=chalet,
            user=user,
            start_date=start - timedelta(days=1),
            end_date=start + timedelta(days=2),
            guests=2,
            status="confirmed",
        )
        ChaletActivityBooking.objects.create(
            chalet_booking=cb,
            schedule=schedule,
            guests=5,
            status="cancelled",
        )
        assert schedule.seats_booked() == 0

    # seats_available -------------------------------------------------------

    def test_seats_available_equals_total_when_no_bookings(self, schedule):
        assert schedule.seats_available() == 10

    def test_seats_available_never_negative(self, schedule_with_capacity, db, user):
        from chalet.models import Chalet, Location
        from booking.models import ChaletBooking, ChaletActivityBooking

        location = Location.objects.create(city="Alps")
        chalet = Chalet.objects.create(
            title="Test Chalet",
            location=location,
            price_per_night="100.00",
            capacity=5,
            owner=user,
        )
        start = schedule_with_capacity.start.date()
        cb = ChaletBooking.objects.create(
            chalet=chalet,
            user=user,
            start_date=start - timedelta(days=1),
            end_date=start + timedelta(days=2),
            guests=2,
            status="confirmed",
        )
        # Book all 4 seats
        ChaletActivityBooking.objects.create(
            chalet_booking=cb,
            schedule=schedule_with_capacity,
            guests=4,
            status="confirmed",
        )
        assert schedule_with_capacity.seats_available() == 0


# ---------------------------------------------------------------------------
# Serializers
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestActivityScheduleSerializer:
    def test_contains_expected_fields(self, schedule):
        from .serializers import ActivityScheduleSerializer

        data = ActivityScheduleSerializer(schedule).data
        for field in ("id", "activity", "start", "end", "price_override",
                      "capacity", "seats_total", "seats_booked", "seats_available",
                      "created", "updated"):
            assert field in data

    def test_seats_values_correct(self, schedule):
        from .serializers import ActivityScheduleSerializer

        data = ActivityScheduleSerializer(schedule).data
        assert data["seats_total"] == 10
        assert data["seats_booked"] == 0
        assert data["seats_available"] == 10


@pytest.mark.django_db
class TestActivitySerializer:
    def test_schedules_nested(self, activity, schedule):
        from .serializers import ActivitySerializer

        data = ActivitySerializer(activity).data
        assert "schedules" in data
        assert len(data["schedules"]) == 1
        assert data["schedules"][0]["id"] == schedule.pk

    def test_contains_expected_fields(self, activity):
        from .serializers import ActivitySerializer

        data = ActivitySerializer(activity).data
        for field in ("id", "title", "description", "location", "duration",
                      "difficulty", "price", "capacity", "owner", "is_active",
                      "schedules", "created", "updated"):
            assert field in data


# ---------------------------------------------------------------------------
# API: ActivityViewSet
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestActivityViewSet:
    BASE = "/api/activities/"

    def test_list_returns_active_only(self, auth_client, activity, inactive_activity):
        response = auth_client.get(self.BASE)
        assert response.status_code == 200
        ids = [item["id"] for item in response.data]
        assert activity.pk in ids
        assert inactive_activity.pk not in ids

    def test_retrieve(self, auth_client, activity):
        response = auth_client.get(f"{self.BASE}{activity.pk}/")
        assert response.status_code == 200
        assert response.data["title"] == "Ski Tour"

    def test_create(self, auth_client):
        payload = {
            "title": "Snowshoe Walk",
            "location": "Jura",
            "difficulty": "easy",
            "price": "25.00",
            "capacity": 8,
        }
        response = auth_client.post(self.BASE, payload, format="json")
        assert response.status_code == 201
        assert response.data["title"] == "Snowshoe Walk"

    def test_update(self, auth_client, activity):
        response = auth_client.patch(
            f"{self.BASE}{activity.pk}/",
            {"price": "75.00"},
            format="json",
        )
        assert response.status_code == 200
        assert response.data["price"] == "75.00"

    def test_delete(self, auth_client, activity):
        response = auth_client.delete(f"{self.BASE}{activity.pk}/")
        assert response.status_code == 204

    # Filtering & search ----------------------------------------------------

    def test_filter_by_difficulty(self, auth_client, db, activity):
        Activity.objects.create(
            title="Ice Climbing",
            location="Alps",
            difficulty="hard",
            price="120.00",
        )
        response = auth_client.get(self.BASE, {"difficulty": "moderate"})
        assert response.status_code == 200
        assert all(item["difficulty"] == "moderate" for item in response.data)

    def test_search_by_title(self, auth_client, activity):
        response = auth_client.get(self.BASE, {"search": "Ski"})
        assert response.status_code == 200
        assert len(response.data) >= 1
        assert any("Ski" in item["title"] for item in response.data)

    def test_ordering_by_price(self, auth_client, db, activity):
        Activity.objects.create(
            title="Cheap Walk",
            location="Valley",
            difficulty="easy",
            price="10.00",
        )
        response = auth_client.get(self.BASE, {"ordering": "price"})
        assert response.status_code == 200
        prices = [float(item["price"]) for item in response.data]
        assert prices == sorted(prices)


# ---------------------------------------------------------------------------
# API: ActivityScheduleViewSet
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestActivityScheduleViewSet:
    BASE = "/api/activity-schedules/"

    def test_list(self, auth_client, schedule):
        response = auth_client.get(self.BASE)
        assert response.status_code == 200
        assert any(item["id"] == schedule.pk for item in response.data)

    def test_retrieve(self, auth_client, schedule):
        response = auth_client.get(f"{self.BASE}{schedule.pk}/")
        assert response.status_code == 200
        assert response.data["activity"] == schedule.activity.pk

    def test_create(self, auth_client, activity):
        now = timezone.now()
        payload = {
            "activity": activity.pk,
            "start": (now + timedelta(days=10)).isoformat(),
            "end": (now + timedelta(days=10, hours=2)).isoformat(),
        }
        response = auth_client.post(self.BASE, payload, format="json")
        assert response.status_code == 201
        assert response.data["activity"] == activity.pk

    def test_filter_by_activity(self, auth_client, activity, schedule, db):
        other = Activity.objects.create(
            title="Other",
            location="Somewhere",
            difficulty="easy",
            price="5.00",
        )
        now = timezone.now()
        ActivitySchedule.objects.create(
            activity=other,
            start=now + timedelta(days=20),
            end=now + timedelta(days=20, hours=1),
        )
        response = auth_client.get(self.BASE, {"activity": activity.pk})
        assert response.status_code == 200
        assert all(item["activity"] == activity.pk for item in response.data)

    def test_ordering_by_start(self, auth_client, activity, schedule, schedule_with_capacity):
        response = auth_client.get(self.BASE, {"ordering": "start"})
        assert response.status_code == 200
        starts = [item["start"] for item in response.data]
        assert starts == sorted(starts)

    def test_delete(self, auth_client, schedule):
        response = auth_client.delete(f"{self.BASE}{schedule.pk}/")
        assert response.status_code == 204
        assert not ActivitySchedule.objects.filter(pk=schedule.pk).exists()
