<script lang="ts">
	import { MessageSquareText } from 'lucide-svelte';

	let {
		title,
		description
	}: {
		title: string;
		description: string;
	} = $props();
</script>

<div class="text-whatsapp-muted flex h-full flex-col items-center justify-center px-6 text-center">
	<div class="bg-whatsapp-bubble-customer mb-4 rounded-full p-4">
		<MessageSquareText class="text-whatsapp-teal h-8 w-8" />
	</div>
	<p class="text-whatsapp-ink text-base font-semibold">{title}</p>
	<p class="mt-1 max-w-sm text-sm">{description}</p>
</div>
