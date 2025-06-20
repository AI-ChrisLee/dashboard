# YouTube Viral Video Dashboard - Project Plan

## Project Overview
A Next.js-based dashboard that helps users discover viral YouTube videos within specific keywords/niches. The core functionality calculates a "viral potential score" based on the formula: (Low Subscriber Count) × Views × Engagement Rate over the last 30 days.

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Data Fetching**: TanStack Query
- **State Management**: Zustand or Context API
- **API Integration**: YouTube Data API v3
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel
- **Analytics**: Posthog or Plausible

## High-Level Checkpoints

### Checkpoint 1: Project Setup & Foundation
**Goal**: Establish the development environment and basic project structure

**Tasks**:
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS and shadcn/ui
- [ ] Set up ESLint and Prettier
- [ ] Create project folder structure
- [ ] Set up Git repository and .gitignore
- [ ] Configure environment variables structure
- [ ] Set up basic layout components
- [ ] Create initial routing structure

### Checkpoint 2: YouTube API Integration
**Goal**: Establish connection with YouTube API and create data fetching layer

**Tasks**:
- [ ] Set up YouTube Data API credentials
- [ ] Create API client wrapper for YouTube API
- [ ] Implement video search by keyword functionality
- [ ] Implement channel details fetching
- [ ] Implement video statistics fetching
- [ ] Create rate limiting and quota management
- [ ] Set up error handling for API calls
- [ ] Create data transformation utilities

### Checkpoint 3: Database Design & Setup
**Goal**: Design and implement database schema for caching and user data

**Tasks**:
- [ ] Design database schema (videos, channels, searches, users)
- [ ] Set up PostgreSQL database
- [ ] Configure Prisma ORM
- [ ] Create database migrations
- [ ] Implement data models
- [ ] Create seed data scripts
- [ ] Set up database connection pooling
- [ ] Implement caching strategy for API responses

### Checkpoint 4: Core Algorithm Implementation
**Goal**: Implement the viral score calculation algorithm

**Tasks**:
- [ ] Define viral score formula precisely
- [ ] Create score calculation service
- [ ] Implement subscriber count weighting (lower is better)
- [ ] Implement view count normalization
- [ ] Calculate engagement rate (likes + comments / views)
- [ ] Add time decay factor for 30-day window
- [ ] Create score ranking system
- [ ] Add score explanation/breakdown feature

### Checkpoint 5: Search & Filter System
**Goal**: Build robust search functionality with filters

**Tasks**:
- [ ] Create search input component with debouncing
- [ ] Implement keyword search API endpoint
- [ ] Add search history functionality
- [ ] Create filter UI components
- [ ] Implement filter by date range
- [ ] Implement filter by subscriber count ranges
- [ ] Implement filter by view count ranges
- [ ] Add sort options (by score, views, date, etc.)
- [ ] Create saved searches feature

### Checkpoint 6: Dashboard UI Development
**Goal**: Create the main dashboard interface

**Tasks**:
- [ ] Design dashboard layout wireframes
- [ ] Create video card component
- [ ] Implement dashboard grid/list view toggle
- [ ] Create score visualization component
- [ ] Add video preview on hover
- [ ] Implement pagination or infinite scroll
- [ ] Create loading states and skeletons
- [ ] Add empty states
- [ ] Implement responsive design

### Checkpoint 7: Analytics & Insights
**Goal**: Provide deeper insights into viral trends

**Tasks**:
- [ ] Create trends visualization charts
- [ ] Implement keyword performance tracking
- [ ] Add channel growth tracking
- [ ] Create viral video timeline view
- [ ] Implement comparison features
- [ ] Add export functionality (CSV/PDF)
- [ ] Create insights summary cards
- [ ] Build notification system for new viral videos

### Checkpoint 8: User Authentication & Personalization
**Goal**: Add user accounts and personalization features

**Tasks**:
- [ ] Implement NextAuth.js configuration
- [ ] Create login/signup pages
- [ ] Add social login options
- [ ] Implement user profile management
- [ ] Create user preferences system
- [ ] Add saved videos functionality
- [ ] Implement watchlists
- [ ] Create personalized recommendations

### Checkpoint 9: Performance Optimization
**Goal**: Optimize application performance and user experience

**Tasks**:
- [ ] Implement server-side rendering where needed
- [ ] Add image optimization
- [ ] Implement lazy loading
- [ ] Set up Redis caching
- [ ] Optimize database queries
- [ ] Add API response caching
- [ ] Implement progressive web app features
- [ ] Add performance monitoring

### Checkpoint 10: Testing & Quality Assurance
**Goal**: Ensure application reliability and quality

**Tasks**:
- [ ] Set up Jest and React Testing Library
- [ ] Write unit tests for core algorithms
- [ ] Create integration tests for API endpoints
- [ ] Implement E2E tests with Playwright
- [ ] Add error tracking (Sentry)
- [ ] Create user acceptance test scenarios
- [ ] Perform accessibility audit
- [ ] Conduct security review

### Checkpoint 11: Deployment & Launch
**Goal**: Deploy application to production

**Tasks**:
- [ ] Set up Vercel project
- [ ] Configure production environment variables
- [ ] Set up CI/CD pipeline
- [ ] Configure custom domain
- [ ] Implement monitoring and logging
- [ ] Create backup strategies
- [ ] Set up SSL certificates
- [ ] Create launch checklist

## Agent Instructions

### Marketing Background Agent Instructions
**Role**: Analyze market positioning and user acquisition strategies

**Tasks**:
1. Research competitor analysis:
   - Identify similar YouTube analytics tools
   - Analyze their pricing models
   - Document their key features and USPs
   - Identify market gaps

2. Define target audience:
   - Create user personas (content creators, marketers, researchers)
   - Identify pain points in current solutions
   - Map user journey from discovery to conversion

3. Develop positioning strategy:
   - Create unique value proposition
   - Define key messaging pillars
   - Suggest pricing tiers and features
   - Plan content marketing strategy

4. Growth strategy:
   - Recommend user acquisition channels
   - Suggest viral growth mechanics
   - Plan referral/affiliate programs
   - Define success metrics and KPIs

### Researcher Agent Instructions
**Role**: Deep dive into user needs and YouTube ecosystem

**Tasks**:
1. User research:
   - Conduct surveys/interviews with YouTube creators
   - Analyze common workflows for finding trending content
   - Document feature requests and pain points
   - Study user behavior patterns

2. YouTube platform research:
   - Analyze YouTube algorithm changes
   - Study viral video patterns across niches
   - Research engagement metrics that matter
   - Document API limitations and workarounds

3. Technical research:
   - Evaluate best practices for YouTube API usage
   - Research optimal caching strategies
   - Study performance optimization techniques
   - Analyze security considerations

4. Competitive feature analysis:
   - Deep dive into TubeBuddy, VidIQ features
   - Analyze social media monitoring tools
   - Study trend detection algorithms
   - Document innovative features to consider

### Feature Planning Agent Instructions
**Role**: Create detailed product roadmap and feature specifications

**Tasks**:
1. MVP Definition:
   - Define core features for initial release
   - Create feature priority matrix
   - Estimate development timeline
   - Identify technical dependencies

2. Feature Roadmap (6-month plan):
   - **Month 1-2**: Core search and scoring
   - **Month 3-4**: Advanced analytics and insights
   - **Month 5-6**: AI-powered recommendations and predictions

3. Feature Specifications:
   - Create detailed user stories
   - Define acceptance criteria
   - Document API requirements
   - Specify data models

4. Future Vision:
   - AI-powered content suggestions
   - Multi-platform support (TikTok, Instagram)
   - Creator collaboration features
   - Monetization insights
   - Automated content planning

## Success Metrics
- User engagement: Daily active users, session duration
- Search accuracy: Relevance of viral video discoveries
- Performance: Page load times < 2s, API response times < 500ms
- Business metrics: User retention, conversion rates
- Technical metrics: API quota efficiency, cache hit rates

## Risk Mitigation
1. **YouTube API Quotas**: Implement aggressive caching, user-based rate limiting
2. **Data Accuracy**: Regular validation against YouTube's actual data
3. **Scalability**: Design for horizontal scaling from day one
4. **Competition**: Focus on unique scoring algorithm and user experience
5. **Monetization**: Plan freemium model with clear upgrade paths

## Timeline Estimate
- **Phase 1** (Checkpoints 1-4): 3-4 weeks
- **Phase 2** (Checkpoints 5-7): 4-5 weeks  
- **Phase 3** (Checkpoints 8-11): 3-4 weeks
- **Total estimate**: 10-13 weeks for full production release

## Next Steps
1. Review and refine this plan
2. Set up development environment
3. Begin with Checkpoint 1 tasks
4. Schedule regular progress reviews
5. Engage agents for their specific research tasks