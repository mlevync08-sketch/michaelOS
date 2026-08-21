# MichaelOS — Sprint 1 Production Foundation

Release 0.2 converts the validated static prototype into a React + TypeScript application connected to the existing Supabase project and deployed by Netlify.

## What Sprint 1 includes

- React + TypeScript + Tailwind production frontend
- Supabase email/password authentication
- Live reads from `projects`, `actions`, `decisions`, `relationships`, and `waiting_on`
- Executive Today dashboard built from live portfolio data
- Live Projects workspace
- Netlify configuration endpoint for the public Supabase URL and publishable key
- Existing Supabase schema and seed SQL retained under `/supabase`
- SPA redirects and continuous deployment configuration

## Netlify environment variables

These should already exist in Netlify:

- `SUPABASE_URL` — e.g. `https://YOUR_PROJECT.supabase.co`
- `SUPABASE_ANON_KEY` — the `sb_publishable_...` key

Do not add a service-role or secret Supabase key to browser code.

## Deploy into the existing GitHub repository

1. In GitHub Desktop, choose **Repository → Show in Finder**.
2. Make a safety copy of the current repository folder if desired.
3. Copy the contents of this Sprint 1 folder into the repository root, replacing the old prototype files when prompted.
4. GitHub Desktop should show the React production files as additions/changes/deletions.
5. Commit with: `Release 0.2 - production foundation`
6. Push origin.
7. Netlify will run `npm run build` and publish `/dist` automatically.
8. Open the Netlify deploy log. Confirm the build is green.
9. Open the production URL and sign in using the user you created in Supabase Authentication.

## Local development

Because `/api/config` is a Netlify Function, the most accurate local runtime uses Netlify CLI. Plain `npm run dev` will render the frontend but the config endpoint will not be available unless proxied.

For this Sprint, production deployment through Netlify is the recommended test path.

## Acceptance test

After login:

1. Today should show 6 active projects from Supabase.
2. The Projects page should show GTM Command Center, SAVi, Velocity / VHL, Babson Diagnostics, PlasticBegone, and Bluedoor.
3. Refresh should reload live data without logging you out.
4. Sign out should return to the private login screen.
5. A user without a valid Supabase login should not be able to access the application data.

## Sprint 1 next increment

After this foundation is live, the next increment is full CRUD: create/edit projects, create/complete actions, resolve decisions, relationship updates, and persistent Health records.
