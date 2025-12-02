# Quick Deploy Guide - Get Online in 10 Minutes

## Fastest Way: Deploy to Vercel

### 1. Push to GitHub (5 minutes)

```bash
# If you haven't initialized git yet:
git init
git add .
git commit -m "Initial commit"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel (5 minutes)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click "Add New..." → "Project"
3. Select your repository
4. **Add Environment Variables** (click "Environment Variables"):
   - Copy each line from your `.env.local` file
   - Paste them one by one into Vercel
5. Click "Deploy"

### 3. Done! 🎉

Your app is live at: `https://your-app.vercel.app`

Share this URL with anyone!

---

## What to Share

Once deployed, your friends can:
- Visit: `https://your-app.vercel.app`
- Click "Join Existing Group"
- Enter your group code
- Or you can share: `https://your-app.vercel.app/join-group?code=ABC123`

---

## Environment Variables to Add

In Vercel, add these 5 variables:

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `SUPABASE_SERVICE_ROLE_KEY`
4. `RESEND_API_KEY`
5. `EMAIL_FROM_ADDRESS`

Just copy them from your `.env.local` file!

---

## That's It!

Your app will automatically redeploy whenever you push code to GitHub.
