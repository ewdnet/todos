<script lang="ts">
	import type { CategoryItem, TooltipTriggerAttrs } from '$lib/types';
	import { Dialog, Portal, Tooltip } from '@skeletonlabs/skeleton-svelte';
	import {
		categorySelected,
		categoryStatus,
		activeTab,
		paginatorReset,
		searchTerm
	} from '$lib/stores.svelte';
	import { animation } from '$lib/animationCss';
	import { TrashIcon, XIcon } from '@lucide/svelte';
	import { deleteCategories } from '$lib/api/categories.remote';
	import { toaster } from '$lib/toaster';
	const iconSize = 16;

	let { categories } = $props<{ categories: CategoryItem[] }>();

	let categoryItems: string[] = $derived(categories.map((category: CategoryItem) => category.id));

	let open = $state(false);
	const deleteCategoriesFormKey = $state(`delete-categories-bulk-${crypto.randomUUID()}`);
	const deleteCategoriesForm = $derived.by(() => deleteCategories.for(deleteCategoriesFormKey));

	$effect(() => {
		if (!deleteCategoriesForm.result) return;

		const { type } = deleteCategoriesForm.result;
		let message = {
			title: deleteCategoriesForm.result.title,
			description: deleteCategoriesForm.result.description
		};
		if (type === 'error') toaster.error(message);
		if (type === 'success') toaster.success(message);
	});
</script>

{#snippet tooltipTrigger(attrs: TooltipTriggerAttrs)}
	<Dialog.Trigger
		class="btn-icon btn btn-icon-sm rounded-full preset-outlined-error-200-800 text-error-500"
		{...attrs}
	>
		<TrashIcon size={iconSize} />
	</Dialog.Trigger>
{/snippet}

<Dialog {open} onOpenChange={(details: { open: boolean }) => (open = details.open)}>
	<Tooltip positioning={{ placement: 'top' }}>
		<Tooltip.Trigger element={tooltipTrigger} />
		<Portal>
			<Tooltip.Positioner>
				<Tooltip.Content class="card preset-filled-error-800-200 p-2">
					<span
						>Delete {searchTerm.value || categoryStatus.value || categorySelected.value
							? 'Filtered '
							: 'All'} categories.</span
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

	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center">
			<Dialog.Content class="w-md space-y-2 card bg-surface-100-900 p-4 shadow-xl {animation}">
				<Dialog.Title class="text-center text-2xl font-bold"
					>Realy delete the {searchTerm.value || categoryStatus.value || categorySelected.value
						? `${categories.length} filtered `
						: 'all'} Categories?</Dialog.Title
				>
				<Dialog.Description>
					<p class="pb-8 text-center text-warning-500">
						All tasks {searchTerm.value || categoryStatus.value || categorySelected.value
							? 'in the filtered categories'
							: ''} are also deleted.
					</p>
					<form
						{...deleteCategoriesForm.enhance(async ({ submit }) => {
							await submit();
							if (deleteCategoriesForm.result?.type === 'success') {
								open = false;
								searchTerm.value = '';
								categoryStatus.value = '';
								activeTab.value = 'categories';
								paginatorReset.value = 1;
							}
						})}
					>
						<input type="hidden" name="id" value={categoryItems.join(',')} />
						<div class="flex items-center justify-center gap-8">
							<Dialog.CloseTrigger class="btn preset-tonal btn-sm">
								<XIcon size={iconSize} />
								Cancel
							</Dialog.CloseTrigger>
							<button type="submit" class="btn preset-filled-error-200-800 btn-sm">
								<TrashIcon size={iconSize} />
								Delete Categories
							</button>
						</div>
					</form>
				</Dialog.Description>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
