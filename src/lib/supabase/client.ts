import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Get the Supabase browser client.
 * Returns a mock client if env vars are missing (demo mode).
 */
export function getSupabaseClient(): ReturnType<typeof createBrowserClient> {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes('your-') || key.includes('your-')) {
    // Return a mock client that always returns empty data
    // This triggers the demo data fallback in every page
    console.warn('[Supabase] No credentials found — using demo mode');
    client = createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    );
    return client;
  }

  client = createBrowserClient(url, key);
  return client;
}
