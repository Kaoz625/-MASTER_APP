# Replit Agent Task: -MASTER_APP
## Your Task
Build the universal app foundation — auth + payments + multi-platform scaffold.
Commit with 'replit: ' prefix. Push to main when done.

## Stack
- Framework: Next.js 15 + TypeScript
- Auth: NextAuth.js v5 (email + Google + GitHub providers)
- DB: Supabase self-hosted (schema migrations in /supabase/migrations/)
- Payments: CCBill webhook handler (for adult platforms) + Stripe (for non-adult)
- Style: Tailwind CSS + shadcn/ui
- Deploy: Cloudflare Pages

## Improvements
1. Audit current code — list what exists
2. Set up NextAuth.js v5 with email + Google providers
3. Add Supabase client with base schema: users, subscriptions, payments tables
4. Add CCBill webhook handler at /api/webhooks/ccbill
5. Add Stripe webhook handler at /api/webhooks/stripe
6. Build dashboard shell: sidebar nav, user profile, subscription status
7. Add middleware for auth protection on /dashboard routes
8. Add wrangler.toml for Cloudflare Pages deploy

## Done When
- [ ] Auth sign-in/sign-up working
- [ ] Supabase connected (requires env vars)
- [ ] Payment webhook handlers in place
- [ ] Dashboard shell renders
- [ ] No TypeScript errors
