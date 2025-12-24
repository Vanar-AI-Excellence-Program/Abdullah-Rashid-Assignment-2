# AuthApp - Full-Stack Authentication with AI Chat

A modern authentication application built with SvelteKit 5, featuring email/password auth, OAuth (Google & GitHub), admin dashboard, and AI-powered chat using Google Gemini.

![SvelteKit](https://img.shields.io/badge/SvelteKit-5.0-orange)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

### Authentication & Authorization
- ✅ Email/Password registration & login
- ✅ Database sessions (PostgreSQL) - no JWT
- ✅ Protected routes
- ✅ Role-based access control (User/Admin)
- ✅ Admin secret key protection

### OAuth Integration
- ✅ Google Sign-In
- ✅ GitHub Sign-In

### Email Flows
- ✅ Email verification on signup
- (If you want to skip email verification just comment out lines 35-42 in src/routes/api/auth/login/+server.ts)
- ✅ Password reset via secure link

### Admin Dashboard
- ✅ View all registered users
- ✅ User analytics & statistics
- ✅ Role management (promote/demote)
- ✅ User status control (enable/disable)
- ✅ Delete users

### AI Chat Interface
- ✅ Google Gemini integration (gemini-2.5-flash)
- ✅ Real-time streaming responses
- ✅ Markdown rendering (code blocks, lists, tables)
- ✅ Per-user chat history
- ✅ Multiple conversations
- ✅ Auto-generated titles

## Tech Stack

| Technology | Purpose |
|------------|---------|
| SvelteKit 5 | Full-stack framework |
| PostgreSQL | Database |
| Drizzle ORM | Database queries & migrations |
| TailwindCSS | Styling |
| Vercel AI SDK | AI integration |
| Google Gemini | AI model |
| Arctic | OAuth handling |
| Nodemailer | Email sending |
| bcryptjs | Password hashing |

## Prerequisites

- Node.js 18+ 
- npm
- Docker & Docker Compose
- Google Cloud Console account (for OAuth & Gemini API)
- GitHub OAuth App
- SMTP credentials (Gmail recommended)

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/auth-app.git
cd my-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/auth_db"

# OAuth - Google (https://console.cloud.google.com)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OAuth - GitHub (https://github.com/settings/developers)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Email (SMTP) - Gmail App Password recommended
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="your-email@gmail.com"

# App URL
APP_URL="http://localhost:5173"

# AI - Gemini (https://aistudio.google.com)
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

# Admin Registration Secret Key
ADMIN_SECRET_KEY="your-secret-admin-key"
```

### 4. Start PostgreSQL database
```bash
npm run db:start
```

### 5. Push database schema
```bash
npm run db:push
```

### 6. Start development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run db:start` | Start PostgreSQL container |
| `npm run db:stop` | Stop PostgreSQL container |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |

## Database Management

### View database with Drizzle Studio
```bash
npm run db:studio
```

Opens at [https://local.drizzle.studio](https://local.drizzle.studio)

### Database Schema

| Table | Description |
|-------|-------------|
| `users` | User accounts |
| `accounts` | OAuth provider connections |
| `sessions` | Database sessions |
| `verification_tokens` | Email verification |
| `password_reset_tokens` | Password reset |
| `chat_conversations` | User chat threads |
| `chat_messages` | Chat messages |

## Project Structure
```
auth-app/
├── .github/
│   └── workflows/
│       └── ci.yml                      # GitHub Actions CI/CD pipeline
│
├── src/
│   ├── app.d.ts                        # TypeScript type declarations
│   ├── app.html                        # HTML template
│   ├── hooks.server.ts                 # Server hooks (auth middleware)
│   │
│   ├── lib/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── ChatInput.svelte        # Chat message input component
│   │   │   │   ├── ChatMessage.svelte      # Single chat message display
│   │   │   │   ├── ConversationList.svelte # Sidebar conversation list
│   │   │   │   └── MarkdownRenderer.svelte # Markdown to HTML renderer
│   │   │   │
│   │   │   ├── Alert.svelte            # Alert/notification component
│   │   │   ├── Button.svelte           # Reusable button component
│   │   │   └── Input.svelte            # Form input component with icons
│   │   │
│   │   └── server/
│   │       ├── db/
│   │       │   ├── index.ts            # Database connection
│   │       │   └── schema.ts           # Drizzle schema definitions
│   │       │
│   │       ├── chat/
│   │       │   └── index.ts            # Chat service functions
│   │       │
│   │       ├── email.ts                # Email sending utilities
│   │       ├── oauth.ts                # OAuth provider configurations
│   │       └── session.ts              # Session management utilities
│   │
│   └── routes/
│       ├── +layout.svelte              # Root layout component
│       ├── +layout.server.ts           # Root layout server load
│       ├── +page.svelte                # Home page
│       ├── +page.server.ts             # Home page server load
│       │
│       ├── api/
│       │   ├── auth/
│       │   │   ├── forgot-password/
│       │   │   │   └── +server.ts      # POST: Send password reset email
│       │   │   │
│       │   │   ├── login/
│       │   │   │   └── +server.ts      # POST: Email/password login
│       │   │   │
│       │   │   ├── logout/
│       │   │   │   └── +server.ts      # POST: Logout user
│       │   │   │
│       │   │   ├── register/
│       │   │   │   └── +server.ts      # POST: Register new user
│       │   │   │
│       │   │   ├── resend-verification/
│       │   │   │   └── +server.ts      # POST: Resend verification email
│       │   │   │
│       │   │   ├── reset-password/
│       │   │   │   └── +server.ts      # POST: Reset password with token
│       │   │   │
│       │   │   └── verify-email/
│       │   │       └── +server.ts      # POST: Verify email with token
│       │   │
│       │   ├── admin/
│       │   │   └── users/
│       │   │       ├── +server.ts      # GET: List all users with stats
│       │   │       └── [id]/
│       │   │           └── +server.ts  # PATCH: Update user, DELETE: Remove user
│       │   │
│       │   ├── chat/
│       │   │   ├── +server.ts          # POST: Send message (streaming)
│       │   │   └── conversations/
│       │   │       ├── +server.ts      # GET: List user conversations
│       │   │       └── [id]/
│       │   │           └── +server.ts  # GET: Messages, DELETE: Conversation
│       │   │
│       │   └── user/
│       │       └── profile/
│       │           └── +server.ts      # PUT: Update user profile
│       │
│       ├── auth/
│       │   ├── forgot-password/
│       │   │   └── +page.svelte        # Forgot password page
│       │   │
│       │   ├── login/
│       │   │   ├── github/
│       │   │   │   ├── +server.ts      # GET: Initiate GitHub OAuth
│       │   │   │   └── callback/
│       │   │   │       └── +server.ts  # GET: GitHub OAuth callback
│       │   │   │
│       │   │   └── google/
│       │   │       ├── +server.ts      # GET: Initiate Google OAuth
│       │   │       └── callback/
│       │   │           └── +server.ts  # GET: Google OAuth callback
│       │   │
│       │   ├── reset-password/
│       │   │   └── +page.svelte        # Reset password page
│       │   │
│       │   ├── signin/
│       │   │   └── +page.svelte        # Sign in page
│       │   │
│       │   ├── signup/
│       │   │   └── +page.svelte        # Sign up page
│       │   │
│       │   └── verify-email/
│       │       └── +page.svelte        # Email verification page
│       │
│       ├── admin/
│       │   ├── +page.svelte            # Admin dashboard page
│       │   └── +page.server.ts         # Admin page server load (auth check)
│       │
│       ├── chat/
│       │   ├── +page.svelte            # AI chat interface page
│       │   └── +page.server.ts         # Chat page server load (auth check)
│       │
│       ├── dashboard/
│       │   ├── +page.svelte            # User dashboard page
│       │   └── +page.server.ts         # Dashboard page server load
│       │
│       └── profile/
│           ├── +page.svelte            # Profile management page
│           └── +page.server.ts         # Profile page server load
│
├── static/
│   └── favicon.png                     # App favicon
│
├── .env                                # Environment variables (not in git)
├── .env.example                        # Environment variables template
├── .gitignore                          # Git ignore rules
├── docker-compose.yml                  # Docker PostgreSQL configuration
├── drizzle.config.ts                   # Drizzle ORM configuration
├── eslint.config.js                    # ESLint configuration
├── package.json                        # Project dependencies & scripts
├── postcss.config.js                   # PostCSS configuration
├── README.md                           # Project documentation
├── svelte.config.js                    # SvelteKit configuration
├── tailwind.config.ts                  # TailwindCSS configuration
├── tsconfig.json                       # TypeScript configuration
└── vite.config.ts                      # Vite configuration
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/verify-email` | Verify email with token |
| POST | `/api/auth/forgot-password` | Send password reset email |
| POST | `/api/auth/reset-password` | Reset password with token |
| POST | `/api/auth/resend-verification` | Resend verification email |

### OAuth

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/login/google` | Initiate Google OAuth |
| GET | `/auth/login/google/callback` | Google OAuth callback |
| GET | `/auth/login/github` | Initiate GitHub OAuth |
| GET | `/auth/login/github/callback` | GitHub OAuth callback |

### User

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/user/profile` | Update user profile |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users with stats |
| PATCH | `/api/admin/users/[id]` | Update user role/status |
| DELETE | `/api/admin/users/[id]` | Delete user |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message (streaming response) |
| GET | `/api/chat/conversations` | Get user's conversations |
| GET | `/api/chat/conversations/[id]` | Get conversation messages |
| DELETE | `/api/chat/conversations/[id]` | Delete conversation |

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth Client ID
5. Application type: Web application
6. Authorized redirect URIs: `http://localhost:5173/auth/login/google/callback`
7. Copy Client ID and Client Secret to `.env`

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. New OAuth App
3. Authorization callback URL: `http://localhost:5173/auth/login/github/callback`
4. Copy Client ID and Client Secret to `.env`

## Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Google account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use this password as `SMTP_PASS` in `.env`

## Gemini API Setup

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Get API Key
3. Copy to `GOOGLE_GENERATIVE_AI_API_KEY` in `.env`

## Troubleshooting

### Database connection failed
```bash
# Make sure Docker is running
docker ps

# Restart the database
npm run db:stop
npm run db:start

# Wait a few seconds, then push schema
npm run db:push
```

### OAuth callback error

- Verify redirect URIs match exactly in provider settings
- Check that `APP_URL` in `.env` matches your dev server URL

### Email not sending

- Verify SMTP credentials
- For Gmail, ensure you're using an App Password, not your regular password
- Check spam folder

### Gemini API error

- Verify API key is valid
- Check model name is correct (`gemini-2.5-flash`)
- Ensure API is enabled in Google Cloud Console

## Fresh Clone Validation
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/auth-app.git
cd auth-app

# 2. Copy environment file
cp .env.example .env
# Fill in your secrets

# 3. Start database
npm run db:start

# 4. Install dependencies and setup
npm install
npm run db:push

# 5. Start development server
npm run dev
```

