# Khademni — Freelance Marketplace (Microservices)

## Architecture

```
Angular (4200)  →  API Gateway (8080)  →  user-service (8081)
                                       →  project-service (8082)
```

## Default Ports

| Service          | Port |
|------------------|------|
| API Gateway      | 8080 |
| user-service     | 8081 |
| project-service  | 8082 |
| PostgreSQL       | 5432 |
| Angular frontend | 4200 |

## How to Run (Docker Compose)

```bash
docker-compose up --build
```

Then open `http://localhost:4200` in your browser.

To stop:

```bash
docker-compose down
```

---

## AuthResponse DTO

Returned by `POST /api/auth/login` and `POST /api/auth/register`:

```json
{
  "token": "eyJ...",
  "userId": 42,
  "email": "user@example.com",
  "role": "FREELANCER",
  "name": "John Doe"
}
```

---

## Exposed Endpoints (via API Gateway at port 8080)

### 🔐 Authentication

| Method | URL                    | Auth     | Description               |
|--------|------------------------|----------|---------------------------|
| POST   | `/api/auth/register`   | Public   | Register a new user       |
| POST   | `/api/auth/login`      | Public   | Login, returns AuthResponse |
| GET    | `/api/auth/me`         | JWT      | Get current user email    |

### 👤 Users

| Method | URL               | Auth     | Description           |
|--------|-------------------|----------|-----------------------|
| GET    | `/api/users`      | JWT      | List all users        |
| GET    | `/api/users/{id}` | JWT      | Get user by ID        |
| PUT    | `/api/users/{id}` | JWT      | Update user           |
| DELETE | `/api/users/{id}` | JWT      | Delete user           |

### 🧑‍💻 Freelancers

| Method | URL                                    | Auth | Description                  |
|--------|----------------------------------------|------|------------------------------|
| GET    | `/api/freelancers`                     | JWT  | List all freelancers         |
| GET    | `/api/freelancers/{id}`                | JWT  | Get freelancer by ID         |
| PUT    | `/api/freelancers/{id}`                | JWT  | Update freelancer profile    |
| GET    | `/api/freelancers/{id}/profile-complete` | JWT | Check profile completeness |

### 🏢 Clients

| Method | URL                  | Auth | Description          |
|--------|----------------------|------|----------------------|
| GET    | `/api/clients`       | JWT  | List all clients     |
| GET    | `/api/clients/{id}`  | JWT  | Get client by ID     |
| PUT    | `/api/clients/{id}`  | JWT  | Update client        |

### 📁 Projects

| Method | URL                          | Auth          | Description                          |
|--------|------------------------------|---------------|--------------------------------------|
| GET    | `/api/projects`              | Public        | List all projects                    |
| GET    | `/api/projects/open`         | Public        | List open projects                   |
| GET    | `/api/projects/{id}`         | Public        | Get project by ID                    |
| POST   | `/api/projects`              | JWT (CLIENT)  | Create a project                     |
| GET    | `/api/projects/my`           | JWT (CLIENT)  | Get authenticated client's projects  |
| GET    | `/api/projects/client/{id}`  | JWT           | Get projects by client email/id      |
| PUT    | `/api/projects/{id}`         | JWT (CLIENT/ADMIN) | Update a project                |
| DELETE | `/api/projects/{id}`         | JWT (CLIENT/ADMIN) | Delete a project                |
| PUT    | `/api/projects/{id}/status`  | JWT (CLIENT/ADMIN) | Update project status (`OPEN`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`) |

### 📝 Applications

| Method | URL                                   | Auth | Description                        |
|--------|---------------------------------------|------|------------------------------------|
| POST   | `/api/applications`                   | JWT  | Apply to a project                 |
| GET    | `/api/applications/project/{id}`      | JWT  | Get applications for a project     |
| GET    | `/api/applications/freelancer/{id}`   | JWT  | Get applications by freelancer     |
| PUT    | `/api/applications/{id}/status`       | JWT  | Update application status          |

### 📜 Contracts

| Method | URL                    | Auth | Description          |
|--------|------------------------|------|----------------------|
| POST   | `/api/contracts`       | JWT  | Create a contract    |
| GET    | `/api/contracts/{id}`  | JWT  | Get contract by ID   |

### ⭐ Ratings

| Method | URL                                      | Auth | Description                         |
|--------|------------------------------------------|------|-------------------------------------|
| POST   | `/api/ratings`                           | JWT  | Submit a rating                     |
| GET    | `/api/ratings/freelancer/{id}`           | JWT  | Get ratings for a freelancer        |
| GET    | `/api/ratings/freelancer/{id}/average`   | JWT  | Get average rating for a freelancer |
