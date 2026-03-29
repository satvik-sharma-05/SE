# 🚀 HackTrack Deployment Guide

## 📋 Current Deployment Status

✅ **Frontend**: https://hacktrack-frontend.vercel.app  
✅ **Backend**: https://hacktrack-server-674s.onrender.com/api  
✅ **AI Service**: https://hacktrack-embedding.onrender.com  
✅ **Database**: MongoDB Atlas (connected)  
✅ **Events Loading**: Working (24+ events from multiple sources)  
✅ **CORS**: Configured correctly  
⏳ **AI Teammates**: Requires environment variable update (see below)

---

## 🔗 Service URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend | https://hacktrack-frontend.vercel.app | ✅ Live |
| Backend API | https://hacktrack-server-674s.onrender.com/api | ✅ Live |
| AI Service | https://hacktrack-embedding.onrender.com | ✅ Live |
| Health Check | https://hacktrack-server-674s.onrender.com/api/health | ✅ Live |
| AI Health | https://hacktrack-embedding.onrender.com/health | ✅ Live |

---

## ⚙️ Environment Variables Setup

### Backend (Render Dashboard)

Go to: **Render Dashboard → hacktrack-server-674s → Environment**

**Required Variables:**

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/HackTrack

# Authentication
JWT_SECRET=your_jwt_secret_min_32_chars
SESSION_SECRET=your_session_secret

# Service URLs
FRONTEND_URL=https://hacktrack-frontend.vercel.app
EMBEDDING_URL=https://hacktrack-embedding.onrender.com

# OAuth Callbacks
GOOGLE_CALLBACK_URL=https://hacktrack-server-674s.onrender.com/api/auth/google/callback
GITHUB_CALLBACK_URL=https://hacktrack-server-674s.onrender.com/api/auth/github/callback
LINKEDIN_CALLBACK_URL=https://hacktrack-server-674s.onrender.com/api/auth/linkedin/callback

# OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Event Sources
CLIST_USERNAME=your_clist_username
CLIST_API_KEY=your_clist_api_key
DEVPOST_API_KEY=your_devpost_api_key
EVENTBRITE_API_KEY=your_eventbrite_api_key

# Email (Password Reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Environment
NODE_ENV=production
```

### Frontend (Vercel Dashboard - Optional)

Go to: **Vercel Dashboard → hacktrack-frontend → Settings → Environment Variables**

```env
VITE_API_BASE_URL=https://hacktrack-server-674s.onrender.com/api
```

**Note**: Frontend has smart fallback, so this is optional.

---

## 🚀 Deployment Process

### Automatic Deployment

All services auto-deploy on push to `main` branch:

```bash
git add .
git commit -m "your commit message"
git push origin main
```

**Deployment Times:**
- Frontend (Vercel): 1-2 minutes
- Backend (Render): 2-3 minutes
- AI Service (Render): 2-3 minutes

### Manual Deployment

**Render:**
1. Go to service dashboard
2. Click "Manual Deploy" → "Deploy latest commit"

**Vercel:**
1. Go to project dashboard
2. Click "Deployments" → "Redeploy"

---

## 🔧 Tech Stack

### Frontend
- **React 18** + **Vite 5**
- **TailwindCSS 3** + **shadcn/ui**
- **React Router 6**
- **Axios** + **Socket.io Client**
- **Deployed on**: Vercel

### Backend
- **Node.js 18** + **Express 4**
- **MongoDB Atlas** + **Mongoose 8**
- **Passport.js** (OAuth)
- **JWT** + **Express Session**
- **Socket.io** (WebSocket)
- **Deployed on**: Render

### AI Service
- **Python 3.12.8** + **Flask 3**
- **Sentence-Transformers 3.3** (all-MiniLM-L6-v2)
- **PyTorch 2.5** (CPU-only)
- **NumPy 2.2**
- **Deployed on**: Render

---

## 📝 Recent Fixes Applied

1. ✅ **CORS Configuration** - Backend accepts requests from frontend origin
2. ✅ **API Routes** - All routes use `/api` prefix correctly
3. ✅ **Event Fetching** - Added 8s timeouts to prevent API hangs
4. ✅ **Embedding Service** - Upgraded to sentence-transformers for better quality
5. ✅ **Python Version** - Using 3.12.8 with CPU-only PyTorch (no 2GB+ CUDA)
6. ✅ **Error Handling** - Better error messages for debugging
7. ✅ **Smart Fallback** - Frontend automatically adds `/api` suffix if missing

---

## 🐛 Troubleshooting

### Events Not Loading

**Symptoms**: Frontend shows "Cannot connect to server"

**Solutions**:
1. Check backend is running: https://hacktrack-server-674s.onrender.com/api/health
2. Verify CORS settings in Render environment variables
3. Hard refresh browser (Ctrl+Shift+R)
4. Check Render logs for errors

### AI Teammates Returning 503

**Symptoms**: "AI teammate search is temporarily unavailable"

**Solutions**:
1. Verify `EMBEDDING_URL` in Render dashboard:
   ```
   EMBEDDING_URL=https://hacktrack-embedding.onrender.com
   ```
2. Check AI service is running: https://hacktrack-embedding.onrender.com/health
3. Redeploy backend after updating environment variable
4. Check backend logs for embedding service errors

### Cold Start Delays

**Symptoms**: First request takes 30-60 seconds

**Explanation**: Free tier services sleep after 15 minutes of inactivity

**Solutions**:
- This is normal behavior on free tier
- Subsequent requests are fast
- Consider upgrading to paid tier for always-on services
- Use a cron job to ping services every 10 minutes

### OAuth Not Working

**Symptoms**: OAuth redirect fails or returns error

**Solutions**:
1. Verify callback URLs in OAuth provider dashboards:
   - Google: https://console.cloud.google.com
   - GitHub: https://github.com/settings/developers
   - LinkedIn: https://www.linkedin.com/developers
2. Ensure callback URLs match exactly:
   ```
   https://hacktrack-server-674s.onrender.com/api/auth/google/callback
   https://hacktrack-server-674s.onrender.com/api/auth/github/callback
   https://hacktrack-server-674s.onrender.com/api/auth/linkedin/callback
   ```
3. Check OAuth credentials in Render environment variables

### Database Connection Issues

**Symptoms**: "MongoDB connection failed"

**Solutions**:
1. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Check connection string format in `MONGO_URI`
3. Ensure database user has correct permissions
4. Test connection string locally first

---

## 📊 Monitoring

### Check Service Health

```bash
# Backend health
curl https://hacktrack-server-674s.onrender.com/api/health

# AI service health
curl https://hacktrack-embedding.onrender.com/health

# Expected response
{
  "status": "healthy",
  "model": "all-MiniLM-L6-v2",
  "dimensions": 384
}
```

### View Logs

**Render:**
1. Go to service dashboard
2. Click "Logs" in left sidebar
3. View real-time logs

**Vercel:**
1. Go to project dashboard
2. Click "Deployments"
3. Click on deployment → "View Function Logs"

### Monitor Performance

**Render:**
- Dashboard shows CPU, memory, and bandwidth usage
- Free tier: 512MB RAM, 0.1 CPU

**Vercel:**
- Dashboard shows bandwidth and function invocations
- Free tier: 100GB bandwidth/month

---

## 💰 Cost Breakdown

| Service | Tier | Cost | Limits |
|---------|------|------|--------|
| MongoDB Atlas | M0 | $0/month | 512MB storage |
| Render (Backend) | Free | $0/month | 750h/month, sleeps after 15min |
| Render (AI) | Free | $0/month | 750h/month, sleeps after 15min |
| Vercel (Frontend) | Hobby | $0/month | 100GB bandwidth/month |
| **Total** | | **$0/month** | ✅ |

---

## 🔐 Security Checklist

- ✅ Environment variables stored securely (not in git)
- ✅ JWT secrets are strong (32+ characters)
- ✅ Passwords hashed with bcrypt
- ✅ CORS configured correctly
- ✅ Rate limiting enabled
- ✅ MongoDB connection uses SSL
- ✅ OAuth uses HTTPS callbacks
- ✅ Session secrets are unique

---

## 📈 Scaling Considerations

### When to Upgrade

**Upgrade to paid tier when:**
- Cold starts become problematic (> 100 users/day)
- Need always-on services
- Require more than 512MB RAM
- Need custom domains
- Require better performance

**Paid Tier Benefits:**
- No cold starts
- More RAM and CPU
- Custom domains
- Better support
- Higher rate limits

### Horizontal Scaling

**Backend:**
- Add more Render instances
- Use load balancer
- Implement Redis for session store

**AI Service:**
- Deploy multiple instances
- Use queue system (Bull/BullMQ)
- Consider GPU instances for faster inference

**Database:**
- Upgrade MongoDB Atlas tier
- Enable sharding
- Add read replicas

---

## 🎯 Next Steps

1. **Update Environment Variables** in Render dashboard (see above)
2. **Test All Features** after deployment
3. **Monitor Logs** for any errors
4. **Set Up Monitoring** (optional: UptimeRobot, Sentry)
5. **Configure Custom Domain** (optional)
6. **Set Up CI/CD** (optional: GitHub Actions)

---

## 📞 Support

**Issues**: https://github.com/satvik-sharma-05/SE/issues  
**Repository**: https://github.com/satvik-sharma-05/SE  
**Documentation**: This file

---

## 🎉 Deployment Complete!

Your HackTrack platform is now live and ready to use!

**Frontend**: https://hacktrack-frontend.vercel.app  
**Backend**: https://hacktrack-server-674s.onrender.com/api  
**AI Service**: https://hacktrack-embedding.onrender.com

---

<div align="center">

**[⬆ Back to Top](#-hacktrack-deployment-guide)**

</div>
