<script lang="ts">
	import type { CategoryItem, TaskItem, TooltipTriggerAttrs } from '$lib/types';
	import { Accordion, Portal, Progress, Tooltip } from '@skeletonlabs/skeleton-svelte';
	import { categorySelected, activeTab, accordionReset } from '$lib/stores.svelte';
	import CategoryDelete from '$lib/components/CategoryDelete.svelte';

	import { slide } from 'svelte/transition';
	import {
		ChevronDownIcon,
		CircleCheckBigIcon,
		CircleDashedIcon,
		CircleOffIcon
	} from '@lucide/svelte';
	const iconSize = 16;

	let { category, index } = $props<{ category: CategoryItem; index: number }>();

	const categoryProgress = () => {
		const total = category.tasks?.length ?? 0;
		if (total === 0) return 0;
		const sum = category.tasks?.reduce((acc: number, e: TaskItem) => acc + e.progress, 0) ?? 0;
		return Math.round(sum / total);
	};
</script>

{#snippet countTrigger(className: string)}
	{#snippet trigger(attrs: TooltipTriggerAttrs)}
		<span class={className} {...attrs as Record<string, unknown>} role="presentation">
			{category.tasks.length}
		</span>
	{/snippet}
	<Tooltip positioning={{ placement: 'top' }}>
		<Tooltip.Trigger element={trigger} />
		<Portal>
			<Tooltip.Positioner>
				<Tooltip.Content class="card preset-filled-surface-950-50 p-2">
					<span>Tasks in the Category</span>
					<Tooltip.Arrow
						class="[--arrow-background:var(--color-surface-950-50)] [--arrow-size:--spacing(2)]"
					>
						<Tooltip.ArrowTip />
					</Tooltip.Arrow>
				</Tooltip.Content>
			</Tooltip.Positioner>
		</Portal>
	</Tooltip>
{/snippet}

{#snippet complCat()}
	<span class="flex items-center gap-2 text-xs text-success-500/50">
		<CircleCheckBigIcon size={iconSize} class="text-success-500/50" />
		{@render countTrigger(
			'btn-icon btn btn-icon-sm rounded-full border border-success-500 bg-success-500/15'
		)}
	</span>
{/snippet}

{#snippet progrCat()}
	<span class="flex items-center gap-2 text-xs text-warning-500/50">
		<CircleDashedIcon size={iconSize} class="text-warning-500/50" />
		{@render countTrigger(
			'btn-icon btn btn-icon-sm rounded-full border border-warning-500 bg-warning-500/15'
		)}
	</span>
{/snippet}

{#snippet newCat()}
	<span class="flex items-center gap-2 text-xs text-error-500/50">
		<CircleOffIcon size={iconSize} class="text-error-500/50" />
		{@render countTrigger(
			'btn-icon btn btn-icon-sm rounded-full border border-error-500 bg-error-500/15'
		)}
	</span>
{/snippet}

{#snippet emptyCat()}
	<span class="flex items-center gap-2 text-xs text-primary-500/50">
		<CircleOffIcon size={iconSize} class="text-primary-500/50" />
		{@render countTrigger(
			'btn-icon btn btn-icon-sm rounded-full border border-primary-500 bg-primary-500/15'
		)}
	</span>
{/snippet}

<li
	class="overflow-hidden card bg-surface-50-950/70"
	in:slide={{ delay: 100 * index, duration: 100 }}
	out:slide={{ duration: 100 }}
>
	<Accordion.Item value={category.id}>
		<h2 class="h4">
			<Accordion.ItemTrigger class="flex items-center justify-between gap-2 font-bold">
				<div class="flex items-center gap-2">
					<span>
						{#if categoryProgress() === 100}
							{@render complCat()}
						{:else if categoryProgress() < 100 && categoryProgress() > 0}
							{@render progrCat()}
						{:else if category.tasks.length > 0 && categoryProgress() === 0}
							{@render newCat()}
						{:else if category.tasks.length === 0}
							{@render emptyCat()}
						{/if}
					</span>
					<span>{category.name}</span>
				</div>
				<Accordion.ItemIndicator class="group">
					<ChevronDownIcon class="h-5 w-5 transition group-data-[state=open]:rotate-180" />
				</Accordion.ItemIndicator>
			</Accordion.ItemTrigger>
			<div class="-mt-0.5 px-4">
				<Progress value={categoryProgress()}>
					<Progress.Track class="h-0.5 bg-error-500/20">
						<Progress.Range
							class={categoryProgress() === 100 ? 'bg-success-500/40' : 'bg-warning-500/50'}
						/>
					</Progress.Track>
				</Progress>
			</div>
		</h2>
		<Accordion.ItemContent>
			{#snippet element(attributes)}
				{#if !attributes.hidden}
					<div class="pb-4" {...attributes} transition:slide={{ duration: 200 }}>
						<p class="pb-8 text-center">
							{#if category.tasks?.length}
								<button
									onclick={() => (
										(categorySelected.value = category.id),
										(activeTab.value = 'tasks'),
										(accordionReset.value = [])
									)}
									class="anchor text-xs">Show all Tasks in the Category {category.name}</button
								>
							{:else}
								<small>No Tasks in this Category.</small>
							{/if}
						</p>
						<div class="flex justify-center">
							<CategoryDelete {category} />
						</div>
					</div>
				{/if}
			{/snippet}
		</Accordion.ItemContent>
	</Accordion.Item>
</li>
