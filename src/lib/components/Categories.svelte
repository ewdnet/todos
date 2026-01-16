<script lang="ts" module>
	const PAGE_SIZE = 5;
</script>

<script lang="ts">
	import type { CategoryItem } from '$lib/types';
	import { Accordion, Pagination } from '@skeletonlabs/skeleton-svelte';
	import Category from '$lib/components/Category.svelte';
	import CategoriesDeleting from '$lib/components/CategoriesDeleting.svelte';
	import { ArrowLeftIcon, ArrowRightIcon } from '@lucide/svelte';
	import { accordionReset, categoryStatus, paginatorReset, searchTerm } from '$lib/stores.svelte';
	import { fade } from 'svelte/transition';

	let { categories } = $props<{ categories: CategoryItem[] }>();

	// Pagination
	const page = $derived(paginatorReset.value ?? 1);
	const start = $derived((page - 1) * PAGE_SIZE);
	const end = $derived(start + PAGE_SIZE);
	const paginatedCategories = $derived(categories.slice(start, end));
</script>

{#if categories.length}
	<Accordion
		onValueChange={(event: { value: string[] }) => {
			accordionReset.value = event.value;
		}}
		value={accordionReset.value}
		collapsible
	>
		<ul class="space-y-2 pb-4">
			{#each paginatedCategories as category, index (category.id)}
				<Category {category} {index} />
			{/each}
		</ul>
	</Accordion>
	{#key paginatedCategories}
		<footer
			class="flex flex-wrap justify-between gap-8"
			in:fade={{ delay: 100 * paginatedCategories.length, duration: 100 }}
		>
			<div class="flex items-center gap-2">
				<small>
					{#if categoryStatus.value !== '' || searchTerm.value !== ''}
						Filtered Categories:
					{:else}
						Total Categories:
					{/if}
					{categories.length}
				</small>
				{#if categories.length > 1}
					<CategoriesDeleting {categories} />
				{/if}
			</div>
			{#if categories.length > PAGE_SIZE}
				<Pagination
					defaultPage={1}
					count={categories.length}
					pageSize={PAGE_SIZE}
					{page}
					onPageChange={(event: { page: number }) => {
						paginatorReset.value = event.page;
					}}
				>
					<Pagination.PrevTrigger>
						<ArrowLeftIcon class="size-4" />
					</Pagination.PrevTrigger>
					<Pagination.Context>
						{#snippet children(pagination)}
							{#each pagination().pages as page, index (page)}
								{#if page.type === 'page'}
									<Pagination.Item {...page}>
										{page.value}
									</Pagination.Item>
								{:else}
									<Pagination.Ellipsis {index}>&#8230;</Pagination.Ellipsis>
								{/if}
							{/each}
						{/snippet}
					</Pagination.Context>
					<Pagination.NextTrigger>
						<ArrowRightIcon class="size-4" />
					</Pagination.NextTrigger>
				</Pagination>
			{/if}
		</footer>
	{/key}
{:else}
	<p class="py-4 text-center">No Categories found.</p>
{/if}
