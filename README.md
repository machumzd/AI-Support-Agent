# Minimal AI Customer Support Agent

A full-stack AI-powered customer support chat application built with **React (Vite)**, **Node.js / Express**, **MongoDB**, and **OpenRouter** (Llama 3.3).

The application allows users to sign up, log in, chat with an AI customer support assistant in real time, and persist conversation history on a per-user basis.

---

## 🚀 Live Demo

- **Frontend (Deployed on Vercel)**: [https://ai-support-mzd.vercel.app/](https://ai-support-mzd.vercel.app/)

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Markdown
- **Backend**: Node.js, Express, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, `express-rate-limit`, `helmet`
- **Database**: MongoDB (Atlas or local)
- **AI Provider**: OpenRouter API (`meta-llama/llama-3.3-70b-instruct:free`) with local fallback handler
- **Containerization**: Docker & Docker Compose (multi-stage builds, Nginx reverse proxy)

---

## Project Structure

```
ai-customer-support-agent/
├── client/                     # React Vite Frontend
│   ├── src/
│   │   ├── api/client.js       # Axios instance with auth interceptors
│   │   ├── components/
│   │   │   ├── Auth/           # Login & Signup views
│   │   │   ├── Chat/           # ChatArea, MessageBubble, Input, Sidebar, TypingIndicator
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # Auth state & token storage
│   │   │   └── ChatContext.jsx # Message state & send/clear actions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── server/                     # Express REST API
│   ├── src/
│   │   ├── config/             # DB & env configuration
│   │   ├── controllers/        # authController & chatController
│   │   ├── middleware/         # authMiddleware (JWT), rateLimiter, errorHandler
│   │   ├── models/             # User & ChatMessage schemas
│   │   ├── routes/             # /auth and /chat routers
│   │   ├── services/           # OpenRouter LLM integration
│   │   └── app.js
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml          # Mongo + Server + Client orchestration
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local instance or MongoDB Atlas connection string)
- (Optional) OpenRouter API key from [openrouter.ai](https://openrouter.ai/keys)

> **Note**: If you don't have an OpenRouter API key, the backend automatically uses a built-in customer support fallback handler that answers common questions (refunds, tracking, passwords, pricing) so the entire flow can be tested out-of-the-box.

---

### Method 1: Local Development

#### 1. Setup Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The backend starts on `http://localhost:5000`.

#### 2. Setup Frontend

In a separate terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

### Method 2: Running with Docker Compose

To spin up MongoDB, the Express backend, and the React frontend in containers:

```bash
docker compose up --build
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **MongoDB**: `localhost:27017`

To stop:
```bash
docker compose down -v
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | Public | Register new user (`name`, `email`, `password`) |
| `POST` | `/auth/login` | Public | Log in user, returns JWT and user profile |
| `GET` | `/auth/me` | Protected | Returns current user profile |

### Chat

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/chat/send` | Protected | Sends user message, generates AI reply, saves both to DB |
| `GET` | `/chat/history` | Protected | Fetches authenticated user's conversation history |
| `DELETE` | `/chat/history` | Protected | Clears authenticated user's conversation history |

### Health Check

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Returns server status and uptime |

---

## Architecture & Implementation Details

1. **Authentication & Password Security**:
   - Passwords are salted and hashed using `bcryptjs` (10 rounds) before saving to MongoDB via a Mongoose pre-save hook.
   - JWT tokens are signed with user ID and verified on protected endpoints (`/chat/*`, `/auth/me`).
   - Axios request interceptor attaches the Bearer token automatically; 401 responses trigger a clean session logout.

2. **Chat & Context Memory**:
   - Each message in MongoDB is scoped by `userId` and indexed with `{ userId: 1, createdAt: 1 }` for query performance.
   - On `/chat/send`, the backend queries the last 8 conversation turns to provide sliding-window context to the LLM prompt.

3. **Bonus Features Implemented**:
   - **Typing Indicator**: Animated dots and assistant status displayed on the UI while awaiting the model's reply.
   - **Rate Limiting**: Configured with `express-rate-limit` (general API limiter, stricter auth route limiter, and chat limiter).
   - **Environment Switching**: Centralized `env.js` config with `.env.example` templates across root, client, and server.

---

## Trade-offs & Production Considerations

If scaling this beyond a take-home assessment, here are the architectural improvements I would prioritize:

1. **Streaming Responses (SSE / WebSockets)**:
   - Currently, `/chat/send` waits for the full LLM completion before returning the response. In production, streaming tokens via Server-Sent Events (SSE) provides a significantly lower perceived latency (TTFT).
2. **Refresh Token Rotation**:
   - Tokens currently use standard 7-day expiration. A production setup would use short-lived access tokens (15m) in memory and httpOnly refresh cookies with rotation.
3. **Pagination / Infinite Scroll for History**:
   - Currently loads user messages in full. For high-volume chats, cursor-based pagination (`limit` & `before` timestamp) prevents heavy initial payloads.
4. **Conversation Threading**:
   - Grouping messages by `sessionId` or `conversationId` rather than a single flat history per user.
5. **Distributed Rate Limiting**:
   - Switch from in-memory `express-rate-limit` to Redis-backed store (`rate-limit-redis`) for multi-instance deployments.

---

## Deployment

- **Live Application**: [https://ai-support-mzd.vercel.app/](https://ai-support-mzd.vercel.app/)
- **Database**: MongoDB Atlas Free Tier
- **Frontend Hosting**: Vercel (Vite React app with build output `dist`, API proxy via `VITE_API_URL`)
- **Backend Hosting**: Render.com / Railway (`server/` directory, `npm start`)

---

## License
MIT
