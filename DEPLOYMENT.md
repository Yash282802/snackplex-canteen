# 🚀 Deployment Guide: Canteen Website (SnackPlex)

This guide provides step-by-step instructions for hosting your full-stack canteen application for production.

## 📋 Pre-Deployment Checklist
- [ ] **Razorpay**: Switch to **Live Mode** in your dashboard and get `rzp_live_...` keys.
- [ ] **MongoDB**: Ensure your [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster is accessible (IP Whitelist: `0.0.0.0/0` for Render).
- [ ] **Email**: Verify your Gmail App Password is still active.

---

## 1. 🌐 Frontend Hosting (Netlify)

1. **Connect Repository**: Push your code to GitHub. Login to [Netlify](https://www.netlify.com/) and click **"Add new site"** > **"Import from Git"**.
2. **Configure Build Settings**:
   - **Base directory**: `foodplex`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
3. **Environment Variables**: Add these in Netlify (Site Settings > Environment variables):
   - `NEXT_PUBLIC_API_URL`: Your Backend URL (e.g., `https://snackplex-api.onrender.com`)
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Your Razorpay Live Key ID.
   - `NEXT_PUBLIC_VENDOR_EMAIL`: `ytiwari2721@gmail.com`
   - `EMAIL_USER`: `ytiwari2721@gmail.com`
   - `EMAIL_PASS`: Your Gmail App Password.

---

## 2. ⚙️ Backend Hosting (Render)

1. **New Web Service**: Login to [Render](https://render.com/), click **"New +"** > **"Web Service"**.
2. **Connect Repository**: Select your GitHub repo.
3. **Configure Settings**:
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. **Environment Variables**: Add these in Render (Advanced > Add Environment Variable):
   - `PORT`: `10000` (Render default)
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB Atlas URI.
   - `JWT_SECRET`: A complex random string.
   - `STAFF_SECRET`: `GSFC_STAFF_2026`
   - `RAZORPAY_KEY_ID`: Your Razorpay Live Key ID.
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Live Secret Key.
   - `FRONTEND_URL`: Your Netlify URL (e.g., `https://snackplex.netlify.app`).

---

## 3. 💾 Database (MongoDB Atlas)

1. **Network Access**: In Atlas dashboard, go to **Network Access** and ensure `0.0.0.0/0` is added (or the specific outbound IPs of Render) so the backend can connect.
2. **URI**: Use the connection string provided by Atlas, replacing `<db_password>` with your actual password.

---

## 🔒 Security Hardening (Applied)
We have already implemented the following security features:
- **Helmet**: Protects your Express server from various web vulnerabilities (XSS, Clickjacking, etc.).
- **Rate Limiting**: Prevents brute-force attacks by limiting requests per IP address.
- **Strict CORS**: Only your frontend URL is allowed to communicate with the backend.
- **ENV Validation**: The server will not start if critical configuration is missing.

---

## ✅ Verification
Once both are deployed:
1. Open the Netlify URL.
2. Ensure you can log in / sign up.
3. Test a small payment (you can use Razorpay Test mode first if you want to verify the flow before switching to Live).
