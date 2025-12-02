# How to Check Your Supabase Connection

There are two ways to check your Supabase connection:

## Method 1: Using the Web Test (Recommended)

1. Make sure your `.env.local` file exists and has your Supabase credentials
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and go to:
   ```
   http://localhost:3000/api/test-supabase
   ```
4. You'll see a JSON response with all the checks and their status

## Method 2: Manual Check

### Step 1: Verify Environment Variables

Check that your `.env.local` file exists and contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**To get these values:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Verify Database Schema

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to SQL Editor
4. Click "New Query"
5. Check if you see tables:
   - `groups`
   - `group_members`
   - `cart_items`
   - `orders`
   - `order_items`
   - `user_order_summary`

**If tables don't exist:**
1. Open `supabase-schema.sql` from this project
2. Copy ALL the contents
3. Paste into Supabase SQL Editor
4. Click "Run" (or press Cmd/Ctrl + Enter)

### Step 3: Verify Realtime

1. Go to Database → Replication in Supabase dashboard
2. Check that these tables show as "Replicating":
   - `cart_items`
   - `groups`
   - `orders`

If they're not replicating, the SQL schema should enable them automatically. You can also enable manually from this screen.

### Step 4: Test Connection

Run the web test:
```bash
npm run dev
# Then visit: http://localhost:3000/api/test-supabase
```

Or manually test by:
1. Starting the app: `npm run dev`
2. Visiting: http://localhost:3000
3. Creating a group

## Common Issues

### ❌ "Tables do not exist"
**Solution:** Run `supabase-schema.sql` in Supabase SQL Editor

### ❌ "Invalid API key" or "JWT error"
**Solution:** 
- Double-check your API keys in `.env.local`
- Make sure there are no extra spaces or quotes
- Get fresh keys from Supabase dashboard

### ❌ "Permission denied"
**Solution:**
- Check that RLS policies are set correctly
- The SQL schema includes permissive policies for development
- If issues persist, check Supabase logs

### ❌ "Connection refused" or "Network error"
**Solution:**
- Verify your Supabase project is active (not paused)
- Check your internet connection
- Verify the Project URL is correct

## Quick Checklist

- [ ] `.env.local` file exists
- [ ] All three Supabase environment variables are set
- [ ] No placeholder values in `.env.local`
- [ ] Database schema has been run (6 tables exist)
- [ ] Realtime is enabled for cart_items, groups, orders
- [ ] Web test at `/api/test-supabase` shows all checks passing

## Still Having Issues?

1. Check the browser console for errors
2. Check Supabase dashboard logs
3. Verify your Supabase project is active
4. Make sure you're using the correct project URL and keys
