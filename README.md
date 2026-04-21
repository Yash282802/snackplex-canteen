# 🍕 SnackPlex: Smart Canteen Management System

**SnackPlex** is a state-of-the-art, full-stack canteen management application built for **GSFC University**. It provides a seamless, "Swiggy-like" experience for students and staff, featuring real-time order tracking, AI analytics, and secure digital payments.

---

## 🚀 Key Features

### 👨‍🎓 For Students
*   **Smart Menu**: Browse categories (Hot, Veg, Drinks, etc.) with real-time availability.
*   **Live Status**: View current canteen occupancy and order queue status.
*   **Digital Checkout**: Secure payments powered by Razorpay.
*   **Instant Notifications**: Order confirmation and delivery alerts via Email.

### 👨‍🍳 For Staff
*   **Admin Dashboard**: Real-time order queue management.
*   **Status Workflow**: Update orders from `placed` → `preparing` → `ready` → `delivered`.
*   **Stock Management**: Track and update menu inventory instantly.
*   **AI Analytics**: Visualized stats for daily revenue and order trends.

---

## 🛠️ Technology Stack

### Frontend (`/foodplex`)
*   **Framework**: Next.js 16 (App Router)
*   **Styling**: Tailwind CSS 4
*   **Animations**: Framer Motion & GSAP
*   **State Management**: React Context API (Auth, Cart, Orders)
*   **Icons**: Lucide React

### Backend (`/backend`)
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB Atlas (Mongoose)
*   **Security**: Helmet, Express Rate Limit, bcrypt
*   **Auth**: JWT (JSON Web Tokens) with HTTP-Only Cookies
*   **Payments**: Razorpay Node SDK

---

## 📁 Project Structure

```text
canteen-website/
├── foodplex/           # Next.js Frontend
│   ├── app/           # App Router pages & API routes
│   ├── components/    # UI & Section components
│   └── lib/           # Contexts, Hooks & Data
├── backend/            # Express.js Backend
│   ├── controllers/   # Business logic
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API endpoints
│   └── server.js      # Entry point
└── DEPLOYMENT.md       # Full hosting guide
```

---

## ⚡ Quick Start

### 1. Prerequisites
*   Node.js (v20+)
*   MongoDB Atlas Account
*   Razorpay Account (for testing/live)
*   Gmail App Password (for email alerts)

### 2. Setup Backend
```bash
cd backend
npm install
# Add your variables to .env
npm start
```

### 3. Setup Frontend
```bash
cd foodplex
npm install
# Add your variables to .env.local
npm run dev
```

---

## 🌐 Hosting

*   **Frontend**: Hosted on [Netlify](https://www.netlify.com/)
*   **Backend**: Hosted on [Render](https://render.com/)
*   **Database**: Managed on [MongoDB Atlas](https://www.mongodb.com/)

For detailed deployment steps, please refer to the **[DEPLOYMENT.md](file:///c:/Users/Sanndy/Desktop/Canteen%20Website/DEPLOYMENT.md)** guide.

---

## 🔒 Security
The system is built with high-priority security measures:
*   🔑 **JWT Auth**: Secure session management.
*   🛡️ **Helmet**: Protection against common web headers vulnerabilities.
*   🚦 **Rate Limiting**: Protection against DoS and brute-force attacks.
*   🔒 **Secure Cookies**: Cross-site security for production environments.

---

Developed with ❤️ for **GSFC University**.
