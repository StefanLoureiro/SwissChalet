import pytest
from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from .models import Amenity, Chalet, ChaletImage, Location

User = get_user_model()


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def user(db):
    return User.objects.create_superuser(username="chaletowner", password="pass1234")


@pytest.fixture
def location(db):
    return Location.objects.create(name="Alpine Base", city="Zermatt", country="Switzerland")


@pytest.fixture
def amenity(db):
    return Amenity.objects.create(name="Hot Tub", description="Outdoor hot tub")


@pytest.fixture
def chalet(db, user, location):
    return Chalet.objects.create(
        title="Snowy Peak",
        description="A beautiful chalet.",
        owner=user,
        location=location,
        price_per_night="150.00",
        capacity=6,
        bedrooms=3,
        bathrooms=2,
    )


@pytest.fixture
def inactive_chalet(db, location):
    return Chalet.objects.create(
        title="Hidden Chalet",
        location=location,
        price_per_night="80.00",
        capacity=2,
        is_active=False,
    )


@pytest.fixture
def chalet_image(db, chalet):
    return ChaletImage.objects.create(chalet=chalet, caption="Front view", order=1)


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


# ---------------------------------------------------------------------------
# Model: Location
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestLocationModel:
    def test_str_with_name(self, location):
        assert str(location) == "Alpine Base, Zermatt, Switzerland"

    def test_str_without_name(self, db):
        loc = Location.objects.create(city="Geneva", country="Switzerland")
        assert str(loc) == "Geneva, Switzerland"

    def test_str_city_only(self, db):
        loc = Location.objects.create(city="Bern", country="")
        assert str(loc) == "Bern"

    def test_default_country(self, db):
        loc = Location.objects.create(city="Lucerne")
        assert loc.country == "Switzerland"

    def test_optional_coordinates(self, db):
        loc = Location.objects.create(city="Davos")
        assert loc.latitude is None
        assert loc.longitude is None


# ---------------------------------------------------------------------------
# Model: Amenity
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestAmenityModel:
    def test_str(self, amenity):
        assert str(amenity) == "Hot Tub"

    def test_name_unique(self, db, amenity):
        from django.db import IntegrityError
        with pytest.raises(IntegrityError):
            Amenity.objects.create(name="Hot Tub")


# ---------------------------------------------------------------------------
# Model: Chalet
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestChaletModel:
    def test_str(self, chalet):
        assert str(chalet) == "Snowy Peak"

    def test_default_is_active(self, db, location):
        c = Chalet.objects.create(title="Test", location=location, price_per_night="50.00")
        assert c.is_active is True

    def test_default_capacity(self, db, location):
        c = Chalet.objects.create(title="Test", location=location, price_per_night="50.00")
        assert c.capacity == 2

    def test_default_bedrooms_bathrooms(self, db, location):
        c = Chalet.objects.create(title="Test", location=location, price_per_night="50.00")
        assert c.bedrooms == 1
        assert c.bathrooms == 1

    def test_ordering_newest_first(self, db, location):
        c1 = Chalet.objects.create(title="First", location=location, price_per_night="50.00")
        c2 = Chalet.objects.create(title="Second", location=location, price_per_night="60.00")
        chalets = list(Chalet.objects.all())
        assert chalets[0].pk == c2.pk

    def test_amenities_many_to_many(self, db, chalet, amenity):
        chalet.amenities.add(amenity)
        assert amenity in chalet.amenities.all()

    def test_owner_nullable(self, db, location):
        c = Chalet.objects.create(title="No Owner", location=location, price_per_night="50.00")
        assert c.owner is None


# ---------------------------------------------------------------------------
# Model: ChaletImage
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestChaletImageModel:
    def test_str(self, chalet_image):
        assert str(chalet_image) == f"Image {chalet_image.id} for Snowy Peak"

    def test_ordering_by_order(self, db, chalet):
        img2 = ChaletImage.objects.create(chalet=chalet, caption="Back view", order=2)
        img1 = ChaletImage.objects.create(chalet=chalet, caption="Side view", order=0)
        images = list(ChaletImage.objects.filter(chalet=chalet))
        assert images[0].pk == img1.pk

    def test_default_order(self, db, chalet):
        img = ChaletImage.objects.create(chalet=chalet)
        assert img.order == 0

    def test_cascade_delete_with_chalet(self, db, chalet, chalet_image):
        chalet_pk = chalet.pk
        image_pk = chalet_image.pk
        chalet.delete()
        assert not ChaletImage.objects.filter(pk=image_pk).exists()


# ---------------------------------------------------------------------------
# API: LocationViewSet
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestLocationAPI:
    BASE_URL = "/api/locations/"

    def test_list(self, auth_client, location):
        response = auth_client.get(self.BASE_URL)
        assert response.status_code == 200
        assert any(loc["city"] == "Zermatt" for loc in response.data)

    def test_create(self, auth_client):
        data = {"city": "Basel", "country": "Switzerland"}
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 201
        assert response.data["city"] == "Basel"

    def test_retrieve(self, auth_client, location):
        response = auth_client.get(f"{self.BASE_URL}{location.pk}/")
        assert response.status_code == 200
        assert response.data["city"] == "Zermatt"

    def test_update(self, auth_client, location):
        response = auth_client.patch(f"{self.BASE_URL}{location.pk}/", {"city": "Lausanne"})
        assert response.status_code == 200
        assert response.data["city"] == "Lausanne"

    def test_delete(self, auth_client, location):
        response = auth_client.delete(f"{self.BASE_URL}{location.pk}/")
        assert response.status_code == 204
        assert not Location.objects.filter(pk=location.pk).exists()


# ---------------------------------------------------------------------------
# API: AmenityViewSet
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestAmenityAPI:
    BASE_URL = "/api/amenities/"

    def test_list(self, auth_client, amenity):
        response = auth_client.get(self.BASE_URL)
        assert response.status_code == 200
        assert any(a["name"] == "Hot Tub" for a in response.data)

    def test_create(self, auth_client):
        data = {"name": "Fireplace", "description": "Indoor fireplace"}
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 201
        assert response.data["name"] == "Fireplace"

    def test_retrieve(self, auth_client, amenity):
        response = auth_client.get(f"{self.BASE_URL}{amenity.pk}/")
        assert response.status_code == 200
        assert response.data["name"] == "Hot Tub"

    def test_delete(self, auth_client, amenity):
        response = auth_client.delete(f"{self.BASE_URL}{amenity.pk}/")
        assert response.status_code == 204
        assert not Amenity.objects.filter(pk=amenity.pk).exists()


# ---------------------------------------------------------------------------
# API: ChaletViewSet
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestChaletAPI:
    BASE_URL = "/api/chalets/"

    # LIST ------------------------------------------------------------------

    def test_list_returns_active_only(self, auth_client, chalet, inactive_chalet):
        response = auth_client.get(self.BASE_URL)
        assert response.status_code == 200
        ids = [c["id"] for c in response.data]
        assert chalet.id in ids
        assert inactive_chalet.id not in ids

    def test_list_unauthenticated(self, api_client, chalet):
        response = api_client.get(self.BASE_URL)
        assert response.status_code == 200

    # CREATE ----------------------------------------------------------------

    def test_create_chalet(self, auth_client, user, location):
        data = {
            "title": "New Chalet",
            "price_per_night": "120.00",
            "capacity": 4,
            "owner": user.pk,
            "location_id": location.pk,
        }
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 201
        assert response.data["title"] == "New Chalet"

    def test_create_with_amenities(self, auth_client, user, location, amenity):
        data = {
            "title": "Chalet With Amenity",
            "price_per_night": "200.00",
            "capacity": 4,
            "owner": user.pk,
            "location_id": location.pk,
            "amenity_ids": [amenity.pk],
        }
        response = auth_client.post(self.BASE_URL, data, format="json")
        assert response.status_code == 201
        assert any(a["name"] == "Hot Tub" for a in response.data["amenities"])

    # RETRIEVE --------------------------------------------------------------

    def test_retrieve(self, auth_client, chalet):
        response = auth_client.get(f"{self.BASE_URL}{chalet.pk}/")
        assert response.status_code == 200
        assert response.data["title"] == "Snowy Peak"
        assert response.data["location"]["city"] == "Zermatt"
        assert "images" in response.data
        assert "amenities" in response.data

    # UPDATE ----------------------------------------------------------------

    def test_partial_update_price(self, auth_client, chalet):
        response = auth_client.patch(f"{self.BASE_URL}{chalet.pk}/", {"price_per_night": "175.00"})
        assert response.status_code == 200
        assert Decimal(response.data["price_per_night"]) == Decimal("175.00")

    # DELETE ----------------------------------------------------------------

    def test_delete_chalet(self, auth_client, chalet):
        response = auth_client.delete(f"{self.BASE_URL}{chalet.pk}/")
        assert response.status_code == 204
        assert not Chalet.objects.filter(pk=chalet.pk).exists()

    # FILTERING -------------------------------------------------------------

    def test_filter_by_city(self, auth_client, chalet):
        response = auth_client.get(self.BASE_URL, {"location__city": "Zermatt"})
        assert response.status_code == 200
        assert all(c["location"]["city"] == "Zermatt" for c in response.data)

    def test_filter_by_capacity(self, auth_client, chalet, location):
        small = Chalet.objects.create(title="Small Chalet", location=location, price_per_night="50.00", capacity=2)
        response = auth_client.get(self.BASE_URL, {"capacity": 6})
        assert response.status_code == 200
        ids = [c["id"] for c in response.data]
        assert chalet.id in ids
        assert small.id not in ids

    def test_search_by_title(self, auth_client, chalet):
        response = auth_client.get(self.BASE_URL, {"search": "Snowy"})
        assert response.status_code == 200
        assert any(c["id"] == chalet.id for c in response.data)

    def test_search_by_city(self, auth_client, chalet):
        response = auth_client.get(self.BASE_URL, {"search": "Zermatt"})
        assert response.status_code == 200
        assert any(c["id"] == chalet.id for c in response.data)

    # ORDERING --------------------------------------------------------------

    def test_ordering_by_price_asc(self, auth_client, chalet, location):
        Chalet.objects.create(title="Cheap One", location=location, price_per_night="50.00", capacity=2)
        response = auth_client.get(self.BASE_URL, {"ordering": "price_per_night"})
        assert response.status_code == 200
        prices = [Decimal(c["price_per_night"]) for c in response.data]
        assert prices == sorted(prices)

    def test_ordering_by_price_desc(self, auth_client, chalet, location):
        Chalet.objects.create(title="Cheap One", location=location, price_per_night="50.00", capacity=2)
        response = auth_client.get(self.BASE_URL, {"ordering": "-price_per_night"})
        assert response.status_code == 200
        prices = [Decimal(c["price_per_night"]) for c in response.data]
        assert prices == sorted(prices, reverse=True)


# ---------------------------------------------------------------------------
# API: ChaletImageViewSet
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestChaletImageAPI:
    BASE_URL = "/api/chalet-images/"

    def test_list(self, auth_client, chalet_image):
        response = auth_client.get(self.BASE_URL)
        assert response.status_code == 200
        assert any(img["id"] == chalet_image.id for img in response.data)

    def test_retrieve(self, auth_client, chalet_image):
        response = auth_client.get(f"{self.BASE_URL}{chalet_image.id}/")
        assert response.status_code == 200
        assert response.data["caption"] == "Front view"

    def test_partial_update_caption(self, auth_client, chalet_image):
        response = auth_client.patch(f"{self.BASE_URL}{chalet_image.id}/", {"caption": "Updated caption"})
        assert response.status_code == 200
        assert response.data["caption"] == "Updated caption"

    def test_delete(self, auth_client, chalet_image):
        response = auth_client.delete(f"{self.BASE_URL}{chalet_image.id}/")
        assert response.status_code == 204
        assert not ChaletImage.objects.filter(pk=chalet_image.id).exists()

