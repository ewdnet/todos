<script lang="ts">
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import {
		accordionReset,
		activeTab,
		categorySelected,
		categoryStatus,
		paginatorReset,
		searchTerm,
		taskStatus
	} from '$lib/stores.svelte';
	import type { TabValue } from '$lib/types';
	import ProgressOverall from '$lib/components/ProgressOverall.svelte';
	import { ListChecksIcon, SearchIcon, TagsIcon, XIcon } from '@lucide/svelte';
	const iconSize = 16;

	let searchHadContent = false;
	$effect(() => {
		const hasContent = searchTerm.value.length > 0;
		if (hasContent && !searchHadContent) {
			accordionReset.value = [];
		}
		searchHadContent = hasContent;
	});
</script>

<ProgressOverall />
<div class="flex-auto">
	<div class="flex justify-end pb-4">
		<div class="input-group w-fit grid-cols-[1fr_auto]">
			<input
				value={searchTerm.value}
				class="ig-input max-w-xs text-xs"
				name="q"
				type="search"
				placeholder="Search ..."
				oninput={(event) =>
					(searchTerm.value = (event.currentTarget as HTMLInputElement).value.toLowerCase())}
			/>
			<div class="ig-btn preset-tonal">
				{#if !searchTerm.value.length}
					<SearchIcon size={iconSize} />
				{:else}
					<XIcon
						size={iconSize}
						onclick={() => {
							searchTerm.value = '';
							accordionReset.value = [];
						}}
					/>
				{/if}
			</div>
		</div>
	</div>
	<nav class="flex flex-row-reverse gap-2 border-t border-t-primary-200-800 pt-4">
		<Tabs
			defaultValue="tasks"
			onValueChange={(event) => {
				activeTab.value = event.value as TabValue;
			}}
			value={activeTab.value}
			class="flex flex-row-reverse"
		>
			<Tabs.List>
				<Tabs.Trigger
					onclick={() => {
						searchTerm.value = '';
						taskStatus.value = '';
						categoryStatus.value = '';
						categorySelected.value = '';
						accordionReset.value = [];
						paginatorReset.value = 1;
						activeTab.value = 'tasks';
					}}
					value="tasks"
					class="preset-tonal text-xs sm:text-sm"
				>
					<ListChecksIcon size={iconSize} />
					Tasks
				</Tabs.Trigger>
				<Tabs.Trigger
					onclick={() => {
						searchTerm.value = '';
						taskStatus.value = '';
						categoryStatus.value = '';
						categorySelected.value = '';
						accordionReset.value = [];
						paginatorReset.value = 1;
						activeTab.value = 'categories';
					}}
					value="categories"
					class="preset-tonal text-xs sm:text-sm"
				>
					<TagsIcon size={iconSize} />
					Categories
				</Tabs.Trigger>
				<Tabs.Indicator />
			</Tabs.List>
		</Tabs>
	</nav>
</div>
