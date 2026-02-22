<script lang="ts">
	import { ArrowLeft, LogOut } from 'lucide-svelte';

	let {
		waNo,
		onBack,
		showBack
	}: {
		waNo: string;
		onBack: () => void;
		showBack: boolean;
	} = $props();
</script>

<header
	class="border-whatsapp-panel-border bg-whatsapp-teal flex items-center justify-between border-b px-4 py-3 text-white"
>
	<div class="flex min-w-0 items-center gap-3">
		{#if showBack}
			<button
				type="button"
				onclick={onBack}
				class="rounded-full p-1.5 transition hover:bg-white/15"
				aria-label="Back to contact list"
			>
				<ArrowLeft class="h-5 w-5" />
			</button>
		{/if}
		<div
			class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/25 text-sm font-semibold"
		>
			{waNo.slice(-2)}
		</div>
		<div class="min-w-0">
			<p class="truncate text-sm font-semibold">{waNo}</p>
			<p class="text-xs text-white/80">Online updates enabled</p>
		</div>
	</div>

	<form method="post" action="?/signOut">
		<button
			type="submit"
			class="rounded-full p-2 transition hover:bg-white/15"
			aria-label="Sign out"
			title="Sign out"
		>
			<LogOut class="h-5 w-5" />
		</button>
	</form>
</header>
