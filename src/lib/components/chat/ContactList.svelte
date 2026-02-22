<script lang="ts">
	import { MessageCircle } from 'lucide-svelte';
	import type { ContactItem } from '$lib/types/supabase';
	import { formatTime } from '$lib/utils/date';

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
	<header class="border-whatsapp-panel-border bg-whatsapp-teal border-b px-4 py-3 text-white">
		<p class="text-sm font-semibold tracking-wide">Customers</p>
		<p class="text-xs text-white/80">WhatsApp conversations</p>
	</header>

	<div class="flex-1 overflow-y-auto">
		{#if contacts.length === 0}
			<div
				class="text-whatsapp-muted flex h-full flex-col items-center justify-center px-6 text-center"
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
					class={`border-whatsapp-panel-border hover:bg-whatsapp-panel-hover flex w-full items-start gap-3 border-b px-4 py-3 text-left transition ${selectedWaNo === contact.waNo ? 'bg-whatsapp-panel-active' : ''}`}
				>
					<div
						class="bg-whatsapp-avatar text-whatsapp-teal-dark flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
					>
						{contact.waNo.slice(-2)}
					</div>
					<div class="min-w-0 flex-1">
						<div class="flex items-center justify-between gap-2">
							<p class="text-whatsapp-ink truncate text-sm font-semibold">{contact.waNo}</p>
							<span class="text-whatsapp-muted shrink-0 text-xs"
								>{formatTime(contact.lastMessageAt)}</span
							>
						</div>
						<p class="text-whatsapp-muted mt-1 truncate text-xs">{contact.lastMessage}</p>
					</div>
				</button>
			{/each}
		{/if}
	</div>
</aside>
