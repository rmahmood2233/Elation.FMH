# Deployment Guide - Elation by FMH

This guide covers multiple deployment options for your Node.js/Express application.

## 🚀 Quick Deployment Options

### Option 1: Render.com (Recommended - Free Tier Available)

**Step 1: Set up MongoDB Atlas (Cloud Database)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a new cluster (choose FREE tier)
4. Create database user:
   - Database Access → Add New Database User
   - Username: `elation-fmh-user`
   - Password: (generate strong password, save it!)
5. Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
6. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/elation-fmh`)

**Step 2: Deploy to Render**
1. Push your code to GitHub
2. Go to https://render.com and sign up
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: elation-by-fmh
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Add Environment Variables:
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - `SESSION_SECRET` = A random secret (generate one: `openssl rand -base64 32`)
   - `NODE_ENV` = production
   - `PORT` = (Render automatically sets this, but you can leave it)
7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)

**Important Notes for Render:**
- Free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- For production, consider the paid tier ($7/month)

---

### Option 2: Railway.app (Free Tier Available)

**Step 1: MongoDB Atlas** (Same as Render - follow steps above)

**Step 2: Deploy to Railway**
1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add Environment Variables:
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - `SESSION_SECRET` = Random secret
   - `NODE_ENV` = production
5. Railway auto-detects Node.js and deploys
6. Get your URL from the service settings

**Railway Benefits:**
- $5 free credit monthly
- No sleep (always running)
- Automatic HTTPS

---

### Option 3: Heroku (Paid - $5/month minimum)

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Login: `heroku login`
3. Create app: `heroku create elation-by-fmh`
4. Add MongoDB Atlas (same as above) or use Heroku MongoDB addon
5. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_connection_string
   heroku config:set SESSION_SECRET=your_secret
   heroku config:set NODE_ENV=production
   ```
6. Deploy: `git push heroku main`

---

## 📦 Pre-Deployment Checklist

### 1. Update `.gitignore` (Already done ✓)
```
node_modules/
.env
.DS_Store
*.log
uploads/
public/uploads/
```

### 2. Ensure `package.json` has start script (Already done ✓)
```json
"scripts": {
  "start": "node server.js"
}
```

### 3. Set up MongoDB Atlas (Cloud Database)

**Why MongoDB Atlas?**
- Local MongoDB won't work on cloud platforms
- Atlas provides free tier with 512MB storage
- Automatic backups and scaling

**Setup Steps:**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create FREE cluster (M0 tier)
3. Configure:
   - Database user (save credentials!)
   - Network access (0.0.0.0/0 for development)
   - Get connection string
4. Replace connection string format:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/elation-fmh?retryWrites=true&w=majority
   ```

### 4. Environment Variables Needed

Create these in your hosting platform's environment variables section:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/elation-fmh` |
| `SESSION_SECRET` | Secret for session encryption | Generate random string |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | Usually auto-set by platform |

### 5. File Upload Considerations

**Current Setup:**
- Images are stored in `public/uploads/` folder
- This works locally but NOT on cloud platforms (files are temporary)

**Solutions:**

**Option A: Use MongoDB Atlas or Cloud Storage (Recommended)**
- Store images as base64 in database (not recommended for large files)
- Or use cloud storage: AWS S3, Cloudinary, or Multer with GridFS

**Option B: Use External Image URLs**
- Upload images to Imgur, Cloudinary, or similar
- Store URLs in database
- Admin panel already supports image URLs!

**For Now (Quick Fix):**
- Use image URLs in admin panel instead of file uploads
- Images will persist across deployments

---

## 🔧 Production Optimizations

### 1. Update Server for Production

The server.js already handles:
- ✅ Production session cookies (`secure: true` in production)
- ✅ PORT from environment variable
- ✅ Error handling

### 2. Add Security Headers (Optional)

Add to `server.js`:
```javascript
// Security headers (add after middleware)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
}
```

### 3. Enable Compression (Optional)

Install: `npm install compression`
Add to `server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

---

## 📝 Deployment Steps Summary (Render)

1. ✅ Push code to GitHub
2. ✅ Set up MongoDB Atlas (get connection string)
3. ✅ Create Render account
4. ✅ Connect GitHub repo
5. ✅ Add environment variables
6. ✅ Deploy!
7. ✅ Test your live site

---

## 🐛 Common Issues

**Issue: "MongoDB connection failed"**
- Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- Verify connection string has correct password
- Ensure database user exists

**Issue: "Port already in use"**
- Use `process.env.PORT` (already done ✓)
- Platform sets PORT automatically

**Issue: "Images not showing"**
- Use image URLs instead of file uploads
- Or implement cloud storage (S3, Cloudinary)

**Issue: "Session not working"**
- Ensure SESSION_SECRET is set
- Check NODE_ENV is "production"

---

## 📚 Additional Resources

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app/
- Heroku Node.js Guide: https://devcenter.heroku.com/articles/getting-started-with-nodejs

---

## 🎯 Recommended Setup for Production

1. **Database**: MongoDB Atlas (Free tier)
2. **Hosting**: Render or Railway (Free tier)
3. **Image Storage**: Cloudinary free tier OR use image URLs
4. **Domain**: Connect custom domain (optional)

---

## ✅ Post-Deployment

After deployment:
1. Test all pages
2. Test admin login
3. Add some content via admin panel
4. Test booking form
5. Test contact form
6. Monitor logs for errors

---

**Need Help?** Check platform logs and error messages for specific issues.

