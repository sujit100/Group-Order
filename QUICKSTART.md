# Quick Start Guide

## Prerequisites Setup

### 1. Supabase Setup (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (choose a region close to you)
3. Wait for the project to finish initializing
4. Go to **SQL Editor** → **New Query**
5. Copy and paste the entire contents of `supabase-schema.sql`
6. Click **Run** to create all tables and policies
7. Go to **Settings** → **API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` key (keep this secret!)

### 2. Resend Setup (3 minutes)

1. Go to [resend.com](https://resend.com) and sign up
2. Get your API key from the dashboard
3. Add and verify a domain, OR use the test domain they provide
   - For testing, you can use their test domain temporarily
   - For production, you'll need to verify your own domain

### 3. Environment Variables (2 minutes)

1. Copy `env.local.example` to `.env.local`:
   ```bash
   cp env.local.example .env.local
   ```

2. Edit `.env.local` and fill in your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   RESEND_API_KEY=re_your_api_key_here
   EMAIL_FROM_ADDRESS=noreply@yourdomain.com
   ```

### 4. Install and Run (2 minutes)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Testing the App

1. **Create a Group**: Click "Create New Group" and enter your email and first name
2. **Search Restaurants**: Browse mock restaurants and select one
3. **Add Items**: Add items to the cart
4. **Open in Another Browser/Incognito**: 
   - Copy the group code
   - Join the group with a different email/name
   - Add items from a different "person"
   - See real-time cart updates!
5. **Checkout**: 
   - Set tax and tip percentages
   - Complete the order
   - Check your email for the PDF invoice

## Important Notes

- **Real-time updates**: Open the same group in multiple browser tabs/windows to see real-time cart synchronization
- **Email testing**: In development, Resend may have rate limits. Check the Resend dashboard for delivery status
- **PDF generation**: Invoices are generated server-side and attached to emails automatically

## Troubleshooting

### "Failed to load cart items"
- Check that Supabase RLS policies are set correctly
- Verify your Supabase URL and keys in `.env.local`

### "Failed to send invoice email"
- Verify your Resend API key
- Check that `EMAIL_FROM_ADDRESS` is a verified email/domain in Resend
- Check the Resend dashboard for delivery errors

### Real-time updates not working
- Ensure Supabase Realtime is enabled (it should be by default)
- Check browser console for WebSocket connection errors
- Verify the tables are added to the Realtime publication in the SQL schema

## Next Steps

- Customize the mock restaurant data in `lib/mock-restaurants.ts`
- Add your own restaurant menus
- Connect to real delivery APIs when available
- Deploy to Vercel for production use
