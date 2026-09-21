# NRApp API Gateway

The NRApp API Gateway is a NestJS service that provides the public HTTP entry
point for the NRApp backend. It validates requests and access tokens, applies
common request controls, forwards calls to internal services, and proxies the
Chat Socket.IO connection.

## Responsibilities

- Routes REST traffic to Auth, User, Chat, Todo, Workschedule, and Canteen.
- Validates JWT access tokens through the Auth service introspection endpoint.
- Adds request IDs and signs the authenticated user payload before forwarding it
  to internal services.
- Applies DTO validation, role checks, a per-instance IP rate limit, and the
  shared exception/logging pipeline.
- Serves Swagger UI at `/api-docs` and liveness at `/health` or `/health/live`.
- Proxies both HTTP polling and WebSocket upgrades under `/socket.io` to Chat.

The Gateway is the client-facing boundary. Services should be reached through
this Gateway in normal application use.

## Routed service prefixes

| Prefix | Upstream responsibility |
| --- | --- |
| `/api/auth` | Registration, OTP login, Google login, token refresh, and account administration |
| `/api/user` | User profiles, directory data, and profile updates |
| `/api/chat` | Conversations, messages, and image uploads |
| `/api/todo` | Task creation, assignment, updates, status changes, and queries |
| `/api/workschedule` | Work schedules, HR requests, attendance, and attendance policy |
| `/api/canteen` | Menu, categories, tables, and cash canteen orders |
| `/socket.io` | Chat realtime transport |

The exact request and response contracts live in the controllers and DTOs under
`src/modules`. Swagger is the quickest way to inspect the Gateway-facing API.

## Request flow

```text
Client
  -> Gateway request ID and rate limit
  -> JWT introspection for protected routes
  -> controller DTO and role validation
  -> signed internal request to the selected service
  -> normalized response or structured upstream error
```

Public routes are marked with the `@Public()` decorator. Protected routes use the
Bearer access token and the role metadata declared by each controller. Internal
service URLs and shared signing secrets are supplied through environment
variables; they are never sent by the mobile client.

## Configuration

Copy `.env.example` to `.env` and set values for the environment. The important
settings are:

```env
PORT=3000
AUTH_SERVICE_URL=http://localhost:4000
USER_SERVICE_URL=http://localhost:5000
CHAT_SERVICE_URL=http://localhost:5002
TODO_SERVICE_URL=http://localhost:5003
WORKSCHEDULE_SERVICE_URL=http://localhost:5004
CANTEEN_SERVICE_URL=http://localhost:5005
JWT_SECRET=replace_with_at_least_32_random_bytes
CANTEEN_INTERNAL_SECRET=replace_with_a_long_random_shared_secret
```

`AUTH_INTERNAL_SECRET`, `USER_INTERNAL_SECRET`, `CHAT_INTERNAL_SECRET`,
`TODO_INTERNAL_SECRET`, and `WORKSCHEDULE_INTERNAL_SECRET` may be supplied when
an upstream uses a dedicated signing secret. If a dedicated secret is empty, the
Gateway keeps the existing JWT-secret compatibility path. The in-memory rate
limit defaults to 120 requests per 60 seconds per Gateway instance and can be
changed with `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS`.

The observability variables in `.env.example` control log format, log level,
trace export, and Swagger metadata. Do not commit a real `.env` file.

## Local development

The Gateway depends on the local Logger observability package. Keep the Logger
repository beside this repository in the backend directory, then run:

```bash
npm ci --prefix ../logger/packages/observability --no-audit --no-fund
npm ci
cp .env.example .env
npm run start:dev
```

Useful checks:

```bash
npm run lint
npm run format:check
npm test
npm run build
```

The default local Gateway address is `http://localhost:3000`; Swagger is at
`http://localhost:3000/api-docs`.

## CI/CD

`.github/workflows/ci.yml` calls the pinned reusable Node.js quality workflow in
[Logger](https://github.com/lethanh2006/Logger). It runs dependency and security
checks, lint, formatting, tests, and the build. A successful push to the default
branch triggers `.github/workflows/cd.yml`, which deploys the exact commit to the
VPS through the pinned reusable deployment workflow. See [.github/CI.md](.github/CI.md)
for the required repository secret and release details.
