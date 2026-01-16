<script lang="ts">
	import type { CategoryItem } from '$lib/types';
	import { categorySelected, searchTerm, taskStatus } from '$lib/stores.svelte';
	import { Portal, Tooltip } from '@skeletonlabs/skeleton-svelte';
	import { ListChecksIcon, RefreshCcwIcon } from '@lucide/svelte';
	const iconSize = 16;

	let { categories } = $props<{ categories: CategoryItem[] }>();

	let categoryName: string = $state('');
	$effect(() => {
		if (categorySelected.value === '') return;
		categoryName = categories.find(
			(category: CategoryItem) => category.id === categorySelected.value
		)?.name as string;
	});
</script>

<ListChecksIcon />
<span>
	{#if searchTerm.value !== ''}
		Search "{searchTerm.value}" in
	{/if}
</span>
<span>
	{#if taskStatus.value === 'new'}
		New Tasks
	{:else if taskStatus.value === 'current'}
		Tasks in Progress
	{:else if taskStatus.value === 'completed'}
		Completed Tasks
	{:else}
		Tasks
	{/if}
</span>
{#if categorySelected.value !== ''}
	<span>in the Category "{categoryName}"</span>
	<Tooltip positioning={{ placement: 'top' }}>
		<Tooltip.Trigger
			type="button"
			onclick={() => (categorySelected.value = '')}
			class="btn-icon btn btn-icon-sm rounded-full preset-outlined-primary-500 bg-primary-500/15"
		>
			<RefreshCcwIcon size={iconSize} />
		</Tooltip.Trigger>
		<Portal>
			<Tooltip.Positioner>
				<Tooltip.Content class="card preset-filled-primary-800-200 p-2">
					<span>Reset category filter</span>
					<Tooltip.Arrow
						class="[--arrow-background:var(--color-primary-800-200)] [--arrow-size:--spacing(2)]"
					>
						<Tooltip.ArrowTip />
					</Tooltip.Arrow>
				</Tooltip.Content>
			</Tooltip.Positioner>
		</Portal>
	</Tooltip>
{/if}
