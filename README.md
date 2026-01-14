
# Flux – Real-Time Chat App

Flux is a lightweight real-time chat application where users can join rooms and communicate instantly. The app focuses on core WebSocket concepts without unnecessary complexity.

---

## ✨ Features

* Room-based real-time messaging
* Live typing indicator
* Auto-scroll to latest messages
* Session restore on page refresh
* Clean and responsive UI

---

## 🛠 Tech Stack

* **Frontend:** React, Tailwind CSS (CDN)
* **Backend:** Node.js, Express, Socket.io
* **Hosting:** Vercel (frontend), Render (backend)

---

## 🚀 Live Demo

* **App:** [https://flux-chat-seven.vercel.app](https://flux-chat-seven.vercel.app)
* **Backend:** [https://flux-backend-2gvg.onrender.com](https://flux-backend-2gvg.onrender.com)

---

## 📂 Project Structure

```
frontend/
  └── React app (UI + socket client)

backend/
  └── Express + Socket.io server
```

---

## ⚙️ How It Works

* Users enter a name and room ID
* Socket.io establishes a real-time connection
* Messages and typing events are broadcast within the room
* No database or authentication is used (intentionally kept simple)

---

## ▶️ Run Locally

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 Design Choices

* No database to keep focus on real-time communication
* Minimal state and clean component structure
* Simple deployment setup using Render and Vercel

---

## 📌 Note

Render free tier may take a few seconds to wake up on the first request.



