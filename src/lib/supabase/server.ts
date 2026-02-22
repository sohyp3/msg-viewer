import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';
import type { Cookies } from '@sveltejs/kit';
import type { Database } from '$lib/types/supabase';

export function createSupabaseServerClient(cookies: Cookies) {
	const supabaseKey = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.PUBLIC_SUPABASE_ANON_KEY;

	if (!env.PUBLIC_SUPABASE_URL || !supabaseKey) {
		throw new Error('Supabase env vars are missing');
	}

	return createServerClient<Database>(env.PUBLIC_SUPABASE_URL, supabaseKey, {
		cookies: {
			getAll: () => cookies.getAll(),
			setAll: (
				cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]
			) => {
				for (const { name, value, options } of cookiesToSet) {
					cookies.set(name, value, { ...(options as any), path: '/' });
				}
			}
		}
	});
}
