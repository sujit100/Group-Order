# Group Ordering Web App

A collaborative meal ordering web application for groups traveling together. Multiple people can browse restaurants, add items to a shared cart in real-time, and place a single consolidated order. After checkout, each person receives an individual invoice via email with their proportional share of tax and tips.

## Features

- **Group Management**: Create or join groups with shareable codes
- **Restaurant Search**: Browse and select restaurants (mock data, extensible for delivery APIs)
- **Real-time Cart**: Collaborative cart with live updates showing who added each item
- **Proportional Billing**: Tax and tips are calculated proportionally based on each person's order amount
- **Invoice Generation**: Automatic PDF invoice generation and email delivery to each user
- **Payment Tracking**: Venmo integration for easy payment collection
- **Order Tracking**: View order status and delivery ETA

## Tech Stack

- **Frontend**: Next.js 14+ (App Router) with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime for collaborative features
- **Email**: Resend API for invoice delivery
- **PDF Generation**: @react-pdf/renderer for invoice PDFs
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- A Resend account and API key (for email sending)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the SQL schema from `supabase-schema.sql`
3. Go to Settings > API and copy your project URL and anon key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
```

**Important**: The `.env.local` file is already in `.gitignore` and will not be committed to git.

### 4. Set Up Resend

1. Create an account at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Verify your domain or use Resend's test domain
4. Set `EMAIL_FROM_ADDRESS` to your verified email address

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   └── invoices/            # Invoice generation and email
│   ├── group/                   # Group-specific pages
│   ├── create-group/            # Create new group
│   ├── join-group/              # Join existing group
│   └── page.tsx                 # Home page
├── components/                   # React components
├── hooks/                        # Custom React hooks
├── lib/                          # Utility libraries
│   ├── email/                   # Email service (Resend)
│   ├── pdf/                     # PDF generation
│   ├── supabase/                # Supabase client and operations
│   └── utils/                   # Utility functions
├── types/                        # TypeScript type definitions
└── supabase-schema.sql          # Database schema
```

## Key Features Explained

### Real-time Cart Updates

The app uses Supabase Realtime to provide live updates when items are added, modified, or removed from the cart. All group members see changes instantly.

### Proportional Tax and Tips

When calculating the final order, tax and tips are split proportionally based on each person's order subtotal. For example:
- Person A orders $30 worth of items (60% of $50 total)
- Person B orders $20 worth of items (40% of $50 total)
- If tax is $4, Person A pays $2.40 (60%) and Person B pays $1.60 (40%)

### Invoice Generation

After an order is placed:
1. PDF invoices are generated for each user
2. Invoices include only their items, proportional tax/tip, and total
3. Invoices are emailed automatically with PDF attachments
4. Email delivery status is tracked in the database

### Venmo Integration

The person who places the order can link their Venmo handle. The app generates a QR code that others can scan to send payment directly via the Venmo app.

## Future Enhancements

- Integration with actual delivery APIs (DoorDash, GrubHub, UberEats)
- User authentication system
- Payment processing via Stripe/PayPal
- Venmo API integration for payment tracking
- Order history and reordering

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Yes |
| `RESEND_API_KEY` | Resend API key for email sending | Yes |
| `EMAIL_FROM_ADDRESS` | Verified email address for sending invoices | Yes |

## Security Notes

- Environment variables containing secrets are never exposed to the client
- The service role key is only used server-side
- Row Level Security (RLS) is enabled on all tables (currently permissive for development)
- In production, consider adding authentication and more restrictive RLS policies

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
