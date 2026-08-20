# MedCare Plus Hospital Appointment System

A practical React and Express hospital appointment system for ITUE301.

## Project structure

- `frontend/` React + Vite application with React Router
- `backend/` Express REST API, middleware, and Mongoose schemas

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the API at `http://localhost:5000`. To use another API host, add `VITE_API_URL` to `frontend/.env`.

## Backend setup

```bash
cd backend
npm install
npm start
```

The API provides:

- `GET /api/v1/appointments` (200)
- `POST /api/v1/appointments` (201)
- `GET /api/v1/doctors` (200)

Requests are logged globally as `[METHOD] PATH [TIMESTAMP]`. Errors use structured JSON responses through the final error middleware.

## MongoDB setup

1. Copy the root `.env.example` to `.env`.
2. Set `MONGO_URI` to a local MongoDB or MongoDB Atlas connection string.
3. Start the backend with `npm start`.
4. Run `npm run validate` from `backend/` to save and remove a demonstration doctor, then display Mongoose schema defaults and validation failures.

Mongoose schemas are in `backend/models/Patient.js`, `Doctor.js`, and `Appointment.js`. Patient blood groups, appointment statuses, required fields, references, and the 300-character reason limit are validated by the schemas. Mongoose validation and duplicate-key errors are returned as meaningful JSON messages by the global error handler.

## Required environment variables

- `MONGO_URI` MongoDB connection string
- `PORT` optional backend port, default `5000`
- `VITE_API_URL` optional frontend API base URL
