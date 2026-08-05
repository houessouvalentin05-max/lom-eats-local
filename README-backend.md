# Backend plan for LocalEats

## Stack
- Supabase Auth
- Supabase Postgres
- Supabase Storage (later)
- TanStack Start frontend

## First implementation milestones
1. Create database schema from supabase/schema.sql
2. Configure Supabase env vars
3. Enable Row Level Security policies
4. Connect spot creation and reviews to real Supabase tables
5. Add authentication and profile management
6. Add storage for images and moderation flow

## Security checklist
- Never trust the client for identity
- Always enforce RLS
- Use auth.uid() in policies
- Validate all payloads server-side
- Keep buckets private for uploads
- Add moderation/reporting for user-generated content
