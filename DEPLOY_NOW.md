# 🚀 Deployment - Copy Paste Steps

## ✅ Step 1: Railway (Backend) - 5 Minutes

### A. Railway Account
1. [railway.app](https://railway.app) → "Start a New Project"
2. "Deploy from GitHub repo" → GitHub connect karo
3. `CodeCampus-e-learning` select karo → "Deploy Now"

### B. Root Directory Set Karna
1. Railway project open hote hi → Settings tab
2. "Source" section mein → "Add Root Directory" click
3. Type: `server` → Save

### C. Environment Variables
Settings → Variables tab → "New Variable" → Ye sab add karo:

```
PORT=4000
NODE_ENV=production
DB_CLUSTER_URL=mongodb+srv://username:password@cluster.mongodb.net/codecampus
DB_NAME=codecampus
JWT_SECRET=abc123xyz789 (kuch bhi random string)
JWT_REFRESH_SECRET=xyz789abc123 (kuch bhi random string)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FROM_EMAIL=noreply@codecampus.online
AWS_ACCESS_KEY=your_aws_key
AWS_SECRET_KEY=your_aws_secret
AWS_BUCKET_REGION=us-east-1
AWS_BUCKET_NAME=codecampus-files
CLOUDFRONT_DISTRIBUTION_ID=your_id
CLOUDFRONT_DOMAIN_NAME=your_domain.cloudfront.net
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
REDIS_URL=redis://localhost:6379 (temporary, baad mein update)
ORIGIN_PORT=http://localhost:3000 (temporary, baad mein update)
```

**Note:** Agar kuch values nahi pata, temporary values daal do. Baad mein update kar sakte ho.

### D. Backend URL Copy Karna
1. Deploy complete hone ke baad
2. Settings → Networking → "Generate Domain"
3. URL copy karo: `https://xxxxx.up.railway.app`
4. **Ye URL save karo** - Frontend mein use karenge

---

## ✅ Step 2: Vercel (Frontend) - 5 Minutes

### A. Vercel Account
1. [vercel.com](https://vercel.com) → "Add New" → "Project"
2. GitHub connect → `CodeCampus-e-learning` select
3. "Import" click

### B. Project Settings
1. **Root Directory:** `client` type karo
2. Framework: "Create React App" (auto-detect hoga)
3. Build Command: `npm run build` (auto)
4. Output Directory: `build` (auto)

### C. Environment Variables
Settings → Environment Variables → Add:

```
REACT_APP_API_BASE_URL=https://xxxxx.up.railway.app/api
REACT_APP_CLIENT_ID=your_google_client_id
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
REACT_APP_REDIRECT_URI=https://your-app.vercel.app
```

**Note:** `REACT_APP_API_BASE_URL` mein Railway ka URL paste karo (Step 1D se)

### D. Deploy
1. "Deploy" button click
2. 2-3 minutes wait
3. Frontend URL milega: `https://your-app.vercel.app`
4. **Ye URL copy karo**

---

## ✅ Step 3: Connect Frontend & Backend

### Railway (Backend) Update:
1. Railway → Settings → Variables
2. `ORIGIN_PORT` variable find karo
3. Value update karo: `https://your-app.vercel.app` (Vercel URL)
4. Save

### Done! 🎉

---

## 📝 Quick Checklist

- [ ] Railway account bana
- [ ] Railway: Root Directory = `server` set kiya
- [ ] Railway: Environment variables add kiye
- [ ] Railway: Backend URL copy kiya
- [ ] Vercel account bana
- [ ] Vercel: Root Directory = `client` set kiya
- [ ] Vercel: Environment variables add kiye (Railway URL ke saath)
- [ ] Vercel: Frontend URL copy kiya
- [ ] Railway: ORIGIN_PORT update kiya (Vercel URL)

---

## 🆘 Agar Problem Aaye

### Build Fail:
- Railway logs check karo
- Root Directory `server` hai na verify karo

### Frontend Backend se connect nahi ho raha:
- `REACT_APP_API_BASE_URL` check karo
- URL mein `/api` end mein hai na?

### CORS Error:
- Railway mein `ORIGIN_PORT` = Vercel URL set karo

---

## 💡 Pro Tip

Agar koi environment variable nahi pata:
- Temporary value daal do
- Baad mein update kar sakte ho
- Important: MongoDB URL zaroor chahiye (MongoDB Atlas se)

