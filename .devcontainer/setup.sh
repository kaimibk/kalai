#!/bin/bash
npx supabase telemetry disable 
npx supabase start --ignore-health-check
docker network connect supabase_network_kalai $(hostname) 2>/dev/null || true
npm run db:env 2>/dev/null || node scripts/sync-env.js
echo "Supabase ready!"
