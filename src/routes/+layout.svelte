<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import Footer from '$lib/site/Footer.svelte';
	import Header from '$lib/site/Header.svelte';
	import { activeTab } from '$lib/stores.svelte';
	import { Toast } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/toaster';
	import { getFlash } from 'sveltekit-flash-message';
	import { fade } from 'svelte/transition';

	let { children } = $props();

	const pageTitle = $derived(activeTab.value.charAt(0).toUpperCase() + activeTab.value.slice(1));

	const outer = 'px-2';
	const inner = 'w-full max-w-xl mx-auto  py-4 space-y-4';
	const border_t = 'border-t border-t-primary-200-800';

	const flash = getFlash(page);

	const ms: number = 3000;

	$effect(() => {
		if (!$flash) return;

		const t = String($flash.type);
		if (t === 'error') toaster.error({ description: $flash.message, duration: ms });
		if (t === 'warning') toaster.warning({ description: $flash.message, duration: ms });
		if (t === 'success') toaster.success({ description: $flash.message, duration: ms });
		if (t === 'info') toaster.info({ description: $flash.message, duration: ms });

		$flash = undefined;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{pageTitle}</title>
	<meta
		name="description"
		content="A simple task management application built with SvelteKit and Skeleton UI."
	/>
</svelte:head>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast} class="w-sm">
			<Toast.Message>
				<Toast.Title>{toast.title}</Toast.Title>
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>

<header class={outer}>
	<div class="{inner} flex items-center justify-between gap-4">
		<Header />
	</div>
</header>
<main class="flex-auto {outer}">
	{#key activeTab.value}
		<article class={inner} in:fade={{ delay: 200, duration: 200 }} out:fade={{ duration: 200 }}>
			{@render children()}
		</article>
	{/key}
</main>
<footer class={outer}>
	<div class="{inner} {border_t}">
		<Footer />
	</div>
</footer>
