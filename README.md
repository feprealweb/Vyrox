# VYROX — Starter Project

This is the first foundation for the VYROX Android messaging app. It is a starting codebase, not a finished production app.

## Stack
- React Native + Expo + TypeScript
- Supabase Auth, Postgres, Realtime and Storage (configured later)
- Dark premium UI starter

## What is included
- Expo app skeleton
- Initial navigation-like tab layout
- Supabase client setup using public environment variables
- SQL starter schema and row-level security policies for profiles, conversations, members and messages
- Setup instructions

## Requirements
Install Node.js LTS on a computer, then install Expo Go on your Android phone. Building a full Android APK is easiest with a computer. If you only have a phone, tell ChatGPT and we can choose a phone-friendly cloud coding workflow.

## Run it
1. Install Node.js LTS.
2. Extract this folder.
3. Open a terminal in this folder and run:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env` and add your Supabase project URL and **publishable/anon key only**.
5. Start Expo:
   ```bash
   npx expo start
   ```
6. Scan the QR code with Expo Go.

## Supabase setup
1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Add your project URL and publishable/anon key to `.env`.

## Security notes
- Never put a Supabase `service_role` key, payout secret, or ad-provider secret in the app.
- The schema is a starter and must be reviewed/tested before production.
- Do not launch cash rewards until server-side verification, funded budgets, fraud controls and payout-provider integration are implemented.
- Do not claim end-to-end encryption until it is implemented with a reviewed protocol and tested key management.
