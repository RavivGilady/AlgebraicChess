# 🧪 Development Guide (Master Branch)

This guide documents how to set up and run the local development environment for the **monolithic** version of the Chess App (pre-microservices).

---

## 🚀 Getting Started

### 1. Install Dependencies
Run in both frontend and backend directories:
```bash
npm install
```

---

### 2. Start the App

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
