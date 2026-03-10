# JWT Web Application — Cryptography and Network Security

A full-stack **web application that implements JSON Web Token (JWT)** for authentication and role-based authorization. Users sign up or sign in to receive a JWT; protected API routes require the token in the `x-access-token` header.

---

## Table of Contents

- [Overview](#overview)
- [Diagrams](#diagrams)
- [Features](#features)
- [How JWT Is Used](#how-jwt-is-used)
- [Tech Stack](#tech-stack)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Setup & Run](#setup--run)
- [References](#references)

---

## Overview

| Item | Description |
|------|-------------|
| **Assignment** | Develop a web application that implements JSON Web Token |
| **Course** | Cryptography and Network Security (BCSE309L) |
| **Slot** | L1+L2 |

This project implements:

1. **User registration** — Sign up with username, email, password; optional roles (user, moderator, admin).
2. **User login** — Sign in with username and password; server returns a **JWT (access token)**.
3. **Token-based authentication** — Frontend stores the JWT and sends it in the `x-access-token` header for protected routes.
4. **Role-based authorization** — Some routes require specific roles; the server validates the JWT and checks roles from the database.

---

## Diagrams

The following flowcharts and sequence diagrams are included below.

| Diagram | Description |
|---------|-------------|
| **JWT Auth Flow** | High-level flowchart: sign in → token → verify. |
| **JWT Request Sequence** | Sequence diagram: Client ↔ Server ↔ Database. |
| **JWT Structure** | JWT three parts: header, payload, signature. |
| **Project Structure** | Application layers: Frontend, Backend, Data. |

### 1. JWT authentication flow

```mermaid
flowchart LR
    A[User Signs In] --> B[Server Validates]
    B --> C[Server Signs JWT]
    C --> D[Client Stores Token]
    D --> E[Client Sends Token in Header]
    E --> F[Server Verifies JWT]
    F --> G[Allow or Deny Request]
```

*Source: `docs/jwt-auth-flow.mmd`*

### 2. JWT request sequence (Client – Server – Database)

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant S as Server (Express)
    participant D as Database (Supabase)

    Note over C,D: Sign In
    C->>S: POST /api/auth/signin (username, password)
    S->>D: Find user, verify password
    D-->>S: User + roles
    S->>S: Sign JWT (id, secret, expiry)
    S-->>C: 200 + accessToken, id, username, email, roles

    Note over C,D: Protected Request
    C->>S: GET /api/test/user + Header: x-access-token: JWT
    S->>S: Verify JWT signature & exp
    S->>D: Load user roles by decoded id
    D-->>S: Roles
    S->>S: Check role (if required)
    S-->>C: 200 + response (or 403)
```

*Source: `docs/jwt-request-sequence.mmd`*

### 3. JWT structure (header.payload.signature)

```mermaid
flowchart LR
    subgraph JWT["JWT"]
        H[Header] --> P[Payload] --> S[Signature]
    end
    H -.-> H2["alg, typ\n(base64url)"]
    P -.-> P2["id, iat, exp\n(base64url)"]
    S -.-> S2["HMAC-SHA256\n(secret)"]
```

*Source: `docs/jwt-structure.mmd`*

### 4. Project structure (layers)

```mermaid
flowchart TB
    subgraph Frontend["Frontend (React + Vite)"]
        UI[Pages & Components]
        API[API Client]
        AUTH[Auth Context]
        UI --> API
        UI --> AUTH
        API --> AUTH
    end

    subgraph Backend["Backend (Node + Express)"]
        R[Routes]
        MW[Middleware: authJwt]
        CTRL[Controllers]
        R --> MW
        MW --> CTRL
    end

    subgraph Data["Data"]
        DB[(Supabase / PostgreSQL)]
        CTRL --> DB
    end

    API -->|"HTTP + x-access-token"| R
```

*Source: `docs/project-structure.mmd`*

---

## Features

| Feature | Description |
|--------|-------------|
| **Sign up** | Register with username, email, password; optional roles. |
| **Sign in** | Get JWT and user info (id, username, email, roles). |
| **Dashboard** | Call public and protected endpoints; see responses. |
| **Profile** | View account and token; copy token; see expiry. |
| **JWT Decoder** | Paste a JWT; decode header and payload (client-side). |
| **API Reference** | List of all endpoints and auth requirements. |
| **Security** | Short notes on JWT and auth best practices. |

---

## How JWT Is Used

| Step | Description |
|------|-------------|
| 1. **Sign up** | User registers; credentials and roles are stored in the database (Supabase/PostgreSQL). Passwords are hashed with bcrypt. |
| 2. **Sign in** | User submits username and password; server verifies credentials and issues a **JWT** (signed with a secret, expiry e.g. 24h). |
| 3. **Store token** | Frontend stores the JWT (e.g. in `localStorage`) and attaches it to subsequent API requests. |
| 4. **Protected requests** | For routes like `/api/test/user`, `/api/test/mod`, `/api/test/admin`, the client sends the JWT in the `x-access-token` header. |
| 5. **Server validation** | Backend verifies the JWT signature and expiry, reads the user id from the token, loads roles from the DB, and allows or denies access. |

---

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| **Backend** | Node.js, Express, **jsonwebtoken** (JWT), bcryptjs, Sequelize, Supabase (PostgreSQL) |
| **Frontend** | React, TypeScript, Vite; JWT stored and sent via `x-access-token` |
| **Database** | Supabase (PostgreSQL) |

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register (username, email, password, optional roles). |
| POST | `/api/auth/signin` | No | Login; returns JWT + user info (id, username, email, roles). |
| GET | `/api/test/all` | No | Public content (no JWT). |
| GET | `/api/test/user` | JWT required | User content (any authenticated user). |
| GET | `/api/test/mod` | JWT + moderator/admin | Moderator content. |
| GET | `/api/test/admin` | JWT + admin | Admin content. |

---

## Project Structure

```
├── app/
│   ├── config/          # DB and auth config
│   ├── controllers/     # auth, user
│   ├── middleware/      # authJwt, verifySignUp
│   ├── models/          # User, Role (Sequelize)
│   └── routes/          # auth, user routes
├── frontend/            # React + Vite app
│   └── src/
│       ├── components/  # Layout, Dashboard, AuthPanel, UI
│       ├── context/     # AuthContext
│       ├── lib/         # API client
│       └── pages/       # Home, Profile, JWT Decoder, API Ref, Security
├── docs/                # Diagram sources
│   ├── jwt-auth-flow.mmd
│   ├── jwt-request-sequence.mmd
│   ├── jwt-structure.mmd
│   └── project-structure.mmd
├── server.js
├── .env.example
└── README.md
```

---

## Setup & Run

### Backend (project root)

```bash
npm install
```

Create a `.env` with your Supabase database URL (see `.env.example`):

```
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@...supabase.com:6543/postgres
```

### Frontend

```bash
cd frontend && npm install
```

### Run (two terminals)

| Terminal | Command | URL |
|----------|---------|-----|
| 1 (backend) | `npm start` | API: http://localhost:8080 |
| 2 (frontend) | `npm run dev:frontend` or `cd frontend && npm run dev` | App: http://localhost:8081 |

Open **http://localhost:8081** in the browser to use the application.

---

## References

- [JWT.io – Introduction to JSON Web Tokens](https://jwt.io/introduction)
- [Node.js JWT Authentication example (Mishti)](https://Mishti.com/node-js-jwt-authentication-mysql/)

---

**Name:** Mishti Mattu  
**Registration Number:** 23BCE1067
