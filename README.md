# SirZaeem.HealthNest

Online Doctor Appointment Booking SaaS platform with real-time notifications.

## Overview

HealthNest lets doctors register, set up their profile and available time slots, while
patients search for doctors and book appointments online. Real-time updates (new
bookings, slot availability, appointment status changes) are pushed via SignalR.

## Features

- Role-based authentication (Admin, Doctor, Patient) with JWT
- Doctor profile management (specialization, fee, bio)
- Time slot creation and real-time availability updates
- Doctor search and appointment booking
- Doctor dashboard: view and manage appointments (confirm/cancel)
- Patient dashboard: view appointment status in real time
- Free vs Premium subscription plan per doctor (SaaS tier concept)

## Tech Stack

- **Frontend:** React (Vite), React Router, Axios, `@microsoft/signalr`
- **Backend:** ASP.NET Core Web API, Entity Framework Core, SignalR
- **Database:** SQL Server (LocalDB for development)
- **Auth:** JWT Bearer tokens, BCrypt password hashing

## Project Structure

```
SirZaeem.HealthNest/
├── backend/
│   └── HealthNest.Api/       # ASP.NET Core Web API + SignalR hub
├── frontend/                 # React (Vite) client
└── README.md
```

## Getting Started

### Backend

```bash
cd backend/HealthNest.Api
dotnet restore
dotnet ef database update
dotnet run
```

API runs at `https://localhost:5001` (adjust per `launchSettings.json`).
SignalR hub is available at `/hubs/appointments`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Configuration

Update `backend/HealthNest.Api/appsettings.json`:
- `ConnectionStrings:DefaultConnection` — SQL Server connection string
- `Jwt:Key` — replace with a strong secret before deploying
- `AllowedOrigins` — frontend URL(s) allowed via CORS

## Deployment

- Frontend: Vercel
- Backend: Render / Azure App Service
- Database: Azure SQL / any SQL Server-compatible cloud DB

## Team

Group project for Software as a Service (SaaS) coursework.
