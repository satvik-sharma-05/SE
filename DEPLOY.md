# 🚀 HackTrack Deployment Guide

## Current Deployment Status

✅ **Backend**: https://hacktrack-server-674s.onrender.com  
✅ **Frontend**: https://hacktrack-frontend.vercel.app  
✅ **AI Service**: https://hacktrack-embedding.onrender.com  
✅ **Events Loading**: Working (24 events from multiple sources)  
⏳ **AI Teammates**: Needs `EMBEDDING_URL` update in Render dashboard

---

## Quick Deploy

All services auto-deploy on push to `main` branch via GitHub integration.

```bash
git push origin main
```

---

## Environment Variables to Update in Render Dashboard

### Backend Service: `hacktrack-server-674s`

Go to: Render Dashboard → hacktrack-server-674s → Environment

**Update these variables:**
```
EMBEDDING_URL=https://hacktrack-embedding.onrender.com
FRONTEND_URL=https://hacktrack-frontend.vercel.app
GOOGLE_CALLBACK_URL=https://hacktrack-server-674s.onrender.com/api/auth/google/callback
GITHUB_CALLBACK_URL=https://hacktrack-server-674s.onrender.com/api/auth/github/callback
LINKEDIN_CALLBACK_URL=https://hacktrack-server-674s.onrender.com/api/auth/linkedin/callback
```

After updating, click "Save Changes" - Render will auto-redeploy (2-3 minutes).

---

## Tech Stack

- **Backend**: Node.js + Express + MongoDB Atlas
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **AI Service**: Flask + sentence-transformers (all-MiniLM-L6-v2, Python 3.12.8, CPU-only PyTorch)
- **Deployment**: Render (backend + AI) + Vercel (frontend)

---

## Recent Fixes Applied

1. ✅ CORS configuration fixed (allows frontend origin)
2. ✅ Frontend API URL corrected (includes `/api` suffix)
3. ✅ Event fetching timeouts added (8s per source to prevent API timeouts)
4. ✅ Embedding service upgraded to sentence-transformers for better quality
5. ✅ Python 3.12.8 with CPU-only PyTorch (avoids 2GB+ CUDA dependencies)

---

## Troubleshooting

**Events not loading?**
- Check backend logs in Render dashboard
- Verify CORS settings allow frontend URL
- Hard refresh browser (Ctrl+Shift+R)

**AI teammates returning 500 error?**
- Update `EMBEDDING_URL` in Render dashboard (see above)
- Check embedding service is running: https://hacktrack-embedding.onrender.com/health

**Cold start delays?**
- Free tier services sleep after 15 min inactivity
- First request takes 30-60 seconds to wake up
- Subsequent requests are fast

---

## Service URLs

- **Backend API**: https://hacktrack-server-674s.onrender.com/api
- **Frontend**: https://hacktrack-frontend.vercel.app
- **AI Service**: https://hacktrack-embedding.onrender.com
- **Health Check**: https://hacktrack-server-674s.onrender.com/api/health
