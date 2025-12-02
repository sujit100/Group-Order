# How to Run the Supabase Connection Test

## Option 1: Web API Test (Easiest - Recommended)

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser and visit:**
   ```
   http://localhost:3000/api/test-supabase
   ```

3. **You'll see a JSON response** with detailed test results showing:
   - ✅ Environment variables status
   - ✅ Database connection test
   - ✅ All 6 tables verification
   - ✅ Basic operations test

## Option 2: Command Line Test

If you have Node.js installed and available:

```bash
node test-supabase.js
```

This will run the same tests from the command line.

---

## What Gets Tested

The test checks:

1. **Environment Variables** - Verifies all required Supabase credentials are set
2. **Database Connection** - Tests connection to your Supabase project
3. **Database Tables** - Checks that all 6 required tables exist:
   - `groups`
   - `group_members`
   - `cart_items`
   - `orders`
   - `order_items`
   - `user_order_summary`
4. **Database Operations** - Tests insert and delete operations

---

## Understanding the Results

### ✅ All Tests Pass
Your Supabase connection is properly configured! You can now:
- Run `npm run dev` to start the app
- Visit `http://localhost:3000` to use the app

### ❌ Some Tests Failed

Common issues and fixes:

#### "Tables do not exist"
**Fix:** Run the database schema in Supabase SQL Editor:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → SQL Editor
3. Open `supabase-schema.sql` from this project
4. Copy all contents and paste into SQL Editor
5. Click "Run"

#### "Invalid API key" or "JWT error"
**Fix:** Check your `.env.local` file:
1. Verify your Supabase URL and keys
2. Make sure there are no extra spaces or quotes
3. Get fresh keys from: Settings → API in Supabase dashboard

#### "Connection failed"
**Fix:** 
1. Verify your Supabase project is active (not paused)
2. Check your internet connection
3. Verify the Project URL is correct

---

## Quick Check

To quickly verify your setup is ready:

1. ✅ `.env.local` file exists
2. ✅ All three Supabase variables are set (no placeholders)
3. ✅ Database schema has been run in Supabase
4. ✅ Test at `/api/test-supabase` shows all checks passing

---

## Need Help?

If tests are failing:
1. Check the error messages in the test output
2. Review `CHECK_SUPABASE.md` for detailed troubleshooting
3. Verify your Supabase project settings in the dashboard
