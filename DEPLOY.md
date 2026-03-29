# 🚀 Quick Deployment Guide

## Prerequisites
- MongoDB Atlas account (free M0 tier)
- Render account (free tier)
- Vercel account (free tier)
- GitHub repository

---

## 1️⃣ MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Database Access → Add User (username + password)
4. Network Access → Add IP: `0.0.0.0/0` (allow all)
5. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/hacktrack`

---

## 2️⃣ Backend Deployment (Render)

### Server (Node.js)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. New → Web Service → Connect GitHub repo
3. Settings:
   - Name: `hacktrack-server`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free

4. Environment Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hacktrack
JWT_SECRET=your-random-secret-key-min-32-chars
SESSION_SECRET=another-random-secret-key
CLIENT_URL=https://your-app.vercel.app
EMBEDDING_SERVICE_URL=https://hacktrack-ai.onrender.com
CLIST_API_KEY=your-clist-api-key
```

5. Deploy

### AI Service (Python)
1. New → Web Service → Same repo
2. Settings:
   - Name: `hacktrack-ai`
   - Root Directory: `embedding-service`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`
   - Instance Type: Free

3. Deploy

---

## 3️⃣ Frontend Deployment (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import Project → GitHub repo
3. Settings:
   - Root Directory: `client`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. Environment Variables:
```
VITE_API_BASE_URL=https://hacktrack-server.onrender.com
```

5. Deploy

---

## 4️⃣ OAuth Setup (Optional)

### Google OAuth
1. [Google Cloud Console](https://console.cloud.google.com)
2. Create Project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Authorized redirect URIs:
   - `https://hacktrack-server.onrender.com/api/auth/google/callback`
5. Copy Client ID & Secret → Add to Render env vars

### GitHub OAuth
1. GitHub Settings → Developer settings → OAuth Apps
2. New OAuth App
3. Authorization callback URL:
   - `https://hacktrack-server.onrender.com/api/auth/github/callback`
4. Copy Client ID & Secret → Add to Render env vars

---

## 5️⃣ Verify Deployment

### Check Services
```bash
# Backend health
curl https://hacktrack-server.onrender.com/api/health

# AI service health
curl https://hacktrack-ai.onrender.com/health

# Frontend
open https://your-app.vercel.app
```

### Expected Response
```json
{
  "status": "healthy",
  "database": "connected",
  "embeddingService": "connected"
}
```

---

## 🎉 Done!

Your HackTrack platform is now live on free tier hosting!

**URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://hacktrack-server.onrender.com`
- AI Service: `https://hacktrack-ai.onrender.com`

---

## ⚠️ Important Notes

1. **Free Tier Limitations:**
   - Render: Services sleep after 15 min inactivity (30s cold start)
   - MongoDB Atlas: 512 MB storage limit
   - Vercel: 100 GB bandwidth/month

2. **First Request:** May take 30-60 seconds (cold start)

3. **Update URLs:** After deployment, update `CLIENT_URL` in Render and `VITE_API_BASE_URL` in Vercel

4. **Logs:** Check Render/Vercel dashboards for errors

---

## 🔧 Troubleshooting

**Issue:** Backend not connecting to MongoDB
- Check MongoDB IP whitelist includes `0.0.0.0/0`
- Verify connection string format

**Issue:** CORS errors
- Ensure `CLIENT_URL` in backend matches Vercel URL exactly
- Check Vercel URL in browser (no trailing slash)

**Issue:** AI service timeout
- First request takes longer (model loading)
- Subsequent requests are fast

**Issue:** OAuth not working
- Verify callback URLs match exactly
- Check OAuth credentials in Render env vars

---

**Need help?** Check logs in Render/Vercel dashboards
