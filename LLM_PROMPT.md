# Project Analysis & Next Steps Prompt

You are an expert full-stack developer. We are building a modern web application consisting of a **Python FastAPI backend** and a **Frontend** (we need to initialize the frontend).

## Current Project State

### Backend (FastAPI + SQLAlchemy + Alembic)
- **Directory**: `/BACKEND`
- **Stack**: FastAPI, Async SQLAlchemy (asyncpg/aiosqlite), Alembic, Pydantic, Passlib, PyJWT.
- **Current Features**:
  - Basic boilerplate structure (`app/core`, `app/api`, `app/models`, `app/schemas`, `app/crud`).
  - Rate limiting with `slowapi`.
  - CORS middleware configured (default pointing to `http://localhost:3000`).
  - Basic authentication route `/login/access-token` for OAuth2 token generation.
  - A `User` model with `email`, `hashed_password`, `is_active`, `is_superuser`.
- **Known Issues/Missing Pieces in Backend**:
  - The `User` model imports from `app.models.base`, but `base.py` might be missing or incomplete.
  - There are no CRUD operations for creating users (registration is missing).
  - Environment variables (`.env`) need to be set up (it has a `sample.env`).

### Frontend
- **Directory**: `/FRONTEND`
- **Stack**: Currently empty (only contains `.GITKEEP`).
- **Goal**: Initialize a modern React-based frontend (e.g., using Next.js or Vite), set up styling (e.g., Tailwind CSS or vanilla CSS), and connect to the backend authentication.

## Your Task

1. **Fix and complete the Backend Authentication**:
   - Ensure `app.models.base` is correctly implemented.
   - Implement a user registration endpoint (`POST /register`) so we can create new users.
   - Implement a `GET /users/me` endpoint to fetch the current logged-in user using the JWT token.
2. **Initialize the Frontend**:
   - Create a new Next.js (or Vite + React) application inside the `FRONTEND` directory.
   - Set up a robust folder structure for components, pages, hooks, and API services.
   - Implement a login and registration page that interacts with the FastAPI backend.
   - Add a protected "Dashboard" page that requires the user to be logged in.
3. **Design & UX**:
   - Ensure the UI is highly polished, modern, and responsive. Use rich aesthetics, a dynamic design with hover states, micro-animations, and a cohesive color palette.

Please provide a step-by-step plan for how you will implement these features, and let's begin with fixing the backend authentication first.
