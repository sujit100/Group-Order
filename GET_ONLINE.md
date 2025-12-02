# Get Your App Online in 10 Minutes! 🌐

Right now your app only works on your computer (`localhost:3000`). Here's how to make it accessible to anyone on the internet.

## Step-by-Step Instructions

### Step 1: Set Up GitHub (3 minutes)

#### 1a. Create GitHub Account (if needed)
- Go to [github.com](https://github.com) and sign up

#### 1b. Create a New Repository
1. Click the **"+"** icon (top right) → **"New repository"**
2. Repository name: `group-ordering` (or any name you like)
3. Choose **Public** or **Private**
4. **Don't** check "Initialize with README"
5. Click **"Create repository"**

#### 1c. Push Your Code to GitHub

Open your terminal in the project folder and run these commands:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit - Group Ordering App"

# Connect to your GitHub repo (replace YOUR_USERNAME and REPO_NAME)
# You'll find the URL on your GitHub repo page (green "Code" button)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Tip**: When you create the repo, GitHub shows you these exact commands with your username/repo filled in - just copy and paste!

---

### Step 2: Deploy to Vercel (7 minutes)

#### 2a. Sign Up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

#### 2b. Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Find and select your `group-ordering` repository
3. Click **"Import"**

#### 2c. Add Environment Variables
This is the most important step! Your app needs these to work:

1. In the "Environment Variables" section, click to add each one:

   **Add these 5 variables one by one:**

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: (paste from your .env.local file)
   ```

   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: (paste from your .env.local file)
   ```

   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: (paste from your .env.local file)
   ```

   ```
   Name: RESEND_API_KEY
   Value: (paste from your .env.local file)
   ```

   ```
   Name: EMAIL_FROM_ADDRESS
   Value: (paste from your .env.local file)
   ```

2. To get the values, open your `.env.local` file and copy each value (the part after the `=`)

#### 2d. Deploy!
1. Scroll down and click **"Deploy"**
2. Wait 2-3 minutes while Vercel builds and deploys your app
3. When it says "Ready", you'll see a URL like:
   ```
   https://group-ordering-xyz123.vercel.app
   ```

---

### Step 3: Test Your Live App! 🎉

1. **Click the URL** Vercel gave you (or visit it in your browser)
2. **Test the app**:
   - Create a group
   - Get the join link
   - Share it with yourself on your phone to test!

3. **Share with friends!**
   - Give them the URL: `https://your-app.vercel.app`
   - Or share a direct join link: `https://your-app.vercel.app/join-group?code=ABC123`

---

## What Happens Next?

✅ **Your app is now live on the internet!**
- Anyone with the URL can access it
- It's available 24/7
- Changes you push to GitHub automatically redeploy

---

## Troubleshooting

### "Build failed"
- Double-check all 5 environment variables are added correctly
- Make sure variable names match exactly (copy-paste to avoid typos)
- Check the build logs in Vercel dashboard

### "Can't connect to database"
- Verify your Supabase keys are correct
- Make sure your Supabase project is active (not paused)
- Check Supabase dashboard for any errors

### "Environment variable missing"
- Go to Vercel → Your Project → Settings → Environment Variables
- Make sure all 5 variables are there
- Redeploy after adding variables

---

## Quick Reference

**Your deployment URL format:**
```
https://your-app-name.vercel.app
```

**Share this with friends:**
```
https://your-app-name.vercel.app/join-group?code=ABC123
```

---

## Next Steps

- ✅ Share your app URL with friends and family
- ✅ Test the full flow (create group → join → add items → checkout)
- ✅ Customize the app (change restaurant data, styling, etc.)
- ✅ Consider a custom domain later (optional)

**That's it! Your app is now online! 🚀**
