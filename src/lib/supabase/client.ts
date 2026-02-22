import { createBrowserClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/supabase';

let browserClient: SupabaseClient<Database> | null = null;

export function getSupabaseBrowserClient(): SupabaseClient<Database> {
	const supabaseKey = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.PUBLIC_SUPABASE_ANON_KEY;

	if (!env.PUBLIC_SUPABASE_URL || !supabaseKey) {
		throw new Error('Supabase env vars are missing');
	}

	if (!browserClient) {
		browserClient = createBrowserClient<Database>(env.PUBLIC_SUPABASE_URL, supabaseKey);
	}

	return browserClient;
}
