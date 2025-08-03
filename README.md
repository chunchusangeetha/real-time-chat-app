# Real-Time Chat Application

A secure, scalable real-time chat application built with **Socket.IO**, **Firebase Authentication**, **MongoDB**, **Redis**, and **Kafka**. The project includes 80%+ test coverage using **Jest**, and is containerized using **Docker** with **NGINX** as a load balancer.

## 🔧 Tech Stack

- **Frontend**: React.js + Firebase Auth
- **Backend**: Node.js + Express + Socket.IO
- **Database**: MongoDB
- **Real-Time**: Redis for presence, Kafka for message streaming
- **Testing**: Jest (80%+ coverage)
- **Deployment**: Docker, Docker Compose, GitHub Actions
- **Load Balancer**: NGINX or AWS ALB

## 🚀 Features

- 🔐 Login with Firebase
- 💬 Real-time chat with Socket.IO
- 🟢 Online/offline status via Redis
- ✅ Message status (✓ delivered, ✓✓ seen)
- 📊 Test coverage over 80%

## 📦 Local Setup

### Prerequisites
- Node.js
- Docker & Docker Compose
- Firebase project setup

### Run Locally (Without Docker)

```bash
cd backend
npm install
npm run dev

cd ../frontend
npm install
npm run dev
