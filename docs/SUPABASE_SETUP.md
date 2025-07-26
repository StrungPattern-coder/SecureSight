# 🚀 Supabase Setup Guide for SecureSight

This guide will help you set up Supabase for your SecureSight surveillance dashboard.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `securesight-dashboard`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"

## 2. Get Your Project Configuration

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (something like `https://xyz.supabase.co`)
   - **Project API keys** → **anon public** key
   - **Project API keys** → **service_role** key (keep this secret!)

3. Go to **Settings** → **Database**
4. Copy the **Connection string** → **URI**

## 3. Update Environment Variables

Replace the values in your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres"

# NextAuth (generate a secure secret)
NEXTAUTH_SECRET=your-nextauth-secret-key-here-generate-a-strong-random-string
NEXTAUTH_URL=http://localhost:3000
```

## 4. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
node scripts/generate-secret.js
```

Copy the generated secret to your `NEXTAUTH_SECRET` environment variable.

## 5. Set Up Database

Run these commands to set up your database:

```bash
# Generate Prisma client for PostgreSQL
npm run db:generate

# Push the schema to Supabase
npm run db:push

# Seed with demo data and users
npm run db:seed
```

## 6. Demo Credentials

After seeding, you can use these demo accounts:

- **Admin**: `admin@example.com` / `admin123`
- **Operator**: `operator@example.com` / `operator123`
- **Viewer**: `viewer@example.com` / `viewer123`

## 7. Optional: Row Level Security (RLS)

For production, enable RLS in Supabase:

1. Go to **Authentication** → **Policies**
2. Enable RLS for your tables
3. Create appropriate policies for your use case

## 8. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` and sign in with the demo credentials!

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check that your Supabase project is active
- Ensure your IP is allowlisted (if using restricted access)

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set and secure
- Check that users exist in the database
- Ensure passwords are hashed correctly

### Environment Variables
- Restart your dev server after changing `.env.local`
- Make sure there are no extra spaces in your environment variables
- Verify all required variables are set

## Production Deployment

When deploying to production:

1. Update `NEXTAUTH_URL` to your production domain
2. Set all environment variables in your hosting platform
3. Enable RLS and set up proper security policies
4. Consider using Supabase's built-in auth instead of NextAuth for better integration

Happy coding! 🛡️
