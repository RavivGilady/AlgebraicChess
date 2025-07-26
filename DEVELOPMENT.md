# 🧪 Development Guide (Master Branch)

This guide documents how to set up and run the local development environment for the **monolithic** version of the Chess App (pre-microservices).

---

## 🚀 Getting Started

### 1. Create Required `.env` Files

Run the following command to auto-generate missing `.env` files from `.env.example`:

```bash
npm run setup
```

This will:
- Check `backend/.env` and `frontend/.env`
- Copy `.env.example` to `.env` if missing

> Make sure each directory (`backend` and `frontend`) has a `.env.example` committed.

---

### 2. Install Dependencies

Run in the root directory:

```bash
npm install
```

This will install both frontend and backend dependencies automatically.

---

### 3. Start the App

- **Backend**:
  ```bash
  npm start
  ```
- **Frontend**:
  ```bash
  npm start
  ```
  (Usually runs on `http://localhost:3000`)

Ensure the backend is running on `http://localhost:5000` or whichever port is set.

---

## 🔐 Environment Variables

Create `.env` files using the above `setup` script or manually.

### Backend `.env.example` (example contents):
```env
JWT_SECRET=your_jwt_secret_here
MONGO_URI=mongodb://localhost:27017/chess
```

Frontend may not require any env vars in this version.

---

## ⚠️ Troubleshooting

### ❌ No Response from Server?
It might be due to an **expired or invalid JWT token** in `localStorage`.

#### 🔧 Fix:
1. Open browser dev tools (F12).
2. Go to the **Application** tab → **Local Storage** → `localhost`.
3. **Delete the token** key.
4. Refresh the page — a new token should be generated.

---

## 🧠 Notes

- This version does **not** require Kafka.
- Only two components: frontend and backend.
- No Docker or microservices yet — this is the monolithic baseline.

---

## 🗂️ Next Steps

Microservice instructions will be added in the `microservices` branch once architecture is split.
