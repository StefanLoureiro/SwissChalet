import pytest

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from .models import Company

User = get_user_model()


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def user(db):
    return User.objects.create_superuser(username="companyowner", password="pass1234")


@pytest.fixture
def other_user(db):
    return User.objects.create_user(username="other", password="pass1234")


@pytest.fixture
def company(db, user):
    return Company.objects.create(
        name="Alpine Adventures",
        description="Premium Swiss experiences.",
        owner=user,
        is_active=True,
    )


@pytest.fixture
def inactive_company(db, user):
    return Company.objects.create(
        name="Dormant Corp",
        owner=user,
        is_active=False,
    )


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


# ---------------------------------------------------------------------------
# Model: Company
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestCompanyModel:
    def test_str(self, company):
        assert str(company) == "Alpine Adventures"

    def test_default_is_active(self, db, user):
        c = Company.objects.create(name="New Co", owner=user)
        assert c.is_active is True

    def test_owner_nullable(self, db):
        c = Company.objects.create(name="No Owner Co")
        assert c.owner is None

    def test_description_optional(self, db, user):
        c = Company.objects.create(name="Minimal Co", owner=user)
        assert c.description == ""

    def test_ordering_newest_first(self, db, user):
        c1 = Company.objects.create(name="First Co", owner=user)
        c2 = Company.objects.create(name="Second Co", owner=user)
        companies = list(Company.objects.all())
        assert companies[0].pk == c2.pk

    def test_owner_set_null_on_user_delete(self, db):
        temp_user = User.objects.create_user(username="temp", password="pass")
        c = Company.objects.create(name="Temp Co", owner=temp_user)
        temp_user.delete()
        c.refresh_from_db()
        assert c.owner is None


# ---------------------------------------------------------------------------
# API: CompanyViewSet
# ---------------------------------------------------------------------------

@pytest.mark.django_db
class TestCompanyAPI:
    BASE_URL = "/api/companies/"

    # LIST ------------------------------------------------------------------

    def test_list_returns_active_only(self, auth_client, company, inactive_company):
        response = auth_client.get(self.BASE_URL)
        assert response.status_code == 200
        ids = [c["id"] for c in response.data]
        assert company.id in ids
        assert inactive_company.id not in ids

    def test_list_unauthenticated(self, api_client, company):
        response = api_client.get(self.BASE_URL)
        assert response.status_code == 200

    # CREATE ----------------------------------------------------------------

    def test_create_company(self, auth_client, user):
        data = {"name": "New Ventures", "description": "Fresh company.", "owner": user.pk}
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 201
        assert response.data["name"] == "New Ventures"

    def test_create_company_without_owner(self, auth_client):
        data = {"name": "Ownerless Co"}
        response = auth_client.post(self.BASE_URL, data)
        assert response.status_code == 201
        assert response.data["owner"] is None

    def test_create_company_unauthenticated_rejected(self, api_client):
        data = {"name": "Should Fail"}
        response = api_client.post(self.BASE_URL, data)
        assert response.status_code in (401, 403)

    # RETRIEVE --------------------------------------------------------------

    def test_retrieve(self, auth_client, company):
        response = auth_client.get(f"{self.BASE_URL}{company.pk}/")
        assert response.status_code == 200
        assert response.data["name"] == "Alpine Adventures"
        assert response.data["description"] == "Premium Swiss experiences."

    # UPDATE ----------------------------------------------------------------

    def test_partial_update_description(self, auth_client, company):
        response = auth_client.patch(f"{self.BASE_URL}{company.pk}/", {"description": "Updated desc."})
        assert response.status_code == 200
        assert response.data["description"] == "Updated desc."

    def test_full_update(self, auth_client, company, user):
        data = {"name": "Renamed Co", "owner": user.pk, "is_active": True}
        response = auth_client.put(f"{self.BASE_URL}{company.pk}/", data)
        assert response.status_code == 200
        assert response.data["name"] == "Renamed Co"

    # DELETE ----------------------------------------------------------------

    def test_delete_company(self, auth_client, company):
        response = auth_client.delete(f"{self.BASE_URL}{company.pk}/")
        assert response.status_code == 204
        assert not Company.objects.filter(pk=company.pk).exists()

    # FILTERING -------------------------------------------------------------

    def test_filter_by_owner(self, auth_client, user, other_user, company):
        other_company = Company.objects.create(name="Other Co", owner=other_user)
        response = auth_client.get(self.BASE_URL, {"owner": user.pk})
        assert response.status_code == 200
        ids = [c["id"] for c in response.data]
        assert company.id in ids
        assert other_company.id not in ids

    # SEARCH ----------------------------------------------------------------

    def test_search_by_name(self, auth_client, company):
        response = auth_client.get(self.BASE_URL, {"search": "Alpine"})
        assert response.status_code == 200
        assert any(c["id"] == company.id for c in response.data)

    def test_search_by_description(self, auth_client, company):
        response = auth_client.get(self.BASE_URL, {"search": "Premium"})
        assert response.status_code == 200
        assert any(c["id"] == company.id for c in response.data)

    def test_search_no_match_returns_empty(self, auth_client, company):
        response = auth_client.get(self.BASE_URL, {"search": "zzznomatchzzz"})
        assert response.status_code == 200
        assert len(response.data) == 0

    # ORDERING --------------------------------------------------------------

    def test_ordering_by_name_asc(self, auth_client, user):
        Company.objects.create(name="Zebra Co", owner=user)
        Company.objects.create(name="Alpha Co", owner=user)
        response = auth_client.get(self.BASE_URL, {"ordering": "name"})
        assert response.status_code == 200
        names = [c["name"] for c in response.data]
        assert names == sorted(names)

    def test_ordering_by_name_desc(self, auth_client, user):
        Company.objects.create(name="Zebra Co", owner=user)
        Company.objects.create(name="Alpha Co", owner=user)
        response = auth_client.get(self.BASE_URL, {"ordering": "-name"})
        assert response.status_code == 200
        names = [c["name"] for c in response.data]
        assert names == sorted(names, reverse=True)

