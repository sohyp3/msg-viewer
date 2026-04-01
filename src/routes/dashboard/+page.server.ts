import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Message } from '$lib/types/supabase';
import { buildContacts, sortMessagesAsc } from '$lib/utils/messages';
import { env } from '$env/dynamic/public';

const MESSAGES_PAGE_SIZE = 1000;

async function fetchAllMessages(
	supabase: App.Locals['supabase']
): Promise<{ data: Record<string, unknown>[]; error: string | null; pagesFetched: number }> {
	const allRows: Record<string, unknown>[] = [];
	let from = 0;
	let pagesFetched = 0;

	while (true) {
		const to = from + MESSAGES_PAGE_SIZE - 1;
		const { data, error } = await supabase
			.from('messages')
			.select('*')
			.order('created_at', { ascending: false })
			.range(from, to);

		if (error) {
			const details = [error.message, error.details, error.hint]
				.filter((item): item is string => Boolean(item))
				.join(' | ');

			return {
				data: allRows,
				error: details || error.message,
				pagesFetched
			};
		}

		const pageRows = (data ?? []) as Record<string, unknown>[];
		allRows.push(...pageRows);
		pagesFetched += 1;

		if (pageRows.length < MESSAGES_PAGE_SIZE) {
			break;
		}

		from += MESSAGES_PAGE_SIZE;
	}

	return {
		data: allRows,
		error: null,
		pagesFetched
	};
}

function normalizeMessageRow(row: Record<string, unknown>, index: number): Message {
	const id = String(row.id ?? `row-${index}`);
	const createdAtRaw = row.created_at ?? row.createdAt;
	const created_at = createdAtRaw ? String(createdAtRaw) : new Date().toISOString();
	const waRaw = row.wa_no ?? row.waNo ?? row.wa_number ?? row.waNumber ?? row.phone ?? row.msisdn;
	const wa_no = waRaw ? String(waRaw).trim() : `(unknown-${index + 1})`;
	const contentRaw = row.content ?? row.message ?? row.body ?? '';
	const content = String(contentRaw);
	const senderRaw = row.sender ?? row.sender_name ?? row.author ?? 'unknown';
	const sender = String(senderRaw);

	return { id, created_at, wa_no, content, sender };
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(302, '/login');
	}

	const debugBase = {
		supabaseUrl: env.PUBLIC_SUPABASE_URL ?? '(missing)',
		keyKind: (env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.PUBLIC_SUPABASE_ANON_KEY ?? '').startsWith(
			'sb_publishable_'
		)
			? 'publishable'
			: 'anon_or_unknown',
		userId: user.id
	};

	console.info('[dashboard] querying messages', debugBase);

	const { data, error: fetchError, pagesFetched } = await fetchAllMessages(locals.supabase);

	if (fetchError) {
		console.error('[dashboard] messages query failed', {
			...debugBase,
			error: fetchError,
			pagesFetched
		});

		return {
			user,
			contacts: [],
			conversation: [],
			selectedWaNo: null,
			schemaError:
				fetchError || 'Could not load messages. Check table name, columns, and RLS policies.',
			debug: {
				...debugBase,
				rowCount: 0,
				contactCount: 0,
				pagesFetched,
				pageSize: MESSAGES_PAGE_SIZE,
				sampleWaNo: [],
				queryError: fetchError,
				rawSample: []
			}
		};
	}

	const rawRows = (data ?? []) as Record<string, unknown>[];
	const messages = rawRows.map((row, index) => normalizeMessageRow(row, index));
	const contacts = buildContacts(messages);
	const firstContact =
		contacts.find((contact) => contact.waNo.trim().length > 0) ?? contacts[0] ?? null;
	const selectedWaNo = url.searchParams.get('wa') ?? firstContact?.waNo ?? null;

	const conversation = selectedWaNo
		? sortMessagesAsc(messages.filter((message) => message.wa_no === selectedWaNo))
		: [];

	console.info('[dashboard] messages loaded', {
		...debugBase,
		rowCount: messages.length,
		contactCount: contacts.length,
		pagesFetched
	});

	return {
		user,
		contacts,
		conversation,
		selectedWaNo,
		schemaError: null,
		debug: {
			...debugBase,
			rowCount: messages.length,
			contactCount: contacts.length,
			pagesFetched,
			pageSize: MESSAGES_PAGE_SIZE,
			sampleWaNo: contacts.slice(0, 5).map((contact) => contact.waNo),
			queryError: null,
			rawSample: rawRows.slice(0, 3)
		}
	};
};

export const actions: Actions = {
	signOut: async ({ locals }) => {
		await locals.supabase.auth.signOut();
		throw redirect(302, '/login');
	}
};
