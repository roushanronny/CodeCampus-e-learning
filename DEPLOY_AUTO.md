# 🤖 Automatic Deployment - Ek Command se Sab

## 🎯 Ek Baar Setup (5 minutes)

### Step 1: Login (Browser mein hoga)

```bash
railway login
```
→ Browser open hoga → GitHub se login

```bash
vercel login  
```
→ Browser open hoga → GitHub se login

---

## 🚀 Deploy Karna (Ek Command)

```bash
cd /Users/roushankumar/Desktop/CodeCampus
./deploy-all.sh
```

**Ye script automatically:**
- ✅ Railway login check karega
- ✅ Vercel login check karega  
- ✅ Backend deploy karega (Railway)
- ✅ Frontend deploy karega (Vercel)
- ✅ URLs dega

---

## ⚙️ Environment Variables (Important!)

Deployment ke baad manually set karna hoga:

### Railway (Backend):
Railway Dashboard → Variables → Add:
- `PORT=4000`
- `NODE_ENV=production`
- `DB_CLUSTER_URL=your_mongodb_url`
- `JWT_SECRET=random_string`
- `JWT_REFRESH_SECRET=random_string`
- `ORIGIN_PORT=your_vercel_url` (Frontend deploy ke baad)

### Vercel (Frontend):
Vercel Dashboard → Settings → Environment Variables → Add:
- `REACT_APP_API_BASE_URL=https://your-railway-url.up.railway.app/api`

---

## 📝 Quick Commands

```bash
# Pehli baar (login)
railway login
vercel login

# Deploy (har baar)
./deploy-all.sh

# Ya manually
cd server && railway up
cd client && vercel --prod
```

---

## ✅ After First Deploy

1. Railway URL copy karo
2. Vercel URL copy karo
3. Railway → Variables → `ORIGIN_PORT` = Vercel URL
4. Vercel → Environment Variables → `REACT_APP_API_BASE_URL` = Railway URL + `/api`

---

## 🎉 Done!

Ab bas `./deploy-all.sh` run karo, sab automatic deploy ho jayega!

