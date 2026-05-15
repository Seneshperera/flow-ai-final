# FlowPilot AI - Final Version

This is the production-ready version of FlowPilot AI, optimized for deployment on Vercel.

## 🚀 Easy Deployment on Vercel

1.  **Push to GitHub**: This repo is already set up for Vercel.
2.  **Connect to Vercel**: Import this project in your Vercel Dashboard.
3.  **Environment Variables**: Add the following variables in Vercel settings:

### Required Variables:
- `DATABASE_URL`: Your PostgreSQL connection string (Supabase/Neon/etc.)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: From your Clerk dashboard.
- `CLERK_SECRET_KEY`: From your Clerk dashboard.
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: `/login`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: `/register`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`: `/onboarding`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: `/onboarding`

### Optional (WhatsApp Integration):
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_VERIFY_TOKEN`

## 🛠 Features
- **AI-Powered POS**: Modern, fast point of sale.
- **Inventory Management**: Real-time tracking and analytics.
- **Clerk Auth**: Secure, high-performance authentication.
- **Prisma ORM**: Type-safe database access.

## 📦 Build Command
Vercel will automatically use the correct build command from `package.json`:
```bash
prisma generate && next build
```

## 📄 License
MIT
