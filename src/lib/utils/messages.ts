import type { ContactItem, Message } from '$lib/types/supabase';

export function isBotSender(sender: string): boolean {
	const normalized = sender.trim().toUpperCase();
	return normalized === 'AI_AGENT_99' || normalized === 'BOT';
}

export function sortMessagesAsc(messages: Message[]): Message[] {
	return [...messages].sort(
		(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
	);
}

export function buildContacts(messages: Message[]): ContactItem[] {
	const grouped = new Map<string, ContactItem>();

	for (const message of messages) {
		const current = grouped.get(message.wa_no);
		if (!current) {
			grouped.set(message.wa_no, {
				waNo: message.wa_no,
				lastMessage: message.content,
				lastMessageAt: message.created_at
			});
			continue;
		}

		if (new Date(message.created_at).getTime() > new Date(current.lastMessageAt).getTime()) {
			grouped.set(message.wa_no, {
				waNo: message.wa_no,
				lastMessage: message.content,
				lastMessageAt: message.created_at
			});
		}
	}

	return [...grouped.values()].sort(
		(a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
	);
}

export function upsertContact(contacts: ContactItem[], message: Message): ContactItem[] {
	const next = contacts.filter((contact) => contact.waNo !== message.wa_no);
	next.unshift({
		waNo: message.wa_no,
		lastMessage: message.content,
		lastMessageAt: message.created_at
	});
	return next;
}
