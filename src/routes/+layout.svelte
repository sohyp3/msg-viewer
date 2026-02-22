<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { browser } from '$app/environment';
	import type { AuthChangeEvent } from '@supabase/supabase-js';
	import { getSupabaseBrowserClient } from '$lib/supabase/client';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let {
		children,
		data: _data
	}: {
		children: import('svelte').Snippet;
		data: { user: unknown };
	} = $props();

	onMount(() => {
		if (!browser) {
			return;
		}

		const supabase = getSupabaseBrowserClient();
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((_event: AuthChangeEvent) => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
