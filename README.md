# ♟️ Algebraic Chess

> ⚡ **Highlights for Interviewers**  
> 🔹 Full microservices app deployed to AWS EC2  
> 🔹 Secured with Nginx + HTTPS via Certbot  
> 🔹 Uses Kafka, Docker Compose, Elastic IP, and custom domain

A real-time, multiplayer chess application built with a microservices architecture. It supports human-vs-human (SOON!) and human-vs-bot gameplay using Stockfish, Kafka, and a modern web stack.

---

## 🌍 Live Production Deployment

This app is deployed to **AWS EC2** using **Docker Compose**, secured with **HTTPS via Nginx + Certbot**, and connected to a custom domain via **Namecheap DNS**.

- 🔐 **HTTPS-secured backend**: [https://chessbackend1324214.site](https://chessbackend1324214.site)
- 🛰️ **Microservices**: Backend, Bot, and Kafka (via Docker Compose)
- 🌐 **Frontend**: Hosted on Vercel – [https://algebric-chess.vercel.app](https://algebric-chess.vercel.app)

---

## 🌐 Tech Stack

### 🧩 Architecture
- **Microservices** powered by **Docker Compose**
- **Kafka** as a message broker for bot move processing
- **Backend** API using **Node.js + Express**
- **Bot Service** wrapping **Stockfish** chess engine for AI gameplay
- **Frontend** built with **React** (MVP state, needs improvement)

### 📦 Core Components

| Component        | Description                                |
|------------------|--------------------------------------------|
| `backend/`       | Main server handling game logic & sockets  |
| `bot-service/`   | Kafka consumer + Stockfish bot move engine |
| `frontend/`      | React-based frontend                       |
| `infra/`         | Docker Compose files (Kafka, backend, bot) |

---

## 🔧 Infrastructure

| Service            | Purpose                                   |
|--------------------|-------------------------------------------|
| **EC2 + Docker**   | Hosts backend & bot microservices         |
| **Nginx + Certbot**| HTTPS reverse proxy with free SSL         |
| **Kafka/Zookeeper**| Event-driven communication for moves      |
| **Vercel**         | Frontend deployment                       |
| **Namecheap DNS**  | Custom domain routing via Elastic IP      |

---

## 🛡️ CORS Handling

CORS is configured in the backend to allow only:
- `http://localhost:3000` (local dev)
- `https://algebric-chess.vercel.app` (production frontend)

No wildcard origins are permitted for security reasons.

---

## 🚀 Setup

> Make sure Docker is installed and running.

```bash
cd infra
docker compose up --build
```

### Alternative Dev Setup:

1. **Install dependencies**
```bash
npm install
cd bot-service && npm install
```

2. **Start Kafka**
```bash
# Start Kafka/Zookeeper on your host machine
```

3. **Start backend & frontend**
```bash
npm start
```

4. **Start bot service**
```bash
cd bot-service && npm start
```

---

## 📡 Kafka Integration

- The **backend** produces Kafka messages whenever a bot move is required.
- The **bot-service** consumes messages from Kafka, computes moves via Stockfish, and sends them back.

---

## 🐳 Docker

Each service has its own `Dockerfile`, managed via `infra/docker-compose.yml`.

To rebuild:
```bash
docker compose build
```

To shut down:
```bash
docker compose down
```

---

## 📘 What I Learned

- Deploying containerized microservices to **AWS EC2**
- Configuring **Nginx reverse proxy** with **free HTTPS certificates**
- Managing **Kafka** and event-based microservices in production
- Handling **CORS** for cross-origin requests between Vercel and EC2
- Tackling real-world cloud issues like **Elastic IPs** and DNS routing

---

## 🛠️ TODO

- [ ] Improve Frontend UI/UX
- [ ] Migrate backend to **AWS ECS Fargate**
- [ ] Add unit & integration tests
- [ ] Add matchmaking between two human players
- [ ] Complete real-time human-vs-human gameplay

---

## 📄 License

MIT © Raviv Gilady
