# Complete Movie Watchlist API | NodeJS, ExpressJS, JWT, Prisma, PostgreSQL

<p align="center">
  <img src="assets/cover.png" alt="Movie Watchlist API Cover" width="1200"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-green?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-lightgrey?logo=express&logoColor=black" />
  <img src="https://img.shields.io/badge/Prisma-blue?logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-orange?logo=JSON%20Web%20Tokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Zod-purple?logo=Zod&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-black?logo=Redis" />
</p>

A simple REST API to manage a personal movie watchlist. Users can register and log in, authenticate using JWT, add movies to their watchlist, track their watching status, and rate movies. Built with Node.js, Express, and Prisma ORM.

---

## Features

- User registration and login with JWT authentication
- Add movies to a personal watchlist
- Track watching status: PLANNED, WATCHING, COMPLETED, DROPPED
- Rate movies and add notes
- Relational database managed with Prisma and PostgreSQL
- Protected routes using authentication middleware
- Rate Limiting / API Protection (per IP and per authenticated user using Redis in production)

---

## Tech Stack

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- Cookie-based authenitcation (HTTP-only)
- dotenv for environment variables
- Zod for validation
- Redis (used in production for caching and rate limiting)

---

## Security

This project is aligned with security best practices inspired by the OWASP Top 10, including:

- Input validation using Zod schemas
- Protection against unvalidated user input
- Secure authentication using JWT access & refresh tokens
- HttpOnly, Secure, and SameSite cookies
- Rate limiting on authentication routes
- Proper error handling without sensitive data exposure

---

## Getting Started

### 1. Clone the repository

Create a `.env` file with the following variables:

- DATABASE_URL=...
- JWT_SECRET=...
- JWT_REFRESH_SECRET=7d
- SEED_CREATOR_ID=...

### 2. Install dependencies

### 3. Set up environment variables

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Apply DB migrations

For local development:

```bash
npx prisma migrate dev
```

For production/deployment:

```bash
npx prisma migrate deploy
```

### 6. Start the server (Port 5001)

```bash
npm run dev
```

---

### Database seeding (optional)

Optionally, you can seed the database with initial movie data by running:

```bash
npm run seed:movies
```

---

### Testing

You may use well-reputed tools such as Requestly, ThunderClient, Postman etc.

---

## API Endpoints

**Auth**

- POST /auth/register
- POST /auth/login
- POST /auth/logout

**Watchlist**

- POST /watchlist
- PATCH /watchlist/:id
- DELETE /watchlist/:id

**Movies**

- GET /movies
- POST /movies
- PATCH /movies/:id
- DELETE /movies/:id

**User**

- GET /user/profile
- PATCH /user/profile
- DELETE /user/profile

Authentication is handled via HttpOnly cookies.

Authenticated requests automatically include the `access` token stored in cookies.  
No Authorization header is required.
