# How to Run and Test the Group Ordering App

## Step-by-Step Setup

### Step 1: Check Prerequisites

First, make sure you have Node.js installed:

```bash
node --version  # Should be 18 or higher
npm --version   # Should be 9 or higher
```

If Node.js isn't installed, download it from [nodejs.org](https://nodejs.org/).

---

### Step 2: Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This will install all required packages. Wait for it to complete (may take 1-2 minutes).

---

### Step 3: Set Up Supabase (Required)

#### 3a. Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up (free tier works)
3. Click "New Project"
4. Fill in:
   - **Name**: `group-ordering` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
5. Click "Create new project" and wait 2-3 minutes for setup

#### 3b. Create Database Tables

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Open the file `supabase-schema.sql` from this project
4. Copy **ALL** the contents of that file
5. Paste into the SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned" - this is correct!

#### 3c. Get Your Supabase Keys

1. In Supabase dashboard, click **"Settings"** (gear icon) → **"API"**
2. Copy these three values (you'll need them in Step 5):
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - click "Reveal")

⚠️ **Important**: Keep the service_role key secret! Never commit it to git.

#### 3d. Enable Realtime (Verify)

1. Go to **"Database"** → **"Replication"** in the sidebar
2. Verify that `cart_items`, `groups`, and `orders` tables show as "Replicating"
   - If not, the SQL schema should have enabled it automatically
   - If needed, you can manually enable from this screen

---

### Step 4: Set Up Resend for Email (Required for Invoices)

#### 4a. Create Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up (free tier includes 100 emails/day - perfect for testing)
3. Verify your email address

#### 4b. Get API Key

1. In Resend dashboard, click **"API Keys"** in sidebar
2. Click **"Create API Key"**
3. Name it: `group-ordering-dev`
4. Copy the API key (starts with `re_`)

#### 4c. Set Up Sender Email

**Option A: Use Test Domain (Quick Setup for Testing)**
1. In Resend dashboard, go to **"Domains"**
2. You can use the test domain they provide (like `onboarding@resend.dev`)
3. Note: Test domain emails may not deliver to all providers

**Option B: Verify Your Domain (Recommended)**
1. In Resend dashboard, click **"Add Domain"**
2. Follow their instructions to add DNS records
3. Wait for verification (can take a few minutes)

For testing, Option A is fine. Use the email address shown in the domains section.

---

### Step 5: Configure Environment Variables

1. In the project root, create a file named `.env.local`:

```bash
# On Mac/Linux:
touch .env.local

# Or just create it in your editor
```

2. Copy the contents from `env.local.example`:

```bash
# On Mac/Linux:
cp env.local.example .env.local
```

3. Open `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM_ADDRESS=onboarding@resend.dev
```

Replace the placeholder values with your actual keys from Steps 3c and 4b.

---

### Step 6: Start the Development Server

```bash
npm run dev
```

You should see:
```
> group-ordering@0.1.0 dev
> next dev

   ▲ Next.js 14.2.5
   - Local:        http://localhost:3000
   - Ready in 2.3s
```

Open your browser to [http://localhost:3000](http://localhost:3000)

---

## Testing the Application

### Test 1: Create a Group

1. On the homepage, click **"Create New Group"**
2. Enter:
   - **Email**: `test1@example.com`
   - **First Name**: `Alice`
3. Click **"Create Group"**
4. You should be redirected to the group dashboard with a 6-character code
5. **Copy the group code** (you'll need it for the next test)

### Test 2: Join Group (Simulate Multiple Users)

1. Open a **new incognito/private window** (or different browser)
2. Go to [http://localhost:3000](http://localhost:3000)
3. Click **"Join Existing Group"**
4. Enter:
   - **Group Code**: Paste the code from Test 1
   - **Email**: `test2@example.com`
   - **First Name**: `Bob`
5. Click **"Join Group"**

You should see the same group dashboard!

### Test 3: Real-time Cart (The Cool Part!)

**In Window 1 (Alice):**
1. Click **"Search Restaurants"**
2. Select a restaurant (e.g., "Bella Italia")
3. Add a few items to the cart with different quantities
4. Click **"View Cart"**

**In Window 2 (Bob - incognito):**
1. Also navigate to Search Restaurants
2. Select the same restaurant
3. Add different items to the cart
4. Click **"View Cart"**

**Watch the Magic:**
- In Window 1, refresh or just watch - you should see Bob's items appear!
- In Window 2, you should see Alice's items!
- Items are grouped by who added them
- Try adding more items from either window - they appear in real-time!

### Test 4: Checkout and Invoice

1. In either window, go to the cart
2. Click **"Proceed to Checkout"**
3. Set:
   - **Tax Rate**: `8.5` (for 8.5%)
   - **Tip Rate**: `18` (for 18%)
4. Review the order summary
5. Click **"Place Order"**

**Check Your Email:**
- Alice should receive an email at `test1@example.com`
- Bob should receive an email at `test2@example.com`
- Each email has a PDF invoice attached
- The invoice shows only their items and their proportional share of tax/tip

### Test 5: Order Status & Payment

1. After checkout, you'll be redirected to Order Status
2. View the order breakdown by person
3. Click **"View Payment Details"**
4. If you're the person who placed the order:
   - Enter your Venmo handle (e.g., `@yourname`)
   - Click **"Save"**
   - See the QR code generated
5. Others can scan the QR code to send payment

---

## Testing Checklist

- [ ] Can create a new group
- [ ] Can join an existing group by code
- [ ] Can search and select restaurants
- [ ] Can add items to cart
- [ ] **Real-time updates work** (items appear in other browsers instantly)
- [ ] Cart shows who added each item (first name only)
- [ ] Can proceed to checkout
- [ ] Tax and tip inputs work
- [ ] Order is placed successfully
- [ ] Invoice emails are received (check spam folder)
- [ ] PDF invoice is attached and opens correctly
- [ ] Invoice shows correct items, tax, tip, and total
- [ ] Order status page loads correctly
- [ ] Venmo QR code generates correctly

---

## Troubleshooting

### "Module not found" or dependency errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Failed to connect to Supabase"
- Check your `.env.local` file has the correct values
- Verify Supabase project is active (not paused)
- Check browser console for specific error messages

### "Failed to send invoice email"
- Verify Resend API key is correct
- Check that `EMAIL_FROM_ADDRESS` matches a verified domain in Resend
- Check Resend dashboard → Logs for delivery status
- For testing, use the Resend test domain they provide

### Real-time updates not working
- Open browser console (F12) and check for WebSocket errors
- Verify Realtime is enabled in Supabase (Database → Replication)
- Make sure you ran the complete SQL schema
- Try refreshing both browser windows

### Port 3000 already in use
```bash
# Kill the process using port 3000, or use a different port:
PORT=3001 npm run dev
```

---

## Quick Test Script

Want to test everything quickly? Here's a flow:

1. **Terminal 1**: Run `npm run dev`
2. **Browser 1**: Create group as "Alice" (`alice@test.com`)
3. **Browser 2 (Incognito)**: Join group as "Bob" (`bob@test.com`)
4. **Browser 1**: Add 2 items, quantity 1 each
5. **Browser 2**: Refresh cart - see Alice's items appear in real-time!
6. **Browser 2**: Add 1 item, quantity 2
7. **Browser 1**: Refresh cart - see Bob's item appear!
8. **Either browser**: Checkout with 8% tax, 18% tip
9. **Check emails**: Both should receive PDF invoices

---

## Next Steps After Testing

- Customize restaurant data in `lib/mock-restaurants.ts`
- Add more mock restaurants or menus
- Test with real email addresses
- Deploy to Vercel for production use

Happy testing! 🎉
