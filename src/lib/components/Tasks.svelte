<script lang="ts" module>
	const PAGE_SIZE = 5;
</script>

<script lang="ts">
	import type { CategoryItem, TaskItem } from '$lib/types';
	import {
		accordionReset,
		categorySelected,
		activeTab,
		paginatorReset,
		searchTerm,
		taskStatus
	} from '$lib/stores.svelte';
	import TasksDeleting from '$lib/components/TasksDeleting.svelte';
	import Task from '$lib/components/Task.svelte';
	import { Accordion, Pagination } from '@skeletonlabs/skeleton-svelte';
	import { ArrowLeftIcon, ArrowRightIcon } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	const iconSize = 16;

	let { categories, tasks } = $props<{
		categories: CategoryItem[];
		tasks: TaskItem[];
	}>();

	// Pagination
	const page = $derived(paginatorReset.value ?? 1);
	const start = $derived((page - 1) * PAGE_SIZE);
	const end = $derived(start + PAGE_SIZE);
	const paginatedTasks = $derived(tasks.slice(start, end));
</script>

{#if tasks.length}
	<Accordion
		onValueChange={(event: { value: string[] }) => {
			accordionReset.value = event.value;
		}}
		value={accordionReset.value}
		collapsible
	>
		<ul class="space-y-2 pb-4">
			{#each paginatedTasks as task, index (task.id)}
				<Task {task} {categories} {index} />
			{/each}
		</ul>
	</Accordion>

	{#key paginatedTasks}
		<footer
			class="flex flex-wrap justify-between gap-8"
			in:fade={{ delay: 100 * paginatedTasks.length, duration: 100 }}
		>
			<div class="flex items-center gap-2">
				<small>
					{#if taskStatus.value !== '' || categorySelected.value !== '' || searchTerm.value !== ''}
						Filtered Tasks:
					{:else}
						Total Tasks:
					{/if}
					{tasks.length}
				</small>
				{#if tasks.length > 1}
					<TasksDeleting {tasks} />
				{/if}
			</div>
			{#if tasks.length > PAGE_SIZE}
				<Pagination
					defaultPage={1}
					count={tasks.length}
					pageSize={PAGE_SIZE}
					{page}
					onPageChange={(event: { page: number }) => {
						paginatorReset.value = event.page;
					}}
				>
					<Pagination.PrevTrigger>
						<ArrowLeftIcon size={iconSize} />
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
						<ArrowRightIcon size={iconSize} />
					</Pagination.NextTrigger>
				</Pagination>
			{/if}
		</footer>
	{/key}
{:else}
	<p class="text-center">No Tasks found.</p>
	{#if !categories.length}
		<p class="text-center">
			First please create a <button onclick={() => (activeTab.value = 'categories')} class="anchor"
				>category</button
			> to add tasks to.
		</p>
	{/if}
{/if}
