# YouTube Viral Video Dashboard

A Next.js application for discovering viral YouTube videos within specific keywords/niches. The dashboard calculates a "viral potential score" based on channel size, views, and engagement metrics.

## Features

- **Keyword Search**: Search for videos by keyword (e.g., "vibe coding")
- **Viral Score Algorithm**: (Low Subscriber Count) × Views × Engagement Rate
- **30-Day Analysis**: Focuses on recent viral trends
- **Advanced Filtering**: Filter by date, views, subscriber count
- **Real-time Updates**: Track viral videos as they emerge

## Tech Stack

- **Frontend**: Next.js 14+, React, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Data**: YouTube Data API v3
- **State**: TanStack Query
- **Database**: PostgreSQL with Prisma ORM

## Getting Started

### Prerequisites
- Node.js 18+
- YouTube Data API Key
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd youtube-viral-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your YouTube API key and database URL

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Project Structure

```
src/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── dashboard/       # Dashboard pages
│   └── search/          # Search functionality
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── dashboard/      # Dashboard-specific components
├── lib/                # Utilities and helpers
│   ├── youtube/        # YouTube API integration
│   └── scoring/        # Viral score algorithm
└── types/              # TypeScript types
```

## Environment Variables

```env
# YouTube API
YOUTUBE_API_KEY=your_api_key_here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/viral_dashboard

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development

```bash
# Run development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Run linting
npm run lint
```

## License

MIT