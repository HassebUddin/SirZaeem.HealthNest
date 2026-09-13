# HealthNest 🏥

A full-stack hospital / clinic management platform that lets patients find doctors, book appointments, check symptoms with an AI assistant, and track a live queue in real time — while doctors and admins manage schedules, patients, and analytics from their own dashboards.

**Live demo:** [health-nest-one.vercel.app](https://health-nest-one.vercel.app/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Real-Time Queue (SignalR)](#real-time-queue-signalr)
- [User Roles](#user-roles)
- [Deployment](#deployment)
- [Database Migrations](#database-migrations)
- [License](#license)

---

## Overview

HealthNest is a role-based healthcare platform built as an ASP.NET Core Web API backend with a React (Vite) frontend. It supports three types of users — **Admins**, **Doctors**, and **Patients** — each with a dedicated dashboard, and ties everything together with JWT authentication, PostgreSQL persistence, live queue updates over SignalR, and an AI-powered symptom checker (Google Gemini) with a built-in fallback.

## Features

- 🔐 **Authentication & Authorization** — JWT-based login/registration with role-based access control (Admin / Doctor / Patient)
- 👨‍⚕️ **Doctor Discovery** — Search and browse doctors by specialization, with profile pages and available time slots
- 📅 **Appointment Booking** — Patients book slots; doctors manage availability; live status updates
- 🕐 **Live Queue System** — Real-time, SignalR-powered queue so patients and doctors see check-ins and "next patient" updates instantly
- 🤖 **AI Symptom Checker** — Google Gemini–backed symptom analysis with a safe fallback response when no API key is configured
- 📊 **Admin Analytics Dashboard** — Summary stats, top doctors, daily trends, and breakdowns by specialization (powered by Recharts)
- 🗂️ **Admin Management** — Manage doctors, patients, and all appointments from a single console
- 🌓 **Theming & Polished UI** — Animated page transitions (Framer Motion), light/dark theme context, hero slider, and a support chat widget

## Tech Stack

**Backend**
- [ASP.NET Core (.NET 10)](https://learn.microsoft.com/aspnet/core) Web API
- Entity Framework Core with [Npgsql](https://www.npgsql.org/) (PostgreSQL)
- SignalR for real-time communication
- JWT Bearer authentication
- BCrypt.Net for password hashing
- Google Gemini API for AI-assisted symptom checking

**Frontend**
- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- React Router v6
- Axios for API calls
- `@microsoft/signalr` client
- Recharts (analytics charts)
- Framer Motion (animations)
- React Icons

**Infrastructure**
- Backend containerized with Docker, deployed on [Render](https://render.com/)
- Frontend deployed on [Vercel](https://vercel.com/)
- PostgreSQL database

## Project Structure

```
SirZaeem.IAD.HealthNest/
├── backend/
│   └── HealthNest.Api/
│       ├── Controllers/       # Admin, Analytics, Appointments, Auth, Doctors, Queue, SymptomChecker
│       ├── Data/               # AppDbContext, DataSeeder
│       ├── DTOs/                # Request/response models per feature
│       ├── Hubs/                # AppointmentHub (SignalR)
│       ├── Migrations/          # EF Core migrations
│       ├── Models/              # Appointment, DoctorProfile, TimeSlot, User
│       ├── Services/            # GeminiService, JwtService
│       ├── Dockerfile
│       └── Program.cs
├── frontend/
│   └── src/
│       ├── api/                 # Axios client
│       ├── components/          # Navbars, dashboard layout, live queue, symptom checker widget, etc.
│       ├── context/              # Auth, SignalR, Theme contexts
│       ├── hooks/                # useCountUp, useDoctorProfile
│       ├── pages/                # Public pages + Admin/Doctor/Patient dashboards
│       └── App.jsx
├── DEPLOYMENT.md               # Step-by-step Render + Vercel deployment guide
└── SirZaeem.HealthNest.slnx    # .NET solution file
```

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) 18+ and npm
- [PostgreSQL](https://www.postgresql.org/) running locally (or a connection string to a remote instance)

### Backend Setup

```bash
cd backend/HealthNest.Api

# Configure your local Postgres connection string in appsettings.Development.json
# (or appsettings.json), e.g.:
# "DefaultConnection": "Host=localhost;Port=5432;Database=healthnestdb;Username=postgres;Password=yourpassword"

# Apply migrations to create the database
dotnet ef migrations add InitialCreate   # only if you need to (re)generate migrations
dotnet ef database update

# Run the API
dotnet run
```

The API will start (by default) on `https://localhost:5001`, and will auto-run pending migrations and seed initial data on startup.

### Frontend Setup

```bash
cd frontend
npm install

# Copy the example env file and adjust as needed
cp .env.example .env

npm run dev
```

The Vite dev server runs on `http://localhost:5173` by default.

## Environment Variables

**Backend** (`appsettings.json` / `appsettings.Development.json`, or environment variables in production):

| Key | Description |
|---|---|
| `ConnectionStrings:DefaultConnection` | PostgreSQL connection string (local dev) |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Individual DB connection pieces, used in production if set (e.g. on Render) |
| `Jwt:Issuer`, `Jwt:Audience`, `Jwt:Key` | JWT signing configuration — **change `Jwt:Key` for production** |
| `AllowedOrigins` | Array of allowed CORS origins (e.g. your frontend URL) |
| `Gemini:ApiKey` | Google Gemini API key for the symptom checker (optional — a fallback response is used if empty) |
| `PORT` | Overrides the listening port (used by platforms like Render) |

**Frontend** (`frontend/.env`, based on `.env.example`):

| Key | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend REST API, e.g. `https://localhost:5001/api` |
| `VITE_HUB_URL` | URL of the SignalR hub, e.g. `https://localhost:5001/hubs/appointments` |

## API Overview

All endpoints are prefixed with `/api/[controller]`.

| Controller | Endpoints |
|---|---|
| `AuthController` | `POST /register`, `POST /login` |
| `DoctorsController` | `GET /`, `GET /me`, `GET /{doctorProfileId}/slots`, `PUT /profile`, `POST /slots` |
| `AppointmentsController` | `POST /book`, `GET /doctor`, `GET /patient`, `PUT /{id}/status` |
| `QueueController` | `POST /check-in/{appointmentId}`, `GET /doctor/{doctorProfileId}`, `GET /status/{appointmentId}`, `POST /next` |
| `SymptomCheckerController` | `POST /analyze` |
| `AdminController` | `GET/POST /doctors`, `DELETE /doctors/{doctorProfileId}`, `GET /patients`, `GET /appointments` |
| `AnalyticsController` | `GET /summary`, `GET /top-doctors`, `GET /daily-trend`, `GET /by-specialization` |

Most endpoints require a JWT bearer token in the `Authorization` header. An OpenAPI document is exposed via `app.MapOpenApi()`.

## Real-Time Queue (SignalR)

The `AppointmentHub` (mapped at `/hubs/appointments`) pushes live updates to connected clients for:
- New patient check-ins
- Queue position changes
- "Call next patient" actions from the doctor dashboard

Since browsers can't set custom headers during the WebSocket handshake, the JWT is passed via the `access_token` query string parameter when connecting to the hub — this is handled automatically by the SignalR client configuration.

## User Roles

| Role | Capabilities |
|---|---|
| **Patient** | Search doctors, book/view appointments, check in to the live queue, use the symptom checker |
| **Doctor** | Manage their profile and time slots, view/manage appointments, run the live queue |
| **Admin** | Manage doctors and patients, view/manage all appointments, view analytics dashboards |

## Deployment

The backend and frontend are deployed independently:

- **Backend** (`backend/HealthNest.Api`) → [Render](https://render.com/) (free tier), via Docker + a `render.yaml` blueprint that provisions the API and a managed Postgres database
- **Frontend** (`frontend`) → [Vercel](https://vercel.com/) (free tier), as a Vite/React static build

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full step-by-step walkthrough, including connecting CORS between the two deployments.

> **Note:** on Render's free tier, the backend spins down after 15 minutes of inactivity — the first request afterward can take 30–50 seconds to wake it back up.

## Database Migrations

The project uses EF Core Code-First migrations against PostgreSQL. To create a new migration after model changes:

```bash
cd backend/HealthNest.Api
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

Migrations and pending schema updates are also applied automatically on application startup.
