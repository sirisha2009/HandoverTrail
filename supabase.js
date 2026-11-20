import { createClient } from "@supabase/supabase-js";
let client = null;
// Returns null when the Supabase environment variables are not set, so the guest demo still works.
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key);
  return client;
}
