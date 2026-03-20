import pytest
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework.test import APIClient

from activity.models import Activity
from chalet.models import Chalet, Location
from .models import Review
from .serializers import ReviewSerializer

User = get_user_model()


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def user(db):
    return User.objects.create_superuser(username="reviewer", password="pass1234")


@pytest.fixture
def other_user(db):
    return User.objects.create_user(username="other", password="pass1234")


@pytest.fixture
def chalet(db):
    location = Location.objects.create(city="Zermatt")
    return Chalet.objects.create(
        title="Mountain Chalet",
        location=location,
        price_per_night="200.00",
        capacity=4,
    )


@pytest.fixture
def activity(db):
    return Activity.objects.create(
        title="Ski Tour",
        location="Alps",
        difficulty="moderate",
        price="50.00",
        capacity=10,
    )


@pytest.fixture
def chalet_review(db, user, chalet):
    return Review.objects.create(
        user=user,
        chalet=chalet,
        rating=4,
        comment="Great place!",
        is_public=True,
    )


@pytest.fixture
def activity_review(db, user, activity):
    return Review.objects.create(
        user=user,
        activity=activity,
        rating=5,
        comment="Amazing tour!",
        is_public=True,
    )


@pytest.fixture
def private_review(db, user, chalet):
    return Review.objects.create(
        user=user,
        chalet=chalet,
        rating=3,
        is_public=False,
    )


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


# ---------------------------------------------------------------------------
# Model: Review
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestReviewModel:
    def test_str_with_chalet(self, chalet_review, chalet):
        expected = f"Review {chalet_review.id} by {chalet_review.user} on Mountain Chalet (4)"
        assert str(chalet_review) == expected

    def test_str_with_activity(self, activity_review, activity):
        expected = f"Review {activity_review.id} by {activity_review.user} on Ski Tour (5)"
        assert str(activity_review) == expected

    def test_str_no_target(self, db, user):
        review = Review(user=user, rating=3)
        assert "Unknown" in str(review)

    def test_default_is_public(self, db, user, chalet):
        review = Review.objects.create(user=user, chalet=chalet, rating=3)
        assert review.is_public is True

    def test_ordering_newest_first(self, db, user, chalet, activity):
        r1 = Review.objects.create(user=user, chalet=chalet, rating=3)
        r2 = Review.objects.create(user=user, activity=activity, rating=4)
        reviews = list(Review.objects.all())
        assert reviews[0].pk == r2.pk
        assert reviews[1].pk == r1.pk

    def test_clean_raises_when_both_chalet_and_activity(self, db, user, chalet, activity):
        review = Review(user=user, chalet=chalet, activity=activity, rating=3)
        with pytest.raises(ValidationError):
            review.clean()

    def test_clean_raises_when_neither_chalet_nor_activity(self, db, user):
        review = Review(user=user, rating=3)
        with pytest.raises(ValidationError):
            review.clean()

    def test_clean_passes_with_chalet_only(self, db, user, chalet):
        review = Review(user=user, chalet=chalet, rating=3)
        review.clean()  # should not raise

    def test_clean_passes_with_activity_only(self, db, user, activity):
        review = Review(user=user, activity=activity, rating=3)
        review.clean()  # should not raise

    def test_save_calls_full_clean(self, db, user, chalet, activity):
        review = Review(user=user, chalet=chalet, activity=activity, rating=3)
        with pytest.raises(ValidationError):
            review.save()

    def test_rating_below_minimum_raises(self, db, user, chalet):
        review = Review(user=user, chalet=chalet, rating=0)
        with pytest.raises(ValidationError):
            review.full_clean()

    def test_rating_above_maximum_raises(self, db, user, chalet):
        review = Review(user=user, chalet=chalet, rating=6)
        with pytest.raises(ValidationError):
            review.full_clean()

    def test_rating_boundary_values(self, db, user, chalet, activity):
        Review.objects.create(user=user, chalet=chalet, rating=1)
        r2 = Review(user=user, activity=activity, rating=5)
        r2.full_clean()  # should not raise


# ---------------------------------------------------------------------------
# Serializer: ReviewSerializer
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestReviewSerializer:
    def test_valid_with_chalet(self, user, chalet):
        data = {"user": user.pk, "chalet": chalet.pk, "rating": 4}
        serializer = ReviewSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

    def test_valid_with_activity(self, user, activity):
        data = {"user": user.pk, "activity": activity.pk, "rating": 5}
        serializer = ReviewSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

    def test_invalid_both_chalet_and_activity(self, user, chalet, activity):
        data = {"user": user.pk, "chalet": chalet.pk, "activity": activity.pk, "rating": 3}
        serializer = ReviewSerializer(data=data)
        assert not serializer.is_valid()
        assert "non_field_errors" in serializer.errors

    def test_invalid_neither_chalet_nor_activity(self, user):
        data = {"user": user.pk, "rating": 3}
        serializer = ReviewSerializer(data=data)
        assert not serializer.is_valid()
        assert "non_field_errors" in serializer.errors

    def test_read_only_fields_ignored_on_input(self, user, chalet):
        data = {"user": user.pk, "chalet": chalet.pk, "rating": 4, "created": "2000-01-01T00:00:00Z"}
        serializer = ReviewSerializer(data=data)
        assert serializer.is_valid(), serializer.errors
        review = serializer.save()
        assert review.created.year != 2000

    def test_comment_optional(self, user, chalet):
        data = {"user": user.pk, "chalet": chalet.pk, "rating": 4}
        serializer = ReviewSerializer(data=data)
        assert serializer.is_valid(), serializer.errors


# ---------------------------------------------------------------------------
# API: ReviewViewSet
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestReviewAPI:
    BASE_URL = "/api/reviews/"

    # LIST ------------------------------------------------------------------

    def test_list_returns_only_public_reviews(self, auth_client, chalet_review, private_review):
        response = auth_client.get(self.BASE_URL)
        assert response.status_code == 200
        ids = [r["id"] for r in response.data]
        assert chalet_review.id in ids
        assert private_review.id not in ids

    def test_list_unauthenticated(self, api_client, chalet_review):
        response = api_client.get(self.BASE_URL)
        assert response.status_code == 200

    # CREATE ----------------------------------------------------------------

    def test_create_review_for_chalet(self, auth_client, user, chalet):
        data = {"user": user.pk, "chalet": chalet.pk, "rating": 5, "comment": "Loved it"}
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 201
        assert response.data["rating"] == 5
        assert response.data["chalet"] == chalet.pk

    def test_create_review_for_activity(self, auth_client, user, activity):
        data = {"user": user.pk, "activity": activity.pk, "rating": 3}
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 201
        assert response.data["activity"] == activity.pk

    def test_create_review_both_targets_rejected(self, auth_client, user, chalet, activity):
        data = {"user": user.pk, "chalet": chalet.pk, "activity": activity.pk, "rating": 3}
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 400

    def test_create_review_no_target_rejected(self, auth_client, user):
        data = {"user": user.pk, "rating": 3}
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 400

    # RETRIEVE --------------------------------------------------------------

    def test_retrieve_public_review(self, auth_client, chalet_review):
        response = auth_client.get(f"{self.BASE_URL}{chalet_review.id}/")
        assert response.status_code == 200
        assert response.data["id"] == chalet_review.id

    # UPDATE ----------------------------------------------------------------

    def test_update_review_rating(self, auth_client, chalet_review):
        data = {"user": chalet_review.user.pk, "chalet": chalet_review.chalet.pk, "rating": 2}
        response = auth_client.put(f"{self.BASE_URL}{chalet_review.id}/", data)
        assert response.status_code == 200
        assert response.data["rating"] == 2

    def test_partial_update_comment(self, auth_client, chalet_review):
        response = auth_client.patch(f"{self.BASE_URL}{chalet_review.id}/", {"comment": "Updated!"})
        assert response.status_code == 200
        assert response.data["comment"] == "Updated!"

    # DELETE ----------------------------------------------------------------

    def test_delete_review(self, auth_client, chalet_review):
        response = auth_client.delete(f"{self.BASE_URL}{chalet_review.id}/")
        assert response.status_code == 204
        assert not Review.objects.filter(pk=chalet_review.id).exists()

    # FILTERING -------------------------------------------------------------

    def test_filter_by_chalet(self, auth_client, chalet_review, activity_review):
        response = auth_client.get(self.BASE_URL, {"chalet": chalet_review.chalet.pk})
        assert response.status_code == 200
        ids = [r["id"] for r in response.data]
        assert chalet_review.id in ids
        assert activity_review.id not in ids

    def test_filter_by_activity(self, auth_client, chalet_review, activity_review):
        response = auth_client.get(self.BASE_URL, {"activity": activity_review.activity.pk})
        assert response.status_code == 200
        ids = [r["id"] for r in response.data]
        assert activity_review.id in ids
        assert chalet_review.id not in ids

    def test_filter_by_rating(self, auth_client, chalet_review, activity_review):
        response = auth_client.get(self.BASE_URL, {"rating": 5})
        assert response.status_code == 200
        ids = [r["id"] for r in response.data]
        assert activity_review.id in ids
        assert chalet_review.id not in ids

    def test_filter_by_user(self, auth_client, user, other_user, chalet, activity, chalet_review):
        other_review = Review.objects.create(user=other_user, activity=activity, rating=2, is_public=True)
        response = auth_client.get(self.BASE_URL, {"user": user.pk})
        assert response.status_code == 200
        ids = [r["id"] for r in response.data]
        assert chalet_review.id in ids
        assert other_review.id not in ids

    # ORDERING --------------------------------------------------------------

    def test_ordering_by_rating_asc(self, auth_client, chalet_review, activity_review):
        response = auth_client.get(self.BASE_URL, {"ordering": "rating"})
        assert response.status_code == 200
        ratings = [r["rating"] for r in response.data]
        assert ratings == sorted(ratings)

    def test_ordering_by_rating_desc(self, auth_client, chalet_review, activity_review):
        response = auth_client.get(self.BASE_URL, {"ordering": "-rating"})
        assert response.status_code == 200
        ratings = [r["rating"] for r in response.data]
        assert ratings == sorted(ratings, reverse=True)
