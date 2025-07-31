<<<<<<< HEAD
# PLantum-2.0
PLantum 2.0
=======
# Plantum - Business Payment Platform

A modern payment platform for businesses to manage payments, withdrawals, and analytics.

## Features

- 🔐 Secure authentication and authorization
- 💼 Business onboarding and management
- 💳 Multiple payment provider support
- 💰 Withdrawal management
- 📊 Business analytics and reporting
- 👥 User management
- ⚙️ Platform settings and configuration

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma
- **Authentication**: Supabase Auth
- **UI**: Shadcn UI + Tailwind CSS
- **Payment**: Stripe, PayFast
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+
- PostgreSQL
- Supabase account
- Stripe account
- PayFast account

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/plantum.git
   cd plantum
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables in `.env.local`

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
plantum/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin routes
│   ├── api/               # API routes
│   ├── auth/              # Authentication routes
│   └── business/          # Business routes
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── business/         # Business components
│   └── ui/               # UI components
├── lib/                   # Utility functions
│   ├── payment/          # Payment processing
│   └── utils/            # Helper functions
├── prisma/               # Database schema
└── public/               # Static assets
```

## API Documentation

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Business

- `GET /api/business/profile` - Get business profile
- `PUT /api/business/profile` - Update business profile
- `GET /api/business/analytics` - Get business analytics
- `POST /api/business/withdraw` - Request withdrawal

### Admin

- `GET /api/admin/dashboard` - Get admin dashboard data
- `GET /api/admin/users` - Get users list
- `GET /api/admin/businesses` - Get businesses list
- `POST /api/admin/actions` - Perform admin actions
- `GET /api/admin/settings` - Get platform settings
- `POST /api/admin/settings` - Update platform settings

## Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@plantum.com or join our Slack channel.

>>>>>>> 8cb17f7 (Initial commit)
