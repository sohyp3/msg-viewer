# WhatsApp Message Viewer

Responsive SvelteKit dashboard for viewing customer WhatsApp messages from a Supabase `messages` table.

## Stack

- SvelteKit + Tailwind CSS
- Supabase Auth + Postgres + Realtime
- Lucide icons (`lucide-svelte`)

## Setup

1. Copy env file:

```sh
cp .env.example .env
```

2. Fill in your Supabase credentials in `.env`.
   - Use `PUBLIC_SUPABASE_PUBLISHABLE_KEY` (recommended)
   - `PUBLIC_SUPABASE_ANON_KEY` is also supported as fallback

3. Install dependencies and run:

```sh
bun install
bun run dev
```

## Required Supabase table

Table: `messages`

- `id` (uuid, primary key)
- `created_at` (timestamptz)
- `wa_no` (text)
- `content` (text)
- `sender` (text, e.g. a customer name or `AI_AGENT_99`)

Also ensure authenticated users can read from `messages` and Realtime is enabled for inserts.

You can run `supabase/messages.sql` in Supabase SQL editor to create the table + policy + realtime publication.
