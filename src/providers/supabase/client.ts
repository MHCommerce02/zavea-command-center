import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../../types/database";

// The ONLY place in the app that constructs a Supabase client. Uses the
// public anon/publishable key exclusively — this is intentional and safe:
// the key is meaningless without a valid authenticated session, and every
// table is protected by the RLS policies from 010_rls_policies.sql. The
// SUPABASE_SERVICE_ROLE_KEY must never appear in this file or anywhere
// that ships to the browser.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.local.example to .env.local and fill in the real values."
  );
}

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(supabaseUrl!, supabaseAnonKey!);
  }
  return browserClient;
}
