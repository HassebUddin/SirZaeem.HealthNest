# Deploying HealthNest (Backend on Render + Frontend on Vercel)

This project has two parts that deploy separately:
- **Backend** (`backend/HealthNest.Api`) — ASP.NET Core API + SignalR → deploy to **Render** (free tier)
- **Frontend** (`frontend`) — React/Vite app → deploy to **Vercel** (free tier)

The steps below need your own GitHub/Render/Vercel accounts, so they can't be done for you automatically — follow them in order.

## 1. Push the code to GitHub

```
git add -A
git commit -m "Prepare for deployment (Postgres + Docker + Vercel config)"
git push origin master
```

## 2. Deploy the backend on Render

1. Go to https://render.com and sign up / log in (GitHub login is easiest).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub account and select the `SirZaeem.HealthNest` repo.
4. Render will detect `render.yaml` at the repo root and show two resources:
   - `healthnest-api` (web service)
   - `healthnest-db` (Postgres database)
5. Click **Apply** — Render will provision the free Postgres database and build the API from `backend/HealthNest.Api/Dockerfile`.
6. Once both are live, open the `healthnest-api` service → **Environment** tab and set:
   - `AllowedOrigins__0` → your Vercel URL once you have it (e.g. `https://healthnest.vercel.app`) — you can add this after step 3
   - `Gemini__ApiKey` → your Gemini API key if you have one (optional — the symptom checker has a working fallback without it)
7. Copy the service URL Render gives you, e.g. `https://healthnest-api.onrender.com` — you'll need it for the frontend.

**Note:** the free web service goes to sleep after 15 minutes of no traffic. The first request after that takes ~30-50 seconds to wake up — this is normal on the free tier, not a bug.

## 3. Deploy the frontend on Vercel

1. Go to https://vercel.com and sign up / log in (GitHub login is easiest).
2. Click **Add New** → **Project**, and import the `SirZaeem.HealthNest` repo.
3. When asked for the **Root Directory**, set it to `frontend`.
4. Framework preset should auto-detect as **Vite** — leave build command as `npm run build` and output directory as `dist`.
5. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://healthnest-api.onrender.com/api` (use your actual Render URL from step 2)
   - `VITE_HUB_URL` = `https://healthnest-api.onrender.com/hubs/appointments`
6. Click **Deploy**. Vercel will give you a URL like `https://health-nest.vercel.app`.

## 4. Connect the two

Go back to Render → `healthnest-api` → **Environment**, and set `AllowedOrigins__0` to your Vercel URL from step 3 (e.g. `https://health-nest.vercel.app`), then save — Render will redeploy automatically.

## 5. Test it

Open your Vercel URL. The first backend request will be slow (service waking up) — after that everything should work: registration, login, booking, live queue, admin dashboard, etc.

## Local development after this change

The database engine changed from SQL Server (LocalDB) to PostgreSQL, so local development now needs a local Postgres instance instead of LocalDB. Once PostgreSQL is installed locally:

```
cd backend/HealthNest.Api
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Update `appsettings.Development.json` (or `appsettings.json`) with your local Postgres connection string, e.g.:

```
"DefaultConnection": "Host=localhost;Database=healthnestdb;Username=postgres;Password=yourpassword"
```
