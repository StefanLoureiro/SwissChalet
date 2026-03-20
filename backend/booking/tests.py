import pytest
from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone
from rest_framework.test import APIClient

from activity.models import Activity, ActivitySchedule
from chalet.models import Chalet, Location
from .models import ChaletBooking, ChaletActivityBooking

User = get_user_model()

TODAY = timezone.now().date()
TOMORROW = TODAY + timedelta(days=1)
DAY_AFTER = TODAY + timedelta(days=2)
NEXT_WEEK = TODAY + timedelta(days=7)


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def user(db):
    return User.objects.create_superuser(username="booker", password="pass1234")


@pytest.fixture
def other_user(db):
    return User.objects.create_user(username="other", password="pass1234")


@pytest.fixture
def chalet(db):
    location = Location.objects.create(city="Zermatt")
    return Chalet.objects.create(
        title="Alpine Retreat",
        location=location,
        price_per_night="100.00",
        capacity=4,
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
    start = timezone.make_aware(
        timezone.datetime.combine(TOMORROW, timezone.datetime.min.time())
    )
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
def api_client():
    return APIClient()


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


# ---------------------------------------------------------------------------
# Model: ChaletBooking
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestChaletBookingModel:
    def test_str(self, chalet_booking):
        s = str(chalet_booking)
        assert "Alpine Retreat" in s
        assert str(TOMORROW) in s

    def test_nights(self, chalet_booking):
        assert chalet_booking.nights() == (NEXT_WEEK - TOMORROW).days

    def test_total_price_auto_calculated(self, chalet_booking):
        expected = Decimal("100.00") * chalet_booking.nights()
        assert chalet_booking.total_price == expected

    def test_ordering_newest_first(self, db, user, chalet):
        b1 = ChaletBooking.objects.create(chalet=chalet, user=user, start_date=TOMORROW, end_date=DAY_AFTER, guests=1)
        b2 = ChaletBooking.objects.create(chalet=chalet, user=user, start_date=NEXT_WEEK, end_date=NEXT_WEEK + timedelta(days=1), guests=1)
        bookings = list(ChaletBooking.objects.all())
        assert bookings[0].pk == b2.pk

    def test_clean_end_date_before_start_raises(self, db, user, chalet):
        booking = ChaletBooking(chalet=chalet, user=user, start_date=DAY_AFTER, end_date=TOMORROW, guests=1)
        with pytest.raises(ValidationError, match="End date must be after start date"):
            booking.clean()

    def test_clean_end_date_equal_to_start_raises(self, db, user, chalet):
        booking = ChaletBooking(chalet=chalet, user=user, start_date=TOMORROW, end_date=TOMORROW, guests=1)
        with pytest.raises(ValidationError, match="End date must be after start date"):
            booking.clean()

    def test_clean_start_date_in_past_raises(self, db, user, chalet):
        booking = ChaletBooking(chalet=chalet, user=user, start_date=TODAY - timedelta(days=1), end_date=TOMORROW, guests=1)
        with pytest.raises(ValidationError, match="Start date cannot be in the past"):
            booking.clean()

    def test_clean_guests_exceed_capacity_raises(self, db, user, chalet):
        booking = ChaletBooking(chalet=chalet, user=user, start_date=TOMORROW, end_date=DAY_AFTER, guests=99)
        with pytest.raises(ValidationError, match="capacity"):
            booking.clean()

    def test_clean_overlap_raises(self, db, user, chalet, chalet_booking):
        overlapping = ChaletBooking(
            chalet=chalet,
            user=user,
            start_date=TOMORROW + timedelta(days=1),
            end_date=NEXT_WEEK + timedelta(days=1),
            guests=1,
        )
        with pytest.raises(ValidationError, match="already booked"):
            overlapping.clean()

    def test_clean_cancelled_booking_does_not_block_overlap(self, db, user, chalet):
        ChaletBooking.objects.create(
            chalet=chalet, user=user, start_date=TOMORROW, end_date=DAY_AFTER, guests=1, status="cancelled"
        )
        # Same dates — should not raise since the existing booking is cancelled
        ChaletBooking.objects.create(chalet=chalet, user=user, start_date=TOMORROW, end_date=DAY_AFTER, guests=1)

    def test_default_status_pending(self, db, user, chalet):
        b = ChaletBooking.objects.create(chalet=chalet, user=user, start_date=TOMORROW, end_date=DAY_AFTER, guests=1)
        assert b.status == "pending"


# ---------------------------------------------------------------------------
# Model: ChaletActivityBooking
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestChaletActivityBookingModel:
    def test_str(self, activity_booking):
        s = str(activity_booking)
        assert "Ski Tour" in s

    def test_total_price_auto_calculated(self, activity_booking):
        expected = Decimal("30.00") * activity_booking.guests
        assert activity_booking.total_price == expected

    def test_total_price_uses_price_override(self, db, chalet_booking, schedule):
        schedule.price_override = Decimal("50.00")
        schedule.save()
        ab = ChaletActivityBooking.objects.create(
            chalet_booking=chalet_booking, schedule=schedule, guests=1
        )
        assert ab.total_price == Decimal("50.00")

    def test_clean_schedule_outside_booking_dates_raises(self, db, user, chalet, activity):
        # Schedule starts after the chalet booking ends
        far_start = timezone.make_aware(
            timezone.datetime.combine(NEXT_WEEK + timedelta(days=5), timezone.datetime.min.time())
        )
        far_schedule = ActivitySchedule.objects.create(
            activity=activity,
            start=far_start,
            end=far_start + timedelta(hours=2),
        )
        booking = ChaletBooking.objects.create(
            chalet=chalet, user=user, start_date=TOMORROW, end_date=NEXT_WEEK, guests=1, status="confirmed"
        )
        ab = ChaletActivityBooking(chalet_booking=booking, schedule=far_schedule, guests=1)
        with pytest.raises(ValidationError, match="within the chalet booking dates"):
            ab.clean()

    def test_clean_exceeds_available_seats_raises(self, db, chalet_booking, schedule):
        # Fill all seats
        ChaletActivityBooking.objects.create(
            chalet_booking=chalet_booking, schedule=schedule, guests=10, status="confirmed"
        )
        ab = ChaletActivityBooking(chalet_booking=chalet_booking, schedule=schedule, guests=1)
        with pytest.raises(ValidationError, match="seats available"):
            ab.clean()

    def test_default_status_pending(self, db, chalet_booking, schedule):
        ab = ChaletActivityBooking.objects.create(
            chalet_booking=chalet_booking, schedule=schedule, guests=1
        )
        assert ab.status == "pending"


# ---------------------------------------------------------------------------
# API: ChaletBookingViewSet
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestChaletBookingAPI:
    BASE_URL = "/api/bookings/"

    # LIST ------------------------------------------------------------------

    def test_list(self, auth_client, chalet_booking):
        response = auth_client.get(self.BASE_URL)
        assert response.status_code == 200
        assert any(b["id"] == chalet_booking.id for b in response.data)

    def test_list_unauthenticated(self, api_client, chalet_booking):
        response = api_client.get(self.BASE_URL)
        assert response.status_code == 200

    # CREATE ----------------------------------------------------------------

    def test_create_booking(self, auth_client, user, chalet):
        data = {
            "chalet": chalet.pk,
            "user": user.pk,
            "start_date": str(TOMORROW),
            "end_date": str(NEXT_WEEK),
            "guests": 2,
        }
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 201
        assert response.data["chalet"] == chalet.pk
        assert response.data["nights"] == (NEXT_WEEK - TOMORROW).days

    def test_create_booking_total_price_auto_set(self, auth_client, user, chalet):
        data = {
            "chalet": chalet.pk,
            "user": user.pk,
            "start_date": str(TOMORROW),
            "end_date": str(NEXT_WEEK),
            "guests": 1,
        }
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 201
        expected = str(Decimal("100.00") * (NEXT_WEEK - TOMORROW).days)
        assert Decimal(response.data["total_price"]) == Decimal(expected)

    def test_create_booking_end_before_start_rejected(self, auth_client, user, chalet):
        data = {
            "chalet": chalet.pk,
            "user": user.pk,
            "start_date": str(NEXT_WEEK),
            "end_date": str(TOMORROW),
            "guests": 1,
        }
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 400

    def test_create_booking_overlap_rejected(self, auth_client, user, chalet, chalet_booking):
        data = {
            "chalet": chalet.pk,
            "user": user.pk,
            "start_date": str(TOMORROW),
            "end_date": str(NEXT_WEEK),
            "guests": 1,
        }
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 400

    # RETRIEVE --------------------------------------------------------------

    def test_retrieve(self, auth_client, chalet_booking):
        response = auth_client.get(f"{self.BASE_URL}{chalet_booking.id}/")
        assert response.status_code == 200
        assert response.data["id"] == chalet_booking.id
        assert "nights" in response.data
        assert "activity_bookings" in response.data

    # UPDATE ----------------------------------------------------------------

    def test_partial_update_status(self, auth_client, chalet_booking):
        response = auth_client.patch(f"{self.BASE_URL}{chalet_booking.id}/", {"status": "cancelled"})
        assert response.status_code == 200
        assert response.data["status"] == "cancelled"

    # DELETE ----------------------------------------------------------------

    def test_delete_booking(self, auth_client, chalet_booking):
        response = auth_client.delete(f"{self.BASE_URL}{chalet_booking.id}/")
        assert response.status_code == 204
        assert not ChaletBooking.objects.filter(pk=chalet_booking.id).exists()

    # FILTERING -------------------------------------------------------------

    def test_filter_by_status(self, auth_client, user, chalet):
        confirmed = ChaletBooking.objects.create(
            chalet=chalet, user=user, start_date=TOMORROW, end_date=DAY_AFTER, guests=1, status="confirmed"
        )
        pending = ChaletBooking.objects.create(
            chalet=chalet, user=user, start_date=NEXT_WEEK, end_date=NEXT_WEEK + timedelta(days=1), guests=1, status="pending"
        )
        response = auth_client.get(self.BASE_URL, {"status": "confirmed"})
        assert response.status_code == 200
        ids = [b["id"] for b in response.data]
        assert confirmed.id in ids
        assert pending.id not in ids

    def test_filter_by_chalet(self, auth_client, user, chalet, chalet_booking):
        location2 = Location.objects.create(city="Geneva")
        chalet2 = Chalet.objects.create(title="Valley Chalet", location=location2, price_per_night="80.00", capacity=2)
        b2 = ChaletBooking.objects.create(
            chalet=chalet2, user=user, start_date=TOMORROW, end_date=DAY_AFTER, guests=1
        )
        response = auth_client.get(self.BASE_URL, {"chalet": chalet.pk})
        assert response.status_code == 200
        ids = [b["id"] for b in response.data]
        assert chalet_booking.id in ids
        assert b2.id not in ids

    def test_filter_by_user(self, auth_client, user, other_user, chalet, chalet_booking):
        b2 = ChaletBooking.objects.create(
            chalet=chalet, user=other_user,
            start_date=NEXT_WEEK, end_date=NEXT_WEEK + timedelta(days=1), guests=1
        )
        response = auth_client.get(self.BASE_URL, {"user": user.pk})
        assert response.status_code == 200
        ids = [b["id"] for b in response.data]
        assert chalet_booking.id in ids
        assert b2.id not in ids

    # ORDERING --------------------------------------------------------------

    def test_ordering_by_start_date_asc(self, auth_client, user, chalet):
        ChaletBooking.objects.create(chalet=chalet, user=user, start_date=NEXT_WEEK, end_date=NEXT_WEEK + timedelta(days=1), guests=1)
        ChaletBooking.objects.create(chalet=chalet, user=user, start_date=TOMORROW, end_date=DAY_AFTER, guests=1)
        response = auth_client.get(self.BASE_URL, {"ordering": "start_date"})
        assert response.status_code == 200
        dates = [b["start_date"] for b in response.data]
        assert dates == sorted(dates)


# ---------------------------------------------------------------------------
# API: ChaletActivityBookingViewSet
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestChaletActivityBookingAPI:
    BASE_URL = "/api/activity-bookings/"

    # LIST ------------------------------------------------------------------

    def test_list(self, auth_client, activity_booking):
        response = auth_client.get(self.BASE_URL)
        assert response.status_code == 200
        assert any(ab["id"] == activity_booking.id for ab in response.data)

    # CREATE ----------------------------------------------------------------

    def test_create_activity_booking(self, auth_client, chalet_booking, schedule):
        data = {
            "chalet_booking": chalet_booking.pk,
            "schedule": schedule.pk,
            "guests": 2,
        }
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 201
        assert response.data["chalet_booking"] == chalet_booking.pk
        assert Decimal(response.data["total_price"]) == Decimal("30.00") * 2

    def test_create_rejects_schedule_outside_booking_dates(self, auth_client, chalet_booking, activity):
        far_start = timezone.make_aware(
            timezone.datetime.combine(NEXT_WEEK + timedelta(days=5), timezone.datetime.min.time())
        )
        far_schedule = ActivitySchedule.objects.create(
            activity=activity, start=far_start, end=far_start + timedelta(hours=2)
        )
        data = {"chalet_booking": chalet_booking.pk, "schedule": far_schedule.pk, "guests": 1}
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 400

    def test_create_rejects_when_no_seats_available(self, auth_client, chalet_booking, schedule):
        # Fill all seats first
        ChaletActivityBooking.objects.create(
            chalet_booking=chalet_booking, schedule=schedule, guests=10, status="confirmed"
        )
        data = {"chalet_booking": chalet_booking.pk, "schedule": schedule.pk, "guests": 1}
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 400

    # RETRIEVE --------------------------------------------------------------

    def test_retrieve(self, auth_client, activity_booking):
        response = auth_client.get(f"{self.BASE_URL}{activity_booking.id}/")
        assert response.status_code == 200
        assert response.data["id"] == activity_booking.id

    # UPDATE ----------------------------------------------------------------

    def test_partial_update_status(self, auth_client, activity_booking):
        response = auth_client.patch(f"{self.BASE_URL}{activity_booking.id}/", {"status": "cancelled"})
        assert response.status_code == 200
        assert response.data["status"] == "cancelled"

    # DELETE ----------------------------------------------------------------

    def test_delete_activity_booking(self, auth_client, activity_booking):
        response = auth_client.delete(f"{self.BASE_URL}{activity_booking.id}/")
        assert response.status_code == 204
        assert not ChaletActivityBooking.objects.filter(pk=activity_booking.id).exists()

    # FILTERING -------------------------------------------------------------

    def test_filter_by_chalet_booking(self, auth_client, activity_booking, chalet_booking):
        response = auth_client.get(self.BASE_URL, {"chalet_booking": chalet_booking.pk})
        assert response.status_code == 200
        assert all(ab["chalet_booking"] == chalet_booking.pk for ab in response.data)

    def test_filter_by_status(self, auth_client, activity_booking, chalet_booking, schedule):
        pending = ChaletActivityBooking.objects.create(
            chalet_booking=chalet_booking, schedule=schedule, guests=1, status="pending"
        )
        response = auth_client.get(self.BASE_URL, {"status": "confirmed"})
        ids = [ab["id"] for ab in response.data]
        assert activity_booking.id in ids
        assert pending.id not in ids

