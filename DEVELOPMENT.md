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
- Check for `.env` in `backend/`, `frontend/`, and `bot-service/`
- If `.env` is missing but `.env.example` exists, it will copy it
- Ensure all services have what they need

> Make sure each directory has a `.env.example` committed.

---

### 2. Install Dependencies

From the root directory:

```bash
npm install
```

This will install frontend, backend, and bot-service dependencies using the `preinstall` script.

---

### 3. Start the App (Local Mode)

Runs all services via `npm` directly (not Docker):

```bash
npm start
```

Runs:
- **Frontend** → http://localhost:3000
- **Backend** → http://localhost:5000
- **Bot-service** → localhost port defined in service code

To run/debug services individually:

```bash
npm run start:backend
npm run start:frontend
npm run start:bot
```

---

## 🧩 Kafka and Docker Usage (Microservices Only)

### Option A – Run Kafka Only (for local dev using `npm`)

Use this when developing services locally (`npm start`) but still needing Kafka.

#### 🧪 Start Kafka & ZooKeeper only:
```bash
docker compose -f docker-compose.kafka.yml up -d
```

This will:
- Start Kafka and ZooKeeper
- Expose Kafka on `localhost:9092` (for your VM or host OS)

> ⚠️ You may need to edit `KAFKA_ADVERTISED_LISTENERS` in `docker-compose.kafka.yml` to match your **VM IP** (e.g. `192.168.80.128`)

#### 🛑 To stop cleanly:
```bash
docker compose -f docker-compose.kafka.yml down -v
```
Always use `-v` to avoid stale ZooKeeper state.

Then start your services as usual:
```bash
npm start
```

Set Kafka env in your `.env` files:
```env
KAFKA_BROKER_URL=192.168.80.128:9092
```

---

### Option B – Run All Services with Docker Compose

Run full system using Docker (Kafka, backend, frontend, bot-service, Mongo, etc):

```bash
docker compose -f infra/docker-compose.yml up --build
```

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

Example contents for each service: (Might not be updated! check .env.example in each service folder!)

### 📁 backend/.env.example
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

## ⚠️ Troubleshooting

| Problem                                  | Cause                                                | Solution                                                               |
| ---------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| ❌ No response from server                | Expired/invalid JWT token in localStorage            | Dev Tools → Application tab → Local Storage → delete token → refresh   |
| 🐘 Kafka `NodeExistsException` error     | Stale ZooKeeper state (from unclean Kafka shutdown)  | Run `docker compose -f infra/docker-compose.yml down -v`               |
| 🛑 Port conflicts or Kafka not reachable | Forgot to stop Docker before switching to local mode | Run `docker compose -f infra/docker-compose.yml down` before switching |


---

## 🧠 Notes

- All `.env` creation is handled via `npm run setup`
- You can use this project in full Docker mode or with local dev + Kafka
- The master branch is monolithic (no Kafka), while the `microservices` branch includes Kafka and service separation

---

## 🗂️ Branch Notes

| Branch           | Description                    |
|------------------|--------------------------------|
| `master`         | Monolithic (frontend + backend) |
| `microservices`  | Kafka + bot-service split       |

---
