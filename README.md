# 💬 Real-Time Chat Application

A secure, scalable real-time chat application built with **Socket.IO**, **Firebase Authentication**, **MongoDB**, **Redis**, and **Kafka**. The project achieves **80%+ test coverage** using **Jest** and is containerized using **Docker**, with optional load balancing using **NGINX**.

---

## 🔧 Tech Stack

- **Frontend**: React.js + Firebase Authentication
- **Backend**: Node.js + Express + Socket.IO
- **Database**: MongoDB
- **Real-Time**: Redis (presence), Kafka (message streaming)
- **Authentication**: Firebase
- **Testing**: Jest (80%+ coverage)
- **Containerization**: Docker, Docker Compose
- **Load Balancer**: NGINX (Optional)

---

## 🚀 Features

- 🔐 Secure login via Firebase Authentication
- 💬 Real-time messaging using Socket.IO
- 🟢 Online/offline user status powered by Redis
- ✅ Message status (✓ delivered, ✓✓ seen)
- 🧪 80%+ test coverage using Jest
- 🐳 Docker support for consistent environments

---

## 📦 Local Setup (Without Docker)

### ✅ Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- Redis (locally installed or Docker)
- Kafka & Zookeeper (local or Docker)
- Firebase project and service account

---

### 1️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev

### Frontend Setup (React + Vite)

'''bash

cd frontend
npm install
npm run dev

### Run Frontend Tests
bash


cd frontend
npm test

## Generate Frontend Coverage
bash

cd frontend
npm run test:coverage

##Generates coverage files in:
frontend/coverage/
