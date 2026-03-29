# 🤖 Embedding Service

## What is This?

A Python Flask service that converts text to vectors for AI-powered teammate matching.

## Do I Need This?

**No!** Your app works fine without it. This is only for AI features:
- AI teammate recommendations
- Semantic search
- Auto team formation

**90% of features work without this service.**

---

## Options

### Option 1: Skip It (Recommended for Free Tier)
- Disable AI routes in backend
- Everything else works perfectly
- Zero setup required

### Option 2: Use OpenAI Instead (Easiest)
- Get OpenAI API key (free $5 credit)
- Add to backend `.env`: `OPENAI_API_KEY=sk-...`
- Install: `npm install openai`
- No Python service needed!

### Option 3: Deploy This Service (Free but Complex)
- Deploy to Render/Railway
- Requires Python 3.8+
- ~500MB RAM
- Free tier available

---

## Local Setup (If You Want AI Features)

### Requirements
- Python 3.8+
- pip

### Install
```bash
cd embedding-service
pip install -r requirements.txt
```

### Run
```bash
python app.py
```

Service runs on `http://localhost:5002`

### Update Backend
```bash
# In server/.env
EMBEDDING_URL=http://localhost:5002
```

---

## Deploy to Render.com (Free)

### Step 1: Create Web Service
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect your repository
4. Configure:
   - **Name**: hacktrack-embeddings
   - **Root Directory**: `embedding-service`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`

### Step 2: Set Environment Variables
```
PORT=5002
```

### Step 3: Update Backend .env
```env
EMBEDDING_URL=https://hacktrack-embeddings.onrender.com
```

**Note:** Free tier spins down after 15 min (30-60s cold start)

---

## Deploy to Railway.app (Alternative)

1. Create new project from GitHub
2. Select `embedding-service` folder
3. Railway auto-detects Python
4. Copy service URL to backend `.env`

---

## API Endpoints

### POST /embed
Convert text to vector

**Request:**
```json
{
  "text": "I love Python and machine learning"
}
```

**Response:**
```json
{
  "embedding": [0.123, -0.456, ...],  // 384-dimensional vector
  "model": "all-MiniLM-L6-v2"
}
```

### POST /similarity
Calculate similarity between two vectors

**Request:**
```json
{
  "vector1": [0.1, 0.2, ...],
  "vector2": [0.3, 0.4, ...]
}
```

**Response:**
```json
{
  "similarity": 0.85
}
```

### GET /health
Health check

**Response:**
```json
{
  "status": "healthy",
  "model": "all-MiniLM-L6-v2"
}
```

---

## Model Info

**Model:** `sentence-transformers/all-MiniLM-L6-v2`
- Size: ~80MB
- Dimensions: 384
- Speed: Fast
- Quality: Good for semantic search

---

## Troubleshooting

### "Model download failed"
- Check internet connection
- Model downloads on first run (~80MB)
- Takes 1-2 minutes

### "Out of memory"
- Requires ~500MB RAM
- Use Render/Railway paid tier if needed
- Or use OpenAI API instead

### "Service unavailable"
- Check service is running
- Verify `EMBEDDING_URL` is correct
- Check Render/Railway logs

---

## Cost Comparison

| Option | Setup | Cost | Speed | Recommendation |
|--------|-------|------|-------|----------------|
| Skip AI | None | $0 | N/A | Best for free tier |
| OpenAI | 5 min | ~$0.01/1000 | Fast | Best for production |
| Self-hosted | 30 min | $0 (free tier) | Slow (cold start) | Good for learning |

---

## Recommendation

**For most users:** Use OpenAI API
- Easier setup
- No Python service to manage
- Better performance
- Minimal cost

**For free tier:** Skip AI features
- App works great without them
- Add later if needed

**For learning:** Deploy this service
- Understand how embeddings work
- Full control

---

## Alternative: OpenAI Integration

Replace this service with OpenAI:

```javascript
// server/src/utils/embeddingClient.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}
```

```bash
# Install
npm install openai

# Configure
OPENAI_API_KEY=sk-your-key-here
```

---

## Summary

- ❌ Not required for core features
- ✅ Optional for AI features
- 🎯 Recommended: Use OpenAI API instead
- 🆓 Can deploy free on Render/Railway
- 📚 See [CRITICAL_SERVICES.md](../CRITICAL_SERVICES.md) for more options
