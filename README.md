# SwissChalet

SwissChalet is a full-stack web application built with React and Django, allowing users to explore and book chalets in Switzerland, rent ski equipment, and discover winter activities.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend API | Django 6.0 · Django REST Framework |
| Frontend | React 19 · React Router 7 · Styled Components |
| Auth | JWT (SimpleJWT) |
| Database | PostgreSQL 15 |
| Build tool | Vite |
| Web server | NGINX 1.25 (reverse proxy + static files) |
| App server | Gunicorn |
| Containerisation | Docker · Docker Compose |

---

## Project Structure

```
SwissChalet/
├── backend/                # Django project
│   ├── activity/           # Activities & schedules
│   ├── booking/            # Chalet & activity bookings
│   ├── chalet/             # Chalets, locations, amenities, images
│   ├── company/            # Companies that own chalets
│   ├── equipment/          # Ski equipment & equipment bookings
│   ├── review/             # Reviews for chalets and activities
│   ├── users/              # Registration, login, profile (JWT auth)
│   └── swisschalet/        # Django settings, URLs, WSGI
├── frontend/               # React + Vite SPA
│   └── src/
│       ├── pages/          # Route-level page components
│       ├── components/     # Shared UI components & dashboard views
│       ├── hooks/          # Data-fetching hooks
│       ├── services/       # API client (auth)
│       ├── styles/         # Global styles & shared style helpers
│       └── utils/          # Date helpers and other utilities
├── nginx/
│   └── nginx.conf          # NGINX reverse-proxy configuration
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### 1. Clone the repository

```bash
git clone <repository-url>
cd SwissChalet
```

### 2. (Windows only) Add the local hostname

Open PowerShell **as Administrator** and run:

```powershell
Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "`n127.0.0.1`tswisschalet"
```

### 3. Start the application

```bash
docker-compose up --build
```

This will:
1. Build the Django/Gunicorn and React/NGINX images
2. Start PostgreSQL and wait for it to be healthy
3. Run database migrations and collect static files
4. Serve the frontend SPA and API through NGINX on port 80

The application is available at **http://swisschalet/** and the API at **http://swisschalet/api/**.

---

## Frontend Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Landing page with hero section and highlights |
| `/about` | About | Company and chalet overview |
| `/activities` | Activities | Browse available winter activities |
| `/chalets` | Chalets | Browse and filter available chalets |
| `/faqs` | FAQs | Frequently asked questions |
| `/terms` | Terms | Terms and conditions |
| `/dashboard` | Dashboard | Authenticated user dashboard |
| `/dashboard/:tab` | Dashboard | Deep-linked dashboard tab (profile, reservations, chalets, activities, equipment, faqs, contacts) |

Authentication (register / log in) is handled via a modal (`LoginModal`) available from any page.

---

## API Endpoints

All endpoints are prefixed with `/api/`.

### Resources

| Resource | Endpoint |
|---|---|
| Chalets | `/api/chalets/` |
| Locations | `/api/locations/` |
| Amenities | `/api/amenities/` |
| Chalet images | `/api/chalet-images/` |
| Activities | `/api/activities/` |
| Activity schedules | `/api/activity-schedules/` |
| Chalet bookings | `/api/bookings/` |
| Activity bookings | `/api/activity-bookings/` |
| Companies | `/api/companies/` |
| Equipment | `/api/equipment/` |
| Equipment bookings | `/api/equipment-bookings/` |
| Reviews | `/api/reviews/` |

### Authentication

| Action | Endpoint | Method |
|---|---|---|
| Register | `/api/auth/register/` | `POST` |
| Login (obtain tokens) | `/api/auth/login/` | `POST` |
| Refresh access token | `/api/auth/token/refresh/` | `POST` |
| Current user profile | `/api/auth/me/` | `GET` |

### Other

| | Endpoint |
|---|---|
| DRF browsable auth | `/api-auth/` |
| Django admin | `/admin/` |

---

## Environment Variables

The following environment variables can be set on the `backend` service (defaults shown):

| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `db` | PostgreSQL host |
| `DB_NAME` | `postgres` | Database name |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | `postgres` | Database password |
| `DB_PORT` | `5432` | Database port |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1,nginx,swisschalet` | Comma-separated Django allowed hosts |
| `CORS_ALLOWED_ORIGINS` | `http://swisschalet,http://localhost` | Comma-separated CORS origins |

---

## Django Apps

### `users`
Handles user registration (`RegisterView`) and the current-user profile endpoint (`MeView`). Authentication uses JWT tokens issued by **djangorestframework-simplejwt**. Tokens are stored in `localStorage` on the client and sent as `Authorization: Bearer <token>` headers.

### `chalet`
Manages `Location`, `Amenity`, `Chalet`, and `ChaletImage` models. Chalets belong to a `Company`, are linked to a `Location` in Switzerland, and support multiple images and amenities.

### `activity`
Manages `Activity` and `ActivitySchedule` models. Each schedule tracks seat capacity, bookings, and availability. Activities have difficulty levels (easy / moderate / hard) and a price.

### `booking`
Manages `ChaletBooking` (date-range chalet reservations) and `ChaletActivityBooking` (activity schedule reservations). Both validate availability and prevent double-booking.

### `equipment`
Manages `Equipment` (ski gear linked to a chalet) and `EquipmentBooking` (quantity reservation tied to an activity booking). Availability is checked per schedule.

### `review`
Manages `Review` records. Each review targets either a chalet **or** an activity (not both), with a 1–5 star rating.

### `company`
Manages `Company` records that own and operate chalets.

---

## Development Notes

- Static files are collected into `/app/staticfiles/` inside the container and served directly by NGINX — no Whitenoise required at runtime.
- To create a Django superuser:

```bash
docker-compose exec backend python manage.py createsuperuser
```

- To run backend tests:

```bash
docker-compose exec backend pytest
```

- To run the frontend in development mode (outside Docker):

```bash
cd frontend
npm install
npm run dev
```

The dev server proxies `/api/` requests to the backend — see `vite.config.js` for the proxy configuration.
