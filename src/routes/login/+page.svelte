<script lang="ts">
	import { enhance } from '$app/forms';
	import { MessageSquare } from 'lucide-svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<main class="bg-whatsapp-shell min-h-dvh px-4 py-8">
	<div
		class="border-whatsapp-panel-border shadow-whatsapp mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-5xl items-center justify-center rounded-3xl border bg-white p-6 md:p-10"
	>
		<div class="grid w-full gap-8 md:grid-cols-2 md:items-center">
			<section class="bg-whatsapp-teal rounded-2xl px-6 py-8 text-white">
				<div class="mb-4 inline-flex rounded-xl bg-white/15 p-3">
					<MessageSquare class="h-8 w-8" />
				</div>
				<h1 class="text-2xl font-bold">Message Viewer</h1>
				<p class="mt-3 text-sm text-white/85">
					Securely view and monitor customer WhatsApp conversations in one place.
				</p>
			</section>

			<section>
				<h2 class="text-whatsapp-ink text-xl font-semibold">Sign in</h2>
				<p class="text-whatsapp-muted mt-1 text-sm">Use your Supabase Auth credentials</p>

				<form method="post" action="?/signIn" use:enhance class="mt-6 space-y-4">
					<label class="block text-sm">
						<span class="text-whatsapp-ink mb-1.5 block font-medium">Email</span>
						<input
							type="email"
							name="email"
							required
							value={form?.email ?? ''}
							class="border-whatsapp-panel-border text-whatsapp-ink placeholder:text-whatsapp-muted focus:border-whatsapp-teal focus:ring-whatsapp-teal/20 w-full rounded-xl border bg-white px-3 py-2.5 text-sm shadow-sm transition outline-none focus:ring-2"
							placeholder="you@company.com"
						/>
					</label>

					<label class="block text-sm">
						<span class="text-whatsapp-ink mb-1.5 block font-medium">Password</span>
						<input
							type="password"
							name="password"
							required
							class="border-whatsapp-panel-border text-whatsapp-ink placeholder:text-whatsapp-muted focus:border-whatsapp-teal focus:ring-whatsapp-teal/20 w-full rounded-xl border bg-white px-3 py-2.5 text-sm shadow-sm transition outline-none focus:ring-2"
							placeholder="••••••••"
						/>
					</label>

					<button
						type="submit"
						class="bg-whatsapp-teal hover:bg-whatsapp-teal-dark w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
					>
						Sign in
					</button>

					{#if form?.message}
						<p class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{form.message}</p>
					{/if}
				</form>
			</section>
		</div>
	</div>
</main>
