# Environment Variables

This document describes all environment variables required for the application.

## Database Configuration

### DATABASE_URL
PostgreSQL connection string.
```
DATABASE_URL=postgresql://user:password@localhost:5432/plantum
```

## Authentication

### NEXT_PUBLIC_SUPABASE_URL
Supabase project URL.
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
```

### NEXT_PUBLIC_SUPABASE_ANON_KEY
Supabase anonymous key for client-side operations.
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### SUPABASE_SERVICE_ROLE_KEY
Supabase service role key for server-side operations.
```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Payment Processing

### STRIPE_SECRET_KEY
Stripe secret key for server-side operations.
```
STRIPE_SECRET_KEY=sk_test_...
```

### STRIPE_WEBHOOK_SECRET
Stripe webhook signing secret.
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

### NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Stripe publishable key for client-side operations.
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### PAYFAST_MERCHANT_ID
PayFast merchant ID.
```
PAYFAST_MERCHANT_ID=your-merchant-id
```

### PAYFAST_MERCHANT_KEY
PayFast merchant key.
```
PAYFAST_MERCHANT_KEY=your-merchant-key
```

### PAYFAST_PASSPHRASE
PayFast passphrase.
```
PAYFAST_PASSPHRASE=your-passphrase
```

## Email Configuration

### SMTP_HOST
SMTP server host.
```
SMTP_HOST=smtp.gmail.com
```

### SMTP_PORT
SMTP server port.
```
SMTP_PORT=587
```

### SMTP_USER
SMTP username.
```
SMTP_USER=your-email@gmail.com
```

### SMTP_PASSWORD
SMTP password or app-specific password.
```
SMTP_PASSWORD=your-password
```

### SMTP_FROM
Default sender email address.
```
SMTP_FROM=noreply@yourdomain.com
```

## Security

### JWT_SECRET
Secret key for JWT token signing.
```
JWT_SECRET=your-jwt-secret
```

### NEXTAUTH_SECRET
Secret key for NextAuth.js.
```
NEXTAUTH_SECRET=your-nextauth-secret
```

### NEXTAUTH_URL
Base URL of your application.
```
NEXTAUTH_URL=http://localhost:3000
```

## Feature Flags

### ENABLE_2FA
Enable two-factor authentication.
```
ENABLE_2FA=true
```

### ENABLE_EMAIL_VERIFICATION
Enable email verification.
```
ENABLE_EMAIL_VERIFICATION=true
```

### ENABLE_RATE_LIMITING
Enable API rate limiting.
```
ENABLE_RATE_LIMITING=true
```

## Limits

### MAX_WITHDRAWAL_AMOUNT
Maximum withdrawal amount.
```
MAX_WITHDRAWAL_AMOUNT=10000
```

### MIN_WITHDRAWAL_AMOUNT
Minimum withdrawal amount.
```
MIN_WITHDRAWAL_AMOUNT=10
```

### SESSION_TIMEOUT
Session timeout in minutes.
```
SESSION_TIMEOUT=60
```

## Development

### NODE_ENV
Environment mode.
```
NODE_ENV=development
```

### DEBUG
Enable debug logging.
```
DEBUG=app:*
```

## Production

### VERCEL_URL
Vercel deployment URL.
```
VERCEL_URL=your-app.vercel.app
```

### VERCEL_ENV
Vercel environment.
```
VERCEL_ENV=production
```

## Setting Up Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the values in `.env` with your actual configuration.

3. For production deployment:
   - Set up environment variables in your hosting platform (e.g., Vercel)
   - Never commit `.env` file to version control
   - Use different values for development and production

## Security Considerations

1. Keep all secrets secure and never expose them in client-side code
2. Use different keys for development and production
3. Regularly rotate sensitive keys
4. Use strong, unique values for all secrets
5. Consider using a secrets management service for production

## Validation

The application validates all required environment variables on startup. Missing or invalid variables will cause the application to fail with clear error messages. 