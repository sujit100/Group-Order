# How to Share Your Group Order

Yes! You can absolutely share the URL with others so they can add items to the cart. Here's how:

## Quick Answer

**Share this link with your friends:**
```
http://localhost:3000/join-group?code=YOURCODE
```

Or use the "Show Share Options" button on your group dashboard to copy the link easily.

---

## How It Works

### Step 1: Create or Open Your Group
- Create a new group or open an existing one
- You'll see your **Group Code** displayed prominently

### Step 2: Share the Join Link
On your group dashboard, click **"Show Share Options"** to see:

1. **Join Link** - Copy this and share it with your friends
   - Example: `http://localhost:3000/join-group?code=ABC123`
   - When they open it, the group code is automatically filled in
   - They just need to enter their email and first name

### Step 3: Friends Join the Group
- Friends click your shared link
- They enter their email and first name
- They're automatically added to the group
- They can now browse restaurants and add items to the cart

### Step 4: Real-time Cart Updates
- As anyone adds items, **everyone sees the updates instantly**
- Each item shows who added it (by first name)
- Multiple people can add items simultaneously

---

## Sharing Methods

### Option 1: Copy the Link
1. Click "Show Share Options" on your group dashboard
2. Click "Copy" next to the Join Link
3. Share via text, email, WhatsApp, etc.

### Option 2: Native Share (Mobile)
On mobile devices, you'll see a "Share Group" button that uses your device's native sharing (text, email, etc.)

### Option 3: Share the Group Code
You can also just share the 6-character code (e.g., "ABC123") and tell them to:
1. Go to the app
2. Click "Join Existing Group"
3. Enter the code

---

## Important Notes

### Local Development (localhost)
⚠️ **If you're testing locally:**
- The URL will be `http://localhost:3000/join-group?code=ABC123`
- **This only works on your computer** - others can't access localhost
- For real sharing, you need to deploy the app (see below)

### Production Deployment
✅ **For real sharing with friends:**
- Deploy your app to Vercel, Netlify, or similar
- The URL will be like: `https://your-app.vercel.app/join-group?code=ABC123`
- Anyone with the link can join from anywhere

---

## Example Sharing Flow

1. **You (Alice)** create a group → Get code: `XYZ789`
2. **You share link**: `https://your-app.com/join-group?code=XYZ789`
3. **Friend (Bob)** clicks link → Sees join form with code pre-filled
4. **Bob enters** email: `bob@example.com`, name: `Bob`
5. **Bob joins** → Can now see the group and add items
6. **Real-time magic**: Both of you see items appear instantly!

---

## Testing Locally

To test sharing on your own computer:

1. Open your group in one browser (e.g., Chrome)
2. Open an **incognito/private window** in another browser (e.g., Safari)
3. Copy the join link from the first browser
4. Paste it in the incognito window
5. Join with a different email/name
6. Both windows will show real-time cart updates!

---

## Troubleshooting

### "Link doesn't work"
- Make sure you're sharing the full URL
- Check that the group code is correct
- Verify the app is running/deployed

### "Friends can't access localhost"
- Deploy the app to make it accessible
- Or test using incognito windows on the same computer

### "Code not pre-filled"
- Make sure the URL includes `?code=ABC123` at the end
- The code should match exactly (case-sensitive)

---

## Pro Tips

1. **Group Code is Permanent** - Once created, the code stays the same
2. **Unlimited Members** - Any number of people can join
3. **No Login Required** - Just email and first name
4. **Share Anytime** - Even after items are added to cart

Happy sharing! 🎉
