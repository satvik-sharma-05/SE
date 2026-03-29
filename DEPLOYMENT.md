# 🚀 Deployment Guide - HackTrack Platform

Complete guide to deploy HackTrack on **Vercel** (Frontend) and **Render** (Backend + AI Service).

**Total Cost**: $0/month (free tier) ✅

---

## 📋 Prerequisites

- [GitHub Account](https://github.com)
- [Vercel Account](https://vercel.com)
- [Render Account](https://render.com)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)
- OAuth credentials (optional): [Google](https://console.cloud.google.com), [GitHub](https://github.com/settings/developers)

---

## 🗄️ Step 1: Setup MongoDB Atlas

### 1.1 Create Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Build a Database"**
3. Choose **M0 Free Tier**
4. Select region closest to your users
5. Click **"Create Cluster"**

### 1.2 Create Database User
1. Go to **Database Access**
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Username: `hacktrack`
5. Password: Generate strong password (save it!)
6. Database User Privileges: **Read and write to any database**
7. Click **"Add User"**

### 1.3 Whitelist IP Addresses
1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 1.4 Get Connection String
1. Go to **Database** → **Connect**
2. Choose **"Connect your application"**
3. Copy connection string:
   ```
   mongodb+srv://hacktrack:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Save this for later!

---

## 🐍 Step 2: Deploy Embedding Service (Render)

### 2.1 Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `hacktrack-embedding`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `embedding-service`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Instance Type**: `Free`

### 2.2 Environment Variables
Add these in Render:
```
PORT=5002
```

### 2.3 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (2-3 minutes)
3. Copy the service URL: `https://hacktrack-embedding.onrender.com`
4. Test: Visit `https://hacktrack-embedding.onrender.com/health`
   - Should return: `{"status": "healthy"}`

---

## 🖥️ Step 3: Deploy Backend (Render)

### 3.1 Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `hacktrack-backend`
   - **Region**: Same as embedding service
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 3.2 Environment Variables
Add these in Render (replace with your values):

```env
# Node Environment
NODE_ENV=production
PORT=5000

# Database
MONGO_URI=mongodb+srv://hacktrack:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_to_random_string
SESSION_SECRET=your_session_secret_change_this_to_random_string

# URLs
FRONTEND_URL=https://your-app.vercel.app
EMBEDDING_URL=https://hacktrack-embedding.onrender.com

# OAuth - Google (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://hacktrack-backend.onrender.com/api/auth/google/callback

# OAuth - GitHub (Optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=https://hacktrack-backend.onrender.com/api/auth/github/callback

# External APIs (Optional)
CLIST_USERNAME=your_clist_username
CLIST_API_KEY=your_clist_api_key
DEVPOST_API_KEY=your_devpost_api_key

# Email (Optional - for password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

### 3.3 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Copy the service URL: `https://hacktrack-backend.onrender.com`
4. Test: Visit `https://hacktrack-backend.onrender.com/api/health`
   - Should return: `{"status": "healthy"}`

---

## 🌐 Step 4: Deploy Frontend (Vercel)

### 4.1 Import Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.2 Environment Variables
Add in Vercel:
```env
VITE_API_BASE_URL=https://hacktrack-backend.onrender.com/api
```

### 4.3 Deploy
1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Copy the deployment URL: `https://your-app.vercel.app`

### 4.4 Update Backend FRONTEND_URL
1. Go back to Render → Backend Service
2. Update `FRONTEND_URL` to your Vercel URL
3. Click **"Save Changes"**
4. Service will auto-redeploy

---

## 🔐 Step 5: Setup OAuth (Optional)

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   ```
   https://hacktrack-backend.onrender.com/api/auth/google/callback
   http://localhost:5000/api/auth/google/callback
   ```
7. Copy **Client ID** and **Client Secret**
8. Add to Render backend environment variables

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: HackTrack
   - **Homepage URL**: `https://your-app.vercel.app`
   - **Authorization callback URL**: `https://hacktrack-backend.onrender.com/api/auth/github/callback`
4. Click **"Register application"**
5. Copy **Client ID** and **Client Secret**
6. Add to Render backend environment variables

---

## 🧪 Step 6: Testing

### Test Embedding Service
```bash
curl https://hacktrack-embedding.onrender.com/health
# Expected: {"status": "healthy"}

curl -X POST https://hacktrack-embedding.onrender.com/embed \
  -H "Content-Type: application/json" \
  -d '{"text":"test"}'
# Expected: {"embedding": [0.123, 0.456, ...]}
```

### Test Backend
```bash
curl https://hacktrack-backend.onrender.com/api/health
# Expected: {"status": "healthy"}
```

### Test Frontend
1. Visit your Vercel URL
2. Try registering a new account
3. Try logging in
4. Test AI teammate recommendations

---

## ⚙️ Step 7: Custom Domain (Optional)

### Vercel Custom Domain
1. Go to Vercel → Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

### Render Custom Domain
1. Go to Render → Service → Settings → Custom Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

---

## 🔧 Troubleshooting

### Backend won't start
- Check MongoDB connection string is correct
- Verify all required environment variables are set
- Check Render logs for errors

### Frontend can't connect to backend
- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings in backend
- Verify backend is running

### AI features not working
- Check embedding service is running
- Verify `EMBEDDING_URL` in backend is correct
- Test embedding service health endpoint

### OAuth not working
- Verify callback URLs match exactly
- Check client ID and secret are correct
- Ensure OAuth app is not in development mode

### Cold Start Issues (Free Tier)
Render free tier services sleep after 15 minutes of inactivity:
- First request may take 30-60 seconds
- Consider using a uptime monitor (e.g., UptimeRobot)
- Or upgrade to paid tier ($7/month per service)

---

## 📊 Monitoring

### Render Logs
- Go to Render → Service → Logs
- Monitor for errors and performance

### Vercel Analytics
- Go to Vercel → Project → Analytics
- View traffic and performance metrics

### MongoDB Atlas Monitoring
- Go to Atlas → Cluster → Metrics
- Monitor database performance

---

## 🔄 Updates & Redeployment

### Automatic Deployment
Both Vercel and Render auto-deploy on git push to main branch.

### Manual Deployment
- **Vercel**: Go to Deployments → Redeploy
- **Render**: Go to Service → Manual Deploy → Deploy latest commit

---

## 💰 Cost Breakdown

| Service | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| Vercel (Frontend) | ✅ Unlimited | $20/mo | Free tier sufficient |
| Render (Backend) | ✅ 750h/mo | $7/mo | Sleeps after 15min |
| Render (Embedding) | ✅ 750h/mo | $7/mo | Sleeps after 15min |
| MongoDB Atlas | ✅ 512MB | $9/mo | Free tier sufficient |
| **Total** | **$0/mo** | **$23/mo** | Free tier works great! |

---

## 🎯 Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Embedding service deployed on Render
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] All environment variables set correctly
- [ ] OAuth credentials configured (if using)
- [ ] Health endpoints tested
- [ ] User registration tested
- [ ] Login tested
- [ ] AI features tested
- [ ] Custom domain configured (optional)
- [ ] Monitoring setup

---

## 📞 Support

If you encounter issues:
1. Check Render/Vercel logs
2. Verify environment variables
3. Test each service independently
4. Check MongoDB Atlas connection
5. Open an issue on GitHub

---

## 🎉 Success!

Your HackTrack platform is now live! 🚀

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://hacktrack-backend.onrender.com
- **Embedding Service**: https://hacktrack-embedding.onrender.com

Share your deployment and start building amazing hackathon teams!

---

<div align="center">

**Made with ❤️ by the HackTrack Team**

[Back to README](README.md)

</div>
