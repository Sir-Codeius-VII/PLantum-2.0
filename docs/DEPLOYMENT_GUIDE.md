# 🚀 PLantum Deployment Guide

## Prerequisites

### Required Accounts & Services
- [ ] **Vercel Account** (Recommended for Next.js)
- [ ] **Supabase Account** (Database & Auth)
- [ ] **Resend Account** (Email service)
- [ ] **PayFast Account** (Payment processing)
- [ ] **Domain Registrar** (Custom domain)
- [ ] **Google Analytics** (Analytics)
- [ ] **Sentry Account** (Error tracking)

### Required Tools
- [ ] **Git** (Version control)
- [ ] **Node.js 18+** (Runtime)
- [ ] **npm/yarn** (Package manager)
- [ ] **Vercel CLI** (Deployment)

## Environment Setup

### 1. Supabase Configuration

```bash
# Create a new Supabase project
# 1. Go to https://supabase.com
# 2. Create new project
# 3. Note down your project URL and anon key
```

**Required Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 2. Database Setup

```sql
-- Run these SQL commands in your Supabase SQL editor

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies (example)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 3. Email Configuration (Resend)

```bash
# 1. Sign up at https://resend.com
# 2. Verify your domain
# 3. Get your API key
```

**Environment Variable:**
```env
RESEND_API_KEY=re_your-resend-api-key
```

### 4. Payment Configuration (PayFast)

```bash
# 1. Sign up at https://www.payfast.co.za
# 2. Complete merchant verification
# 3. Get your merchant credentials
```

**Environment Variables:**
```env
PAYFAST_MERCHANT_ID=your-payfast-merchant-id
PAYFAST_MERCHANT_KEY=your-payfast-merchant-key
PAYFAST_PASSPHRASE=your-payfast-passphrase
```

## Deployment Options

### Option 1: Vercel (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy
```bash
# From your project directory
vercel

# For production deployment
vercel --prod
```

#### 4. Configure Environment Variables
```bash
# Set environment variables in Vercel dashboard
# Or use CLI:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... add all required variables
```

### Option 2: Netlify

#### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### 2. Build and Deploy
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=out
```

### Option 3: Self-Hosted (VPS/Cloud)

#### 1. Server Setup
```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx
```

#### 2. Application Setup
```bash
# Clone repository
git clone https://github.com/your-username/plantum.git
cd plantum

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "plantum" -- start
pm2 save
pm2 startup
```

#### 3. Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Domain & SSL Setup

### 1. Domain Configuration
```bash
# Point your domain to your hosting provider
# Add these DNS records:

# For Vercel:
CNAME www your-project.vercel.app
A @ 76.76.19.61

# For custom domain:
A @ your-server-ip
CNAME www your-domain.com
```

### 2. SSL Certificate
```bash
# Vercel/Netlify: Automatic SSL
# Self-hosted: Use Let's Encrypt

sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Post-Deployment Configuration

### 1. Webhook Configuration

#### PayFast Webhooks
```bash
# Set webhook URL in PayFast dashboard:
https://your-domain.com/api/payments/payfast/webhook

# Test webhook:
curl -X POST https://your-domain.com/api/payments/payfast/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'
```

### 2. Email Templates
```bash
# Configure email templates in Resend dashboard
# Set up these templates:
# - Welcome email
# - Password reset
# - Investment notifications
# - Payment confirmations
```

### 3. Analytics Setup
```bash
# Add Google Analytics tracking code
# Set up conversion tracking
# Configure custom events
```

## Monitoring & Maintenance

### 1. Error Tracking (Sentry)
```bash
# Install Sentry
npm install @sentry/nextjs

# Configure in next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig({
  // Your existing config
}, {
  // Sentry config
});
```

### 2. Performance Monitoring
```bash
# Vercel Analytics (if using Vercel)
# Or use Google Analytics
# Or custom monitoring solution
```

### 3. Backup Strategy
```bash
# Database backups (Supabase handles this)
# File backups (if using file storage)
# Code backups (Git repository)
```

## Security Checklist

### 1. Environment Variables
- [ ] All sensitive data in environment variables
- [ ] No secrets in code repository
- [ ] Production environment variables set
- [ ] Development environment separate

### 2. Database Security
- [ ] Row Level Security enabled
- [ ] Proper policies configured
- [ ] Database backups enabled
- [ ] Access controls in place

### 3. API Security
- [ ] Rate limiting enabled
- [ ] Input validation
- [ ] CORS configured
- [ ] Security headers set

### 4. Authentication
- [ ] Supabase Auth configured
- [ ] Password policies set
- [ ] Session management
- [ ] Multi-factor authentication (optional)

## Testing Deployment

### 1. Smoke Tests
```bash
# Test basic functionality
curl https://your-domain.com/api/health
curl https://your-domain.com/api/auth/session

# Test user registration
curl -X POST https://your-domain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### 2. End-to-End Tests
```bash
# Run your test suite
npm test

# Test user flows manually
# - User registration
# - User login
# - Startup creation
# - Investment flow
# - Payment processing
```

### 3. Performance Tests
```bash
# Test page load times
# Test API response times
# Test database queries
# Test payment processing
```

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check Node.js version
node --version

# Clear cache
rm -rf .next
npm run build
```

#### 2. Environment Variables
```bash
# Verify environment variables are set
vercel env ls

# Check in browser console
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

#### 3. Database Connection
```bash
# Test Supabase connection
# Check RLS policies
# Verify service role key
```

#### 4. Payment Issues
```bash
# Test PayFast integration
# Check webhook configuration
# Verify merchant credentials
```

## Launch Checklist

### Pre-Launch
- [ ] All environment variables configured
- [ ] Database setup complete
- [ ] Payment integration tested
- [ ] Email templates configured
- [ ] SSL certificate active
- [ ] Domain configured
- [ ] Monitoring setup
- [ ] Backup strategy in place

### Launch Day
- [ ] Final deployment
- [ ] Smoke tests passed
- [ ] Performance verified
- [ ] Security scan complete
- [ ] Team ready for support
- [ ] Communication plan active

### Post-Launch
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Monitor payment processing
- [ ] Update documentation
- [ ] Plan next iteration

---

## 🎉 You're Ready to Launch!

Follow this guide step by step, and PLantum will be ready for the world! 🚀

**Need Help?** Check the troubleshooting section or reach out to the development team.
