# MichaelOS V1.4 — Persistent Build

V1.4 converts the local demo into a Supabase-backed application while preserving Demo Mode.

## What's new

- Supabase email/password authentication
- Persistent Projects, Actions, Waiting On, Decisions, Relationships, and Health data
- Row Level Security tied to the signed-in user
- Automatic starter-portfolio import on first successful login
- Edit project records from the project workspace
- Mark actions complete
- Mark decisions decided
- Sign out
- Demo Mode still works without Supabase

## Run locally in Demo Mode

```bash
npm install
npm run dev
```

Open the Netlify Dev URL (normally `http://localhost:8888`) and click **Enter demo**.

## Connect Supabase

### 1. Create/open a Supabase project

In Supabase, open **SQL Editor**, paste the entire contents of `supabase-schema.sql`, and run it once. The file is safe to run over an earlier MichaelOS schema because the upgrade statements use `if not exists` where needed.

### 2. Create your login

In Supabase go to **Authentication → Users → Add user**. Create the email/password you want to use for MichaelOS.

### 3. Configure local environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env`:

```text
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

The OpenAI key is reserved for the next AI Brief release and is not exposed to the browser.

### 4. Start MichaelOS

```bash
npm run dev
```

Sign in with the Supabase user you created. The first successful login automatically imports the starter portfolio into your private Supabase tables.

## Deploy to Netlify

Create a Netlify site from this folder/repository. In **Site configuration → Environment variables**, add:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY` (reserved for AI Brief)

The included `netlify.toml` publishes the app and enables Netlify Functions. `netlify/functions/config.js` exposes only the Supabase URL and anon key, both of which are designed to be public client configuration. Never expose the Supabase service-role key.

## Data protection

All live tables use Supabase Row Level Security. Every row is scoped to `auth.uid()`. Demo Mode remains local to the browser via localStorage and does not sync to Supabase.
