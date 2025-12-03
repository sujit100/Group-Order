# Deploy to Vercel from Terminal

You can deploy directly to Vercel using the Vercel CLI! Here's how:

## Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

Or use npx (no installation needed):
```bash
npx vercel
```

## Step 2: Login to Vercel

```bash
vercel login
```

This will open your browser to authenticate.

## Step 3: Deploy

### First Deployment (with setup):

```bash
vercel
```

This will ask you:
- Set up and deploy? → **Y**
- Which scope? → Select your account
- Link to existing project? → **N** (first time)
- Project name? → `group-ordering` (or any name)
- Directory? → `./` (current directory)
- Override settings? → **N**

### Subsequent Deployments:

```bash
vercel --prod
```

This deploys directly to production without prompts.

## Step 4: Set Environment Variables

After first deployment, set your environment variables:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your value when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your value when prompted

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste your value when prompted

vercel env add RESEND_API_KEY
# Paste your value when prompted

vercel env add EMAIL_FROM_ADDRESS
# Paste your value when prompted
```

Or add all at once:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add RESEND_API_KEY production
vercel env add EMAIL_FROM_ADDRESS production
```

After adding env vars, redeploy:
```bash
vercel --prod
```

## Quick Deploy Commands

```bash
# Deploy to preview (staging)
vercel

# Deploy to production
vercel --prod

# Deploy and follow logs
vercel --prod --debug

# List all deployments
vercel ls

# View project info
vercel inspect
```

## Alternative: Deploy Without CLI (GitHub Integration)

1. Push to GitHub
2. Connect repo in Vercel dashboard
3. Vercel auto-deploys on every push

This is usually easier for ongoing development!

## Troubleshooting

### "Command not found: vercel"
Install globally:
```bash
npm install -g vercel
```

Or use npx:
```bash
npx vercel
```

### Environment variables not working
- Make sure you added them for "production" environment
- Redeploy after adding variables: `vercel --prod`

### Build fails
- Check build logs: `vercel logs`
- Test build locally: `npm run build`
