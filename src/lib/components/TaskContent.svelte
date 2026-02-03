<script lang="ts">
	import type { CategoryItem, TaskItem } from '$lib/types';
	import { accordionReset, categorySelected } from '$lib/stores.svelte';
	import TaskDelete from '$lib/components/TaskDelete.svelte';
	import TaskUpdate from '$lib/components/TaskUpdate.svelte';

	let { categories, task } = $props<{ categories: CategoryItem[]; task: TaskItem }>();
</script>

<p class="text-right">
	<small>Category:</small>
	{#if task.categoryId === categorySelected.value}
		<small>{categories.find((c: CategoryItem) => c.id === task.categoryId)?.name}</small>
	{:else}
		<button
			onclick={() => ((categorySelected.value = task.categoryId), (accordionReset.value = []))}
			class="anchor text-xs"
			>{categories.find((c: CategoryItem) => c.id === task.categoryId)?.name}</button
		>
	{/if}
</p>
<div class="py-4 text-sm">
	{#if task.content !== ''}
		<p>{@html task.content.replace(/(?:\r\n|\r|\n)/g, '</p><p>')}</p>
	{/if}
</div>
<footer>
	<p class="flex flex-row-reverse items-center justify-between gap-4">
		<small>Created at {task.createdAt.toLocaleDateString('en-en')}</small>
		{#if Number(task.updatedAt) > Number(task.createdAt) + 1000 * 60 * 60}
			<small>Updated at {task.updatedAt.toLocaleDateString('en-en')}</small>
		{/if}
	</p>
	<div class="mt-2 flex items-center justify-between gap-4 border-t border-t-primary-200-800 pt-4">
		<TaskDelete {task} />
		<TaskUpdate {task} {categories} />
	</div>
</footer>
