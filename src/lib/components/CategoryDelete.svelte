<script lang="ts">
	import type { TaskItem } from '$lib/types';
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { activeTab, paginatorReset } from '$lib/stores.svelte';
	import { deleteCategory } from '$lib/api/categories.remote';
	import { animation } from '$lib/animationCss';
	import { toaster } from '$lib/toaster';
	import { TrashIcon, XIcon } from '@lucide/svelte';
	const iconSize = 16;

	let { category } = $props<{ category: { id: string; name: string; tasks: TaskItem[] } }>();

	let open = $state(false);
	const categoryForm = $derived.by(() => deleteCategory.for(category.id));

	$effect(() => {
		if (!categoryForm.fields.id.issues()?.length) return;
		const message = {
			title: 'Delete Category',
			description: categoryForm.fields.id
				.issues()
				?.map((i) => i.message)
				.join(' ')
		};
		toaster.error(message);
	});
	$effect(() => {
		if (!categoryForm.result) return;

		const { type } = categoryForm.result;
		let message = {
			title: categoryForm.result.title,
			description: categoryForm.result.description
		};
		if (type === 'error') toaster.error(message);
		if (type === 'success') toaster.success(message);
	});
</script>

<Dialog {open} onOpenChange={(details: { open: boolean }) => (open = details.open)}>
	<Dialog.Trigger class="btn preset-outlined-error-200-800 btn-sm text-error-500">
		<TrashIcon size={iconSize} />
		Delete
	</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center">
			<Dialog.Content class="w-md space-y-2 card bg-surface-100-900 p-4 shadow-xl {animation}">
				<Dialog.Title class="text-center text-2xl font-bold"
					>Realy delete the Category?</Dialog.Title
				>
				<Dialog.Description>
					{#if category.tasks.length}
						<p class="pb-8 text-center text-warning-500">
							All tasks in the category are also deleted.
						</p>
					{/if}
					<form
						{...categoryForm.enhance(async ({ submit }) => {
							await submit();
							if (categoryForm.result) {
								open = false;
								activeTab.value = 'categories';
								paginatorReset.value = 1;
							}
						})}
					>
						<input type="hidden" name="id" value={category.id} />
						<input type="hidden" name="name" value={category.name} />
						<div class="flex items-center justify-center gap-8">
							<Dialog.CloseTrigger class="btn preset-tonal btn-sm">
								<XIcon size={iconSize} />
								Cancel
							</Dialog.CloseTrigger>
							<button type="submit" class="btn preset-filled-error-200-800 btn-sm">
								<TrashIcon size={iconSize} />
								Delete Category
							</button>
						</div>
					</form>
				</Dialog.Description>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
