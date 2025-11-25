# Clinic Backend API

Express server with Supabase integration for Vintage Family Medicine.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your Supabase credentials:
```bash
cp .env.example .env
```

3. Get Supabase credentials:
   - Go to https://supabase.com
   - Create a new project
   - Go to Settings > API
   - Copy the URL and keys

4. Run the server:
```bash
npm run dev
```

The server will run on http://localhost:3001

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/contact` - Submit contact form

## Supabase Setup

Create a table for contact submissions:

```sql
CREATE TABLE contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

