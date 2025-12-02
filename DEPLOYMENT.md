# Deploy Your Group Ordering App to the Internet

Your app is currently running on `localhost:3000`, which only works on your computer. To let others access it from anywhere, you need to deploy it to a cloud hosting service.

## Option 1: Deploy to Vercel (Recommended - Easiest)

Vercel is the company behind Next.js and offers free hosting with automatic deployments.

### Step 1: Push Your Code to GitHub

1. **Create a GitHub account** (if you don't have one): [github.com](https://github.com)

2. **Create a new repository**:
   - Click the "+" icon → "New repository"
   - Name it: `group-ordering` (or any name)
   - Make it **Public** or **Private** (your choice)
   - **Don't** initialize with README
   - Click "Create repository"

3. **Push your code to GitHub**:
   ```bash
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit"
   
   # Add your GitHub repo as remote (replace YOUR_USERNAME and REPO_NAME)
   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Sign up for Vercel**: [vercel.com](https://vercel.com)
   - Click "Sign Up"
   - Choose "Continue with GitHub"
   - Authorize Vercel to access your GitHub

2. **Import your project**:
   - Click "Add New..." → "Project"
   - Find your `group-ordering` repository
   - Click "Import"

3. **Configure environment variables**:
   - In the "Environment Variables" section, add all your variables from `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL` → Your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Your Supabase anon key
     - `SUPABASE_SERVICE_ROLE_KEY` → Your Supabase service role key
     - `RESEND_API_KEY` → Your Resend API key
     - `EMAIL_FROM_ADDRESS` → Your email address
   
   ⚠️ **Important**: Make sure to add each variable exactly as shown above

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for deployment to complete
   - You'll get a URL like: `https://group-ordering.vercel.app`

### Step 3: Your App is Live! 🎉

- Your app is now accessible at: `https://your-app-name.vercel.app`
- You can share this URL with anyone!
- Any code changes you push to GitHub will automatically redeploy

---

## Option 2: Deploy to Netlify

### Step 1: Push to GitHub (same as Vercel Step 1)

### Step 2: Deploy to Netlify

1. **Sign up**: [netlify.com](https://netlify.com)
   - Click "Sign up" → "GitHub"

2. **Add new site**:
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

3. **Add environment variables**:
   - Go to Site settings → Environment variables
   - Add all variables from `.env.local`

4. **Deploy**:
   - Click "Deploy site"
   - Your URL: `https://your-app-name.netlify.app`

---

## Option 3: Deploy to Railway

1. **Sign up**: [railway.app](https://railway.app)
2. **New Project** → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables in the Variables tab
5. Deploy automatically starts

---

## Environment Variables for Production

Make sure to add these in your hosting platform:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
```

**⚠️ Security Note**: Never commit your `.env.local` file to GitHub! It's already in `.gitignore`, but double-check.

---

## Quick Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel/Netlify account created
- [ ] Repository connected
- [ ] All environment variables added to hosting platform
- [ ] Deployment successful
- [ ] Test the live URL works
- [ ] Share your URL with friends!

---

## Custom Domain (Optional)

Both Vercel and Netlify let you use a custom domain for free:

1. Go to your project settings
2. Add your domain (e.g., `grouporder.yourdomain.com`)
3. Follow their DNS configuration instructions
4. Your app will be accessible at your custom domain!

---

## Testing Your Deployed App

1. Visit your live URL
2. Create a group
3. Share the join link with a friend
4. Have them join and add items
5. Verify real-time updates work!

---

## Troubleshooting

### "Build failed"
- Check that all environment variables are set
- Verify your build logs for specific errors
- Make sure `package.json` has all dependencies

### "Environment variables not working"
- Verify variable names match exactly (case-sensitive)
- Redeploy after adding variables
- Check that `NEXT_PUBLIC_` prefix is used for client-side variables

### "Database connection fails"
- Verify Supabase project is active
- Check that API keys are correct
- Make sure Supabase allows connections from your domain

### "Emails not sending"
- Verify Resend API key is correct
- Check Resend dashboard for delivery logs
- Ensure email domain is verified in Resend

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- Check deployment logs in your hosting dashboard
