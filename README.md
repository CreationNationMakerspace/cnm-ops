# Makerspace Asset Management System

A comprehensive system for managing assets, tools, and equipment at the makerspace. Built with Next.js, Supabase, and Vercel.

## Features

- **Asset Management**
  - Track tools and machines
  - Monitor maintenance schedules
  - Track usage status
  - Location management
  - Photo documentation
  - Serial number tracking

- **Quest-Master System**
  - Shop-specific quests
  - Maintenance tasks
  - Training requirements
  - Achievement tracking
  - Leaderboards
  - Morgana's guidance

- **Inventory Management**
  - Track consumables
  - Monitor stock levels
  - Set minimum quantity alerts
  - Location tracking

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: Vercel

## Getting Started

### Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new project in Supabase
3. Get your project URL and anon key from the project settings
4. Install Node.js (v18 or later)

### Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
.
├── app/                    # Next.js app directory
│   ├── assets/            # Asset management pages
│   ├── quests/            # Quest-Master system pages
│   ├── inventory/         # Inventory management pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── assets/           # Asset-related components
│   ├── quests/           # Quest-related components
│   ├── inventory/        # Inventory-related components
│   └── ui/               # Shared UI components
├── lib/                   # Utility functions and configurations
│   ├── supabase/         # Supabase client and utilities
│   └── utils/            # Helper functions
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Database Schema

The system uses the following main tables:
- `assets`: Core asset information
- `asset_photos`: Asset photo documentation
- `shops`: Makerspace shop areas
- `quests`: Quest-Master system tasks
- `inventory_items`: Consumable inventory

## Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
