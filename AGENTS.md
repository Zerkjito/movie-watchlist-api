# AGENTS.md

> Guidance for agentic contributors to the Movie Watchlist API

---

## Project Overview

This repository is a RESTful API for managing personal movie watchlists. Built with Node.js, Express, Prisma ORM, PostgreSQL, Zod, and JWT-based authentication. Security best practices are emphasized, including rate limiting, secure cookies, input validation, and structured error handling.

## Build, Lint, and Test Workflow

**Installation and Setup:**
- Install dependencies: `npm install`
- Generate Prisma Client: `npx prisma generate`
- Apply DB migrations ([34mlocal): `npx prisma migrate dev`
- Apply DB migrations (prod): `npx prisma migrate deploy`
- Seed example movies: `npm run seed:movies`
- Start server (port 5001): `npm run dev`

**Linting:**
- Run linter: `npm run lint`
- Lint scope: All source code in `src/` (uses ESLint default + `eslint-plugin-secure-coding`)
- Fix lint errors (where auto-fixable): `eslint src --fix`

**Testing:**
- Automated test script not implemented. `npm test` will exit with error. Add manual tests using tools like Postman or ThunderClient.
- Testing recommendation for agents:
  - When adding new logic, implement automated tests in future upgrades using Jest or Mocha.
  - For now, test endpoints manually via API clients.

**Single Test Run Command (recommended pattern):**
> 🟡 Automated test infrastructure is missing. Standardize with Jest or Mocha for automated single-test runs. E.g.,
> `npx jest src/api/[file].test.js -t "should return 200"`

## Code Style Guidelines

### Imports
- Use ES Module imports: `import x from 'y'`
- Group imports by origin: node core, npm packages, local modules
- Place import statements at the top of the file

### Formatting
- Indent with 2 spaces or project convention (prefer 2)
- Use single quotes `'` for strings, except for JSON
- Trailing commas in multi-line objects/arrays: yes
- Semicolons: required
- Max line length: 100 characters (recommended; not enforced)

### Types and Structure
- Use explicit types/conventions in JSDoc or TypeScript (if integrated)
- Prefer object destructuring for parameters and returns
- All environment variables should be validated on startup (see `.env` management)
- Use Zod for request body validation
- Database access should use Prisma ORM (no raw SQL unless necessary)

### Naming Conventions
- Use camelCase for variables, functions, parameters
- Use PascalCase for classes and constructors
- Use CONSTANT_CASE only for environment variables
- Name files for their export, e.g., `authController.js`

### Error Handling
- All errors must be caught and handled
- Avoid exposing stack traces or sensitive details to API consumers
- On Express routes, respond with structured error messages:
  ```js
  res.status(400).json({ error: 'Description here' })
  ```
- Use centralized error middleware for generic error formatting
- Input validation errors must use Zod's error reporting
- Log unexpected errors internally (e.g., to console or monitoring)

### Secure Coding (ESLint Plugin)
- Never trust user input; always validate
- Use parameterized queries with Prisma
- Prevent XSS/SQL injection through strong validation and escaping
- Ensure JWT secrets and DB credentials are NOT hardcoded
- Use https and secure cookies in production

---

## Environment Variables
- All secrets and URLs live in `.env`. See README for the full list:
  - DATABASE_URL
  - NODE_ENV
  - JWT_SECRET, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
  - SEED_CREATOR_ID
- Never commit `.env` to git

## Dependency Conventions
- Prefer officially supported libraries for authentication, crypto, and DB
- Use `zod` for schema validation
- Use `dotenv` for environment variables
- Prefer `helmet` for HTTP header security
- Use `express-rate-limit` and `rate-limit-redis` for throttling

## API Endpoint Conventions
- RESTful path naming: `/auth`, `/users/me`, `/movies`, `/watchlist`
- Authenticated endpoints require cookie-based JWT access token
- Respond with standard codes: 200 success, 400 invalid input, 401/403 unauthorized, 404 not found

## Task Management for Agents
- Always lint and format code before submitting
- Document all API changes in README.md
- When adding new features, also update AGENTS.md and README.md as necessary
- Run server after changes to verify boot success: `npm run dev`
- Manual tests: use API platform (Postman, ThunderClient) for new logic

## Security Rules Summary
- Input must be validated via Zod
- Do not log sensitive information
- Authenticate users with JWT tokens via HttpOnly cookies
- Test and enforce rate limits

---

## How to Add Automated Tests (Recommended for Agents)
- Add testing framework: `npm install --save-dev jest supertest`
- Create a `tests/` folder or add `*.test.js` files in `src/`
- Example test script in package.json:
  ```json
  "scripts": {
    "test": "jest"
  }
  ```
- Example single test run: `npx jest src/path/to/file.test.js -t "test name"`

---

## Notes for Code-Generating Agents
- Strictly follow code style and secure coding guidelines above
- Do not expose secrets or sensitive info in code, logs, or errors
- Prefer official libraries and regular dependency updates
- Leave TODO comments for manual testing due to current lack of automated test infrastructure
- If automated test infra is added, leverage single test run commands for efficient CI/CD flows
- Always prefer small, incremental PRs with clear scope

---

Happy contributing - maintain security, style, and reliability at all times!