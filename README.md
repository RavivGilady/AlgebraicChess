# ♟️ Algebraic Chess

A real-time, multiplayer chess application built with a microservices architecture. It supports human-vs-human (SOON!) and human-vs-bot gameplay using Stockfish, Kafka, and a modern web stack.

---

## 🌐 Tech Stack

### 🧩 Architecture
- **Microservices** powered by **Docker Compose**
- **Kafka** as a message broker for bot move processing
- **Backend** API using **Node.js + Express**
- **Bot Service** wrapping **Stockfish** chess engine for AI gameplay
- **Frontend** Usin React – Needs to improve (currently basic for MVP)

### 📦 Core Components

| Component      | Description                                |
|----------------|--------------------------------------------|
| `backend/`     | Main server handling game logic & sockets  |
| `bot-service/` | Kafka consumer + Stockfish bot move engine |
| `frontend/`    | Frontend in React(                         |
| `infra/`       | Docker Compose files (Kafka, backend, bot) |
| Kafka/Zookeeper| Messaging system (via Docker)              |

---

## 🚀 Setup

> Make sure Docker is installed and running.

```
cd infra
docker compose up --build
```
> Alternatively, you can start services manually for development:
### 1. Install dependencies

```
npm install
cd bot-service && npm install
```
### 2. Start Kafka

Start Kafka on your host (no matter how you'd like it)


### 3. Start full environment (backend + frontend + bot)

Start backend + frontend:

```
npm start
```

Start bot service:

```
cd bot-service && npm start
```

---

## 📡 Kafka Integration

- The **backend** sends a message to Kafka whenever a bot move is needed.
- The **bot-service** listens to the Kafka topic, calculates the move using Stockfish, and sends it back to the server.

---

## 🐳 Docker

Each service has its own Dockerfile and is managed via `infra/docker-compose.yml`.

To rebuild images when code changes:

```
docker compose build
```

To shut everything down:

```
docker compose down
```

---

## 🛠️ TODO

- [ ] Improve Frontend sigificantly
- [ ] Deploy using AWS Fargate
- [ ] Unit and integration testing
- [ ] Add matchmaking between two people
- [ ] Complete support for live game between two people

---

## 📄 License

MIT © Raviv Gilady
