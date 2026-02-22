<script lang="ts">
	import type { Message } from '$lib/types/supabase';
	import { formatTime } from '$lib/utils/date';
	import { isBotSender } from '$lib/utils/messages';

	let { message }: { message: Message } = $props();
	let isBot = $derived(isBotSender(message.sender));
	let senderLabel = $derived(isBot ? 'BOT' : message.sender);
</script>

<div class={`flex ${isBot ? 'justify-end' : 'justify-start'}`}>
	<div
		class={`max-w-[85%] rounded-2xl px-3.5 py-2 shadow-sm md:max-w-[70%] ${isBot ? 'rounded-br-md bg-whatsapp-bubble-bot text-whatsapp-ink' : 'rounded-bl-md bg-whatsapp-bubble-customer text-whatsapp-ink'}`}
	>
		<p
			class={`mb-1 text-[11px] font-semibold ${isBot ? 'text-whatsapp-secondary-dark' : 'text-whatsapp-primary-dark'}`}
		>
			{senderLabel}
		</p>
		<p class="text-sm leading-5 break-words whitespace-pre-wrap">{message.content}</p>
		<p class="mt-1 text-right text-[11px] text-whatsapp-muted">{formatTime(message.created_at)}</p>
	</div>
</div>
