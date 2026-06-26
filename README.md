# DoggyApp — Frontend

A dog-centric social and event management platform built with Angular 19. DoggyApp connects dog owners with organizations (veterinary clinics, dog parks, training facilities) and supports event management, health record tracking, and social networking between owners.

---

## Purpose

DoggyApp serves three distinct user types:

- **Owners** — Dog owners who manage pet profiles, connect with friends, discover nearby organizations, and participate in events.
- **Users** — Employees of organizations who manage clients, coworkers, and organization-level events.
- **Organizations** — Businesses and services that manage clients, staff, locations, and events.

---

## Features

### Dog Management
- Create and manage detailed dog profiles
- Track health records: vaccines, alerts, notes, and likes
- Vaccine renewal tracking and expiry alerts
- Per-dog calendar views for events and activities

### Social Networking
- Friend requests and friend lists between owners
- Public owner profiles accessible by handle
- View friends' dogs and activity

### Events
- Create, edit, and delete events
- Invite owners and dogs to events
- Calendar views for owners, users, and organizations
- Organization-level event management

### Organization Discovery
- Search organizations by name or service type
- Browse nearby organizations and events using geolocation
- View public organization profiles
- Rate and favorite organizations
- Submit registration requests for dogs to join organizations

### Account Management
- Separate registration and login flows per user type
- Profile editing (bio, location, contact info)
- Password update with strength validation
- Google Places autocomplete for address entry

---

## Security

### Password Strength Validation
Registration and password change forms enforce strong passwords using the [zxcvbn](https://github.com/zxcvbn-ts/zxcvbn) algorithm:

- Minimum length: 8 characters
- Minimum strength score: 2 out of 4 (fair or better)
- Feedback suggestions returned to the user when the password is too weak
- Implemented as a reusable Angular validator directive (`PasswordStrengthDirective`) and service (`PasswordValidatorService`)

### Session Security
- Authentication is cookie-based; the backend (Spring) issues HTTP-only session cookies on login
- All API requests include `withCredentials: true` to send cookies automatically — tokens are never stored in JavaScript-accessible storage
- Session type (`owner | user | org`) is tracked in `localStorage` for UI routing only — never for authorization

### Input Validation
- Angular reactive forms with built-in and custom validators on all user inputs
- Strict TypeScript enabled across the project

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Angular | 19.2.20 |
| Language | TypeScript | ~5.8.3 |
| Styling | Bootstrap | 5.3.8 |
| Password Validation | zxcvbn-ts | 3.0.4 |
| HTTP | Angular HttpClient + RxJS | ~7.5.0 |
| Maps | Google Maps JavaScript API (Places) | — |
| Testing | Jasmine + Karma | 4.0.0 / 6.3.0 |
| Build | Angular CLI | 19.2.23 |
| Container | Docker (Node → Nginx multi-stage) | — |
| Orchestration | Kubernetes | — |

---

## Project Structure

```
src/
└── app/
    ├── dog-components/           # Dog cards, profiles, calendars
    ├── owner-components/         # Owner login, dashboard, profile, friends, org search
    ├── user-components/          # User login, dashboard, calendar, profile
    ├── organization-components/  # Org login, register, dashboard, calendar, profile
    ├── event-components/         # Create/edit event modal, event detail modal
    ├── models/                   # TypeScript interfaces (Dog, Owner, Event, etc.)
    ├── services/
    │   ├── auth/                 # Session state management (BehaviorSubject)
    │   ├── owner/                # Owner API service
    │   ├── user/                 # User API service
    │   ├── organization/         # Organization API service
    │   └── google-places/        # Google Maps Places integration
    ├── validators/               # PasswordStrengthDirective, PasswordValidatorService
    ├── home/                     # Landing page
    ├── not-found/                # 404 page
    ├── app-routing.module.ts     # All route definitions
    └── app.module.ts             # Root module

nginx/                            # Nginx config for production serving
k8s/                              # Kubernetes manifests
Dockerfile                        # Multi-stage Docker build
docker-compose.yaml               # Local development containers
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+)
- Angular CLI: `npm install -g @angular/cli`
- A running instance of the DoggyApp backend services (owner, user, organization APIs)

### Installation

```bash
git clone <repo-url>
cd frontend
npm install
```

### Running the Development Server

```bash
npm start
```

The app will be available at `http://localhost:4200` and will hot-reload on file changes.

---

## Environment Configuration

Configuration files are located in `src/environments/`.

**`environment.ts` (development)**
```typescript
{
  production: false,
  googleMapsApiKey: '',         // Add your Google Maps API key here
  ownerApiUrl: 'http://localhost:8080/owner',
  userApiUrl:  'http://localhost:8082/user',
  orgApiUrl:   'http://localhost:8083/organization'
}
```

**`environment.prod.ts` (production)**
```typescript
{
  production: true,
  googleMapsApiKey: '',         // Injected at container start via entrypoint.sh
  ownerApiUrl: '/api/owner',
  userApiUrl:  '/api/user',
  orgApiUrl:   '/api/org'
}
```

> Google Maps address autocomplete requires a valid API key with the **Places API** enabled. Without it, address fields will not autocomplete, but the rest of the app functions normally.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the dev server at `http://localhost:4200` |
| `npm run build` | Production build, output to `dist/frontend/` |
| `npm run watch` | Build in watch mode (development config) |
| `npm test` | Run unit tests with Karma in watch mode |

---

## API Integration

The frontend communicates with three separate backend microservices. All requests use `withCredentials: true` for cookie-based session auth.

| Service | Dev URL | Prod URL | Responsibility |
|---|---|---|---|
| Owner API | `http://localhost:8080/owner` | `/api/owner` | Owners, dogs, friends, events, org search |
| User API | `http://localhost:8082/user` | `/api/user` | Org employees, clients, locations, events |
| Organization API | `http://localhost:8083/organization` | `/api/org` | Org accounts, staff, clients, registration requests |

---

## Testing

```bash
npm test
```

Uses **Karma** with a Chrome launcher and **Jasmine** for assertions. Test spec files (`*.spec.ts`) are co-located with each component and service. Coverage reports are generated in `coverage/frontend/`.

---

## Deployment

### Docker

```bash
# Build the production image
docker build -t doggyapp-frontend .

# Or use Docker Compose for local development
docker-compose up
```

The Dockerfile uses a multi-stage build: Angular compiles in a Node image, then the built static assets are served by Nginx. An `entrypoint.sh` script handles dynamic environment variable injection at container startup.

### Kubernetes

Kubernetes manifests are located in `k8s/`. The app is designed to be deployed behind a reverse proxy that routes `/api/*` paths to the respective backend services.

---

## Routes

| Path | Component | Access |
|---|---|---|
| `/` | HomeComponent | Public |
| `/owner-login` | OwnerLoginComponent | Public |
| `/owner-register` | OwnerRegisterComponent | Public |
| `/owner-dashboard` | OwnerDashboardComponent | Owner |
| `/owner-calendar` | OwnerCalendarComponent | Owner |
| `/owner-edit-profile` | OwnerEditProfileComponent | Owner |
| `/owner-friends` | OwnerFriendsComponent | Owner |
| `/owner-search-orgs` | OwnerSearchOrgsComponent | Owner |
| `/owner-public-profile/:handle` | OwnerPublicProfileComponent | Public |
| `/user-login` | UserLoginComponent | Public |
| `/user-dashboard` | UserDashboardComponent | User |
| `/user-calendar` | UserCalendarComponent | User |
| `/user-profile` | UserProfileComponent | User |
| `/org-login` | OrgLoginComponent | Public |
| `/org-register` | OrgRegisterComponent | Public |
| `/org-dashboard` | OrgDashboardComponent | Organization |
| `/org-calendar` | OrgCalendarComponent | Organization |
| `/org-profile` | OrgProfileComponent | Organization |
| `/add-dog` | AddDogComponent | Owner / User |
| `/dog-profile/:id` | DogProfileComponent | Owner / User |
| `/dog-calendar/:id` | DogCalendarComponent | Owner / User |
| `/public-org-profile/:id` | PublicOrgProfileComponent | Public |
| `**` | NotFoundComponent | — |
