import type { Handle } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

export const handle: Handle = async ({ event, resolve }) => {
	const supabaseKey = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.PUBLIC_SUPABASE_ANON_KEY;

	if (!env.PUBLIC_SUPABASE_URL || !supabaseKey) {
		throw new Error('Supabase env vars are missing');
	}

	event.locals.supabase = createServerClient(env.PUBLIC_SUPABASE_URL, supabaseKey, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (
				cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]
			) => {
				for (const { name, value, options } of cookiesToSet) {
					event.cookies.set(name, value, {
						...(options as any),
						path: '/'
					});
				}
			}
		}
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error) {
			return { user: null };
		}

		return { user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
