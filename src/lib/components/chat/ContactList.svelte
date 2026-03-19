<script lang="ts">
	import { MessageCircle } from 'lucide-svelte';
	import type { ContactItem } from '$lib/types/supabase';
	import { formatDayTime } from '$lib/utils/date';

	let {
		contacts,
		selectedWaNo,
		onSelect
	}: {
		contacts: ContactItem[];
		selectedWaNo: string | null;
		onSelect: (waNo: string) => void;
	} = $props();
</script>

<aside class="flex h-full flex-col bg-white">
	<header class="border-b border-whatsapp-panel-border bg-whatsapp-teal px-4 py-3 text-white">
		<p class="text-sm font-semibold tracking-wide">Customers</p>
		<p class="text-xs text-white/80">WhatsApp conversations</p>
	</header>

	<div class="flex-1 overflow-y-auto">
		{#if contacts.length === 0}
			<div
				class="flex h-full flex-col items-center justify-center px-6 text-center text-whatsapp-muted"
			>
				<MessageCircle class="mb-3 h-10 w-10" />
				<p class="text-sm font-medium">No conversations yet</p>
				<p class="mt-1 text-xs">New messages will appear automatically</p>
			</div>
		{:else}
			{#each contacts as contact (contact.waNo)}
				<button
					type="button"
					onclick={() => onSelect(contact.waNo)}
					class={`flex w-full items-start gap-3 border-b border-whatsapp-panel-border px-4 py-3 text-left transition hover:bg-whatsapp-panel-hover ${selectedWaNo === contact.waNo ? 'bg-whatsapp-panel-active' : ''}`}
				>
					<div
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-whatsapp-avatar text-sm font-semibold text-whatsapp-teal-dark"
					>
						{contact.waNo.slice(-2)}
					</div>
					<div class="min-w-0 flex-1">
						<div class="flex items-center justify-between gap-2">
							<p class="truncate text-sm font-semibold text-whatsapp-ink">{contact.waNo}</p>
							<span class="shrink-0 text-xs text-whatsapp-muted"
								>{formatDayTime(contact.lastMessageAt)}</span
							>
						</div>
						<p class="mt-1 truncate text-xs text-whatsapp-muted">{contact.lastMessage}</p>
					</div>
				</button>
			{/each}
		{/if}
	</div>
</aside>
