# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

## Khademni Frontend

### Getting started

```bash
cd frontend
npm install
ng serve
```

The app will be available at `http://localhost:4200`. The backend API Gateway must be running on `http://localhost:8080` (start with `docker-compose up` from the repository root).

### Folder structure

```
frontend/src/app/
├── core/
│   ├── guards/         # authGuard (blocks unauthenticated), roleGuard (blocks wrong role)
│   ├── interceptors/   # authInterceptor — attaches Authorization: Bearer <token>
│   ├── models/         # user.model.ts, project.model.ts, application.model.ts
│   └── services/       # AuthService, UserService, ProjectService, ApplicationService
├── features/
│   ├── auth/           # login, register (functional forms with Angular Material)
│   ├── home/           # public landing page
│   ├── freelancer/     # dashboard, profile, projects (browse), applications (mine)
│   ├── client/         # dashboard, projects (mine), create-project, freelancers (browse)
│   └── admin/          # dashboard, users
├── layouts/
│   └── main-layout/    # Material toolbar — nav changes based on auth state & role
├── app.config.ts       # providers: router, HttpClient + authInterceptor, animations
├── app.routes.ts       # lazy-loaded route tree with authGuard + roleGuard
└── app.ts              # root bootstrap component (renders <router-outlet>)
```

### Environment config

| File | `apiUrl` |
|------|----------|
| `src/environments/environment.ts` (dev) | `http://localhost:8080` |
| `src/environments/environment.prod.ts` (prod) | `http://localhost:8080` |

### Auth flow

1. Login → `POST /api/auth/login` returns a raw JWT string.
2. The JWT payload contains `sub` (email) and `role` (FREELANCER / CLIENT / ADMIN).
3. Token is stored in `localStorage`; `authInterceptor` attaches it to every HTTP request.
4. `AuthService` exposes Angular signals: `currentUser`, `isAuthenticated`, `role`.
5. After login, the user is redirected to their role-specific dashboard.

### Role-based routing

| Path prefix | Guard | Required role |
|-------------|-------|---------------|
| `/freelancer/**` | `authGuard` + `roleGuard` | `FREELANCER` |
| `/client/**` | `authGuard` + `roleGuard` | `CLIENT` |
| `/admin/**` | `authGuard` + `roleGuard` | `ADMIN` |
| `/login`, `/register`, `/` | public | — |
