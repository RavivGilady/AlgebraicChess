# 🧪 Development Guide

This guide documents how to set up and run the local development environment for the Chess App.

---

## 🚀 Getting Started

### 1. Create Required `.env` Files

Run the following command to auto-generate missing `.env` files from `.env.example`:

```bash
npm run setup
```

This will:
- Check for `.env` in `server-service/`, `frontend/`, and `bot-service/`
- If `.env` is missing but `.env.example` exists, it will copy it
- Ensure all services have what they need

> Make sure each directory has a `.env.example` committed.

For `server-service`, the `.env.example` includes a `MONGO_URI` entry:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
KAFKA_BROKER_URL=localhost:9092
# Local Mongo
MONGO_URI=mongodb://127.0.0.1:27017/chess_app
# Docker Compose Mongo service
# MONGO_URI=mongodb://mongo:27017/chess_app
```

---

### 2. Install Dependencies

From the root directory:

```bash
npm install
```

This will install frontend, server-service, and bot-service dependencies using the `preinstall` script.

---

### 3. Start the App (Local Mode)

Runs all services via `npm` directly (not Docker): **Note that you need to have kafka working and setting up all env variables as needed, see steps below**

```bash
npm start
```

Runs:
- **Frontend** → http://localhost:3000  
- **Server-Service** → http://localhost:5000  
- **Bot-service** → Runs locally and connects to Kafka

To run/debug services individually:

```bash
npm run start:server
npm run start:frontend
npm run start:bot
```

---

## 🔧 NPM Scripts Reference

These scripts help you run the app in development mode. Kafka must be running separately (see next section).

### 🧪 Dev Commands

| Command              | Description                                                   |
|----------------------|---------------------------------------------------------------|
| `npm start`          | Start all services concurrently (frontend, server, bot)      |
| `npm run start:server` | Start server service                                        |
| `npm run start:frontend`| Start frontend service                                       |
| `npm run start:bot`     | Start bot-service                                            |
| `npm run debug`         | Start all services in debug mode                            |
| `npm run setup`         | Generate `.env` files if missing from `.env.example`        |
| `npm install`           | Install dependencies for all services                       |
| `npm run kafka:standalone` | Start Kafka + ZooKeeper using `docker-compose.kafka.yml` |
| `npm run dev-down`      | Stop Kafka (and ZooKeeper) and remove volumes               |

---

## 🐘 Kafka and Docker Usage (Microservices Only)

### Option A – Run Kafka Only (for local dev using `npm`)

Use this when developing services locally (`npm start`) but still needing Kafka.

#### 🧪 Start Kafka & ZooKeeper only:
```bash
npm run kafka:standalone
```

This will:
- Start Kafka and ZooKeeper using `docker-compose.kafka.yml`
- Expose Kafka on `localhost:9092` (or your VM IP)

> ⚠️ You may need to edit `KAFKA_ADVERTISED_LISTENERS` in `docker-compose.kafka.yml` to match your **VM IP** (e.g. `192.168.80.128`)

#### 🛑 To stop cleanly:
```bash
npm run dev-down
```

This shuts down Kafka and ZooKeeper and clears volumes (important!).

Make sure your services use the correct Kafka address in their `.env`:
```env
KAFKA_BROKER_URL=192.168.80.128:9092
```

---

### Option B – Run All Services with Docker Compose

Run full system using Docker (Kafka, server-service, frontend, bot-service, Mongo, etc):

```bash
docker compose -f infra/docker-compose.yml up --build
```

Ensure `server-service` has `MONGO_URI` set to `mongodb://mongo:27017/chess_app` when using the bundled Mongo container.

🛑 If you run into issues, shut everything down cleanly:
```bash
docker compose -f infra/docker-compose.yml down -v
```

This prevents ZooKeeper/Kafka state errors like:
```
KeeperErrorCode = NodeExists
```

---

## 🔐 Environment Variables

Example contents for each service:  
(Might not be updated! Check `.env.example` in each service folder.)

### 📁 server-service/.env.example
```env
JWT_SECRET=your_jwt_secret_here
MONGO_URI=mongodb://localhost:27017/chess
KAFKA_BROKER_URL=localhost:9092
```

### 📁 bot-service/.env.example
```env
KAFKA_BROKER_URL=localhost:9092
STOCKFISH_PATH=./stockfishBinary/stockfish-windows-x86-64-avx2.exe
```

### 📁 frontend/.env.example
```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

---

## 🔒 Authentication System (AuthContext)

The app uses a custom React Context (`AuthContext`) to manage user authentication globally.

---

### 🧠 How It Works

- The `AuthProvider` component wraps the entire app inside `App.js`
- It uses React hooks (`useContext`, `useState`, `useMemo`) to manage and expose auth state
- It reads the JWT token from `localStorage` on load

---

### 🌍 What It Stores

| Variable    | Description                                                                 |
|-------------|-----------------------------------------------------------------------------|
| `token`     | JWT string stored in `localStorage` and React state                         |
| `setToken`  | Function to update the token (login/logout)                                 |
| `username`  | Decoded from the JWT payload (uses `atob` on the middle part of the token)  |
| `serverUrl` | The server-service base URL from `.env` (`REACT_APP_API_BASE_URL`)                 |

---

### 🧪 Using Auth in Components

To access the auth state in any component:

```js
import { useAuth } from '../../context/AuthContext';

const { token, setToken, username, serverUrl } = useAuth();
```

---

### 🛡️ Route Protection

The `PrivateRoute` component uses `useAuth()` to block unauthenticated users:

```jsx
const PrivateRoute = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
```

---

### ⚠️ Notes

- The JWT is decoded with `atob()` but **not validated** (e.g. no signature or expiration checks)
- You can plug in a real JWT library if you need secure decoding and validation
- This is a lightweight solution good for local and dev use

---

## ⚠️ Troubleshooting

| Problem                                  | Cause                                                | Solution                                                               |
|------------------------------------------|-------------------------------------------------------|------------------------------------------------------------------------|
| ❌ No response from server                | Expired/invalid JWT token in localStorage            | Dev Tools → Application → Local Storage → delete token → refresh       |
| 🐘 Kafka `NodeExistsException` error     | Stale ZooKeeper state (from unclean Kafka shutdown)  | Run `docker compose -f infra/docker-compose.yml down -v`               |
| 🛑 Port conflicts or Kafka not reachable | Forgot to stop Docker before switching to local mode | Run `docker compose -f infra/docker-compose.yml down` before switching |

---

## 🧠 Notes

- All `.env` creation is handled via `npm run setup`
- The project supports both full Docker and mixed local/Docker dev environments

---

