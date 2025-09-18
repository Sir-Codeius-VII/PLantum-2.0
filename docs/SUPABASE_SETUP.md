# 🚀 Supabase Setup Guide

## Why We Need Real Supabase

You're absolutely right! We DO want Supabase to work. The mock authentication was just for testing when Supabase wasn't configured. Now let's set up the real thing!

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login with your account
3. Click "New Project"
4. Choose your organization
5. Fill in:
   - **Name**: `PLantum-2.0`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to South Africa (Europe or Asia)
6. Click "Create new project"

## Step 2: Get Your Credentials

1. Go to your project dashboard
2. Click on "Settings" → "API"
3. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)
   - **service_role** key (starts with `eyJ`)

## Step 3: Update Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key_here

# Payment Gateway (PayFast)
PAYFAST_MERCHANT_ID=your_payfast_merchant_id_here
PAYFAST_MERCHANT_KEY=your_payfast_merchant_key_here
PAYFAST_PASSPHRASE=your_payfast_passphrase_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Set Up Database Tables

1. Go to your Supabase project
2. Click "SQL Editor"
3. Run this SQL to create the basic tables:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create likes table
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Set up Row Level Security policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view all posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view all comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Users can create likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON likes FOR DELETE USING (auth.uid() = user_id);
```

## Step 5: Test the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000`
3. Try signing up with a real email
4. Check your Supabase dashboard → "Authentication" → "Users" to see the new user

## What This Gives You

✅ **Real user authentication**  
✅ **Persistent data storage**  
✅ **User profiles**  
✅ **Posts and comments**  
✅ **Likes and interactions**  
✅ **Secure data access**  

## Next Steps

Once Supabase is set up, you can:
- Add more database tables for startups, investors, funding rounds
- Set up real-time subscriptions for live updates
- Add file storage for images and documents
- Configure email templates for notifications

The platform will be fully functional with real data persistence! 🎉

