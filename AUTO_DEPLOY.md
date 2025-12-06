# 🤖 Automatic Deployment - CLI se

## ✅ Step 1: Login (Ek baar karna hai)

### Railway Login:
```bash
railway login
```
Browser open hoga → GitHub se login karo

### Vercel Login:
```bash
vercel login
```
Browser open hoga → GitHub se login karo

---

## ✅ Step 2: Backend Deploy (Railway)

```bash
cd /Users/roushankumar/Desktop/CodeCampus
chmod +x deploy-backend.sh
./deploy-backend.sh
```

**Ya manually:**
```bash
cd server
railway link  # First time - project select karo
railway up    # Deploy
```

---

## ✅ Step 3: Frontend Deploy (Vercel)

```bash
cd /Users/roushankumar/Desktop/CodeCampus
chmod +x deploy-frontend.sh
./deploy-frontend.sh
```

**Ya manually:**
```bash
cd client
vercel --prod
```

---

## ⚙️ Environment Variables

### Railway (Backend):
```bash
cd server
railway variables set PORT=4000
railway variables set NODE_ENV=production
railway variables set DB_CLUSTER_URL=your_mongodb_url
# ... baaki variables bhi isi tarah
```

### Vercel (Frontend):
```bash
cd client
vercel env add REACT_APP_API_BASE_URL production
# Value paste karo: https://your-railway-url.up.railway.app/api
```

---

## 🎯 Quick Deploy (All-in-One)

```bash
# Backend
cd server && railway up

# Frontend  
cd client && vercel --prod
```

---

## 📝 Notes

- Pehli baar: `railway link` aur `vercel` (project setup)
- Baad mein: Direct `railway up` aur `vercel --prod`
- Environment variables CLI se bhi set kar sakte ho

