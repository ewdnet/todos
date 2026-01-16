<script lang="ts">
	import type { CategoryItem } from '$lib/types';
	import { accordionReset, categoryStatus } from '$lib/stores.svelte';
	import { activeTab, searchTerm } from '$lib/stores.svelte';
	import { Portal, Tooltip } from '@skeletonlabs/skeleton-svelte';

	let { categories } = $props<{ categories: CategoryItem[] }>();

	const baseCategoriesForCounts = () => {
		let result = categories;
		if (activeTab.value === 'categories' && searchTerm.value.length > 0) {
			const q = searchTerm.value.toLowerCase();
			result = result.filter((category: CategoryItem) => category.name.toLowerCase().includes(q));
		}
		return result;
	};

	// Empty Categories
	const emptyCategories = () => {
		return baseCategoriesForCounts().filter((category: CategoryItem) => category.tasks.length === 0)
			.length;
	};
	// New Categories
	const newCategories = () => {
		return baseCategoriesForCounts().filter((category: CategoryItem) => {
			return category.tasks.length > 0 && category.tasks.every((task) => task.progress === 0);
		}).length;
	};
	// Categories in Progress
	const inprogressCategories = () => {
		return baseCategoriesForCounts().filter((category: CategoryItem) => {
			return (
				category.tasks.length > 0 &&
				category.tasks.some((task) => task.progress > 0 && task.progress < 100)
			);
		}).length;
	};
	// Completed Categories
	const completedCategories = () => {
		return baseCategoriesForCounts().filter((category: CategoryItem) => {
			return category.tasks.length > 0 && category.tasks.every((task) => task.progress === 100);
		}).length;
	};
</script>

{#if categories.length}
	<ul class="flex items-center gap-2">
		<li>
			<Tooltip positioning={{ placement: 'top' }}>
				<Tooltip.Trigger
					type="button"
					onclick={() => {
						categoryStatus.value =
							categoryStatus.value === 'emptycategories' ? '' : 'emptycategories';
						accordionReset.value = [];
					}}
					disabled={emptyCategories() === 0}
					class="btn-icon btn btn-icon-sm rounded-full border border-primary-500 bg-primary-500/15"
				>
					{emptyCategories()}
				</Tooltip.Trigger>
				<Portal>
					<Tooltip.Positioner>
						<Tooltip.Content class="card preset-filled-primary-800-200 p-2">
							<span
								>{categoryStatus.value === 'emptycategories'
									? 'Reset the Filter'
									: 'Show the empty Categories'}</span
							>
							<Tooltip.Arrow
								class="[--arrow-background:var(--color-primary-800-200)] [--arrow-size:--spacing(2)]"
							>
								<Tooltip.ArrowTip />
							</Tooltip.Arrow>
						</Tooltip.Content>
					</Tooltip.Positioner>
				</Portal>
			</Tooltip>
		</li>
		<li>
			<Tooltip positioning={{ placement: 'top' }}>
				<Tooltip.Trigger
					type="button"
					onclick={() => {
						categoryStatus.value = categoryStatus.value === 'newcategories' ? '' : 'newcategories';
						accordionReset.value = [];
					}}
					disabled={newCategories() === 0}
					class="btn-icon btn btn-icon-sm rounded-full border border-error-500 bg-error-500/15"
				>
					{newCategories()}
				</Tooltip.Trigger>
				<Portal>
					<Tooltip.Positioner>
						<Tooltip.Content class="card preset-filled-error-800-200 p-2">
							<span
								>{categoryStatus.value === 'newcategories'
									? 'Reset the Filter'
									: 'Show the New Categories'}</span
							>
							<Tooltip.Arrow
								class="[--arrow-background:var(--color-error-800-200)] [--arrow-size:--spacing(2)]"
							>
								<Tooltip.ArrowTip />
							</Tooltip.Arrow>
						</Tooltip.Content>
					</Tooltip.Positioner>
				</Portal>
			</Tooltip>
		</li>
		<li>
			<Tooltip positioning={{ placement: 'top' }}>
				<Tooltip.Trigger
					type="button"
					onclick={() => {
						categoryStatus.value =
							categoryStatus.value === 'inprogresscategories' ? '' : 'inprogresscategories';
						accordionReset.value = [];
					}}
					disabled={inprogressCategories() === 0}
					class="btn-icon btn btn-icon-sm rounded-full border border-warning-500 bg-warning-500/15"
				>
					{inprogressCategories()}
				</Tooltip.Trigger>
				<Portal>
					<Tooltip.Positioner>
						<Tooltip.Content class="card preset-filled-warning-800-200 p-2">
							<span
								>{categoryStatus.value === 'inprogresscategories'
									? 'Reset the Filter'
									: 'Show the Categories in Progress'}</span
							>
							<Tooltip.Arrow
								class="[--arrow-background:var(--color-warning-800-200)] [--arrow-size:--spacing(2)]"
							>
								<Tooltip.ArrowTip />
							</Tooltip.Arrow>
						</Tooltip.Content>
					</Tooltip.Positioner>
				</Portal>
			</Tooltip>
		</li>
		<li>
			<Tooltip positioning={{ placement: 'top' }}>
				<Tooltip.Trigger
					type="button"
					onclick={() => {
						categoryStatus.value =
							categoryStatus.value === 'completedcategories' ? '' : 'completedcategories';
						accordionReset.value = [];
					}}
					disabled={completedCategories() === 0}
					class="btn-icon btn btn-icon-sm rounded-full border border-success-500 bg-success-500/15"
				>
					{completedCategories()}
				</Tooltip.Trigger>
				<Portal>
					<Tooltip.Positioner>
						<Tooltip.Content class="card preset-filled-success-800-200 p-2">
							<span
								>{categoryStatus.value === 'completedcategories'
									? 'Reset the Filter'
									: 'Show the completed Categories'}</span
							>
							<Tooltip.Arrow
								class="[--arrow-background:var(--color-success-800-200)] [--arrow-size:--spacing(2)]"
							>
								<Tooltip.ArrowTip />
							</Tooltip.Arrow>
						</Tooltip.Content>
					</Tooltip.Positioner>
				</Portal>
			</Tooltip>
		</li>
	</ul>
{/if}
