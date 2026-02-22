<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';
	import { onMount } from 'svelte';
	import type { ContactItem, Message } from '$lib/types/supabase';
	import { getSupabaseBrowserClient } from '$lib/supabase/client';
	import { sortMessagesAsc, upsertContact } from '$lib/utils/messages';
	import ContactList from '$lib/components/chat/ContactList.svelte';
	import ChatHeader from '$lib/components/chat/ChatHeader.svelte';
	import MessageBubble from '$lib/components/chat/MessageBubble.svelte';
	import ChatEmptyState from '$lib/components/chat/ChatEmptyState.svelte';
	import ChatLoadingState from '$lib/components/chat/ChatLoadingState.svelte';

	type DashboardData = {
		contacts: ContactItem[];
		conversation: Message[];
		selectedWaNo: string | null;
		schemaError: string | null;
		debug: {
			supabaseUrl: string;
			keyKind: string;
			userId: string;
			rowCount: number;
			contactCount: number;
			sampleWaNo: string[];
			queryError: string | null;
			rawSample: Array<Record<string, unknown>>;
		};
	};

	let { data }: { data: DashboardData } = $props();

	let contacts = $state<ContactItem[]>([]);
	let conversation = $state<Message[]>([]);
	let selectedWaNo = $state<string | null>(null);
	let showChatOnMobile = $state(false);

	$effect(() => {
		contacts = data.contacts;
		conversation = data.conversation;
		selectedWaNo = data.selectedWaNo;
		showChatOnMobile = Boolean(data.selectedWaNo);
	});

	async function selectContact(waNo: string) {
		showChatOnMobile = true;
		await goto(`/dashboard?wa=${encodeURIComponent(waNo)}`, {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});
	}

	function backToContacts() {
		showChatOnMobile = false;
	}

	onMount(() => {
		if (!browser) {
			return;
		}

		console.info('[dashboard] client debug', data.debug);

		if (data.schemaError) {
			return;
		}

		const supabase = getSupabaseBrowserClient();
		const channel = supabase
			.channel('messages-realtime')
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'messages' },
				(payload: { new: Message }) => {
					const incoming = payload.new;
					contacts = upsertContact(contacts, incoming);

					if (selectedWaNo === incoming.wa_no) {
						conversation = sortMessagesAsc([...conversation, incoming]);
					}
				}
			)
			.subscribe((status: string) => {
				console.info('[dashboard] realtime status', status);
			});

		return () => {
			supabase.removeChannel(channel);
		};
	});
</script>

<main class="h-dvh bg-whatsapp-shell p-0 md:p-4">
	<div
		class="mx-auto flex h-full w-full max-w-7xl overflow-hidden border border-whatsapp-panel-border bg-white shadow-whatsapp md:rounded-3xl"
	>
		<div
			class={`h-full w-full shrink-0 border-r border-whatsapp-panel-border md:block md:w-[360px] ${showChatOnMobile ? 'hidden' : 'block'}`}
		>
			<ContactList {contacts} {selectedWaNo} onSelect={selectContact} />
		</div>

		<section
			class={`flex h-full min-w-0 flex-1 flex-col bg-whatsapp-chat-bg ${showChatOnMobile ? 'flex' : 'hidden md:flex'}`}
		>
			{#if selectedWaNo}
				<ChatHeader
					waNo={selectedWaNo}
					onBack={backToContacts}
					showBack={!$navigating && showChatOnMobile}
				/>
			{/if}

			<div class="chat-pattern flex-1 overflow-y-auto p-4 md:p-6">
				{#if data.schemaError}
					<ChatEmptyState title="Missing table" description={data.schemaError} />
				{:else if $navigating}
					<ChatLoadingState />
				{:else if !selectedWaNo}
					<ChatEmptyState
						title="Choose a conversation"
						description="Select a WhatsApp number from the left to view complete message history."
					/>
				{:else if conversation.length === 0}
					<ChatEmptyState
						title="No messages yet"
						description="This contact has no messages in the database yet."
					/>
				{:else}
					<div class="space-y-3">
						{#each conversation as message, index (`${message.id}-${message.created_at}-${index}`)}
							<MessageBubble {message} />
						{/each}
					</div>
				{/if}
			</div>

			<details
				class="border-t border-whatsapp-panel-border bg-white/80 px-4 py-2 text-xs text-whatsapp-muted"
			>
				<summary class="cursor-pointer font-medium text-whatsapp-ink">Debug info</summary>
				<div class="mt-2 space-y-1">
					<p>
						<span class="font-semibold text-whatsapp-ink">Supabase URL:</span>
						{data.debug.supabaseUrl}
					</p>
					<p><span class="font-semibold text-whatsapp-ink">Key type:</span> {data.debug.keyKind}</p>
					<p><span class="font-semibold text-whatsapp-ink">User:</span> {data.debug.userId}</p>
					<p><span class="font-semibold text-whatsapp-ink">Rows:</span> {data.debug.rowCount}</p>
					<p>
						<span class="font-semibold text-whatsapp-ink">Contacts:</span>
						{data.debug.contactCount}
					</p>
					<p>
						<span class="font-semibold text-whatsapp-ink">Sample wa_no:</span>
						{data.debug.sampleWaNo.join(', ') || 'none'}
					</p>
					<p>
						<span class="font-semibold text-whatsapp-ink">Query error:</span>
						{data.debug.queryError || 'none'}
					</p>
					<p>
						<span class="font-semibold text-whatsapp-ink">Raw sample:</span>
						{JSON.stringify(data.debug.rawSample)}
					</p>
				</div>
			</details>
		</section>
	</div>
</main>
