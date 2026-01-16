<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { activeTab, categoryStatus, paginatorReset, searchTerm } from '$lib/stores.svelte';
	import { createCategory } from '$lib/api/categories.remote';
	import { animation } from '$lib/animationCss';
	import { TagIcon, XIcon } from '@lucide/svelte';
	const iconSize = 16;

	let open = $state(false);
	const categoryFormKey = $state(`create-category-${crypto.randomUUID()}`);
	const categoryForm = $derived.by(() => createCategory.for(categoryFormKey));
</script>

<Dialog {open} onOpenChange={(details: { open: boolean }) => (open = details.open)}>
	<Dialog.Trigger class="btn preset-tonal btn-sm">
		<TagIcon size={iconSize} />
		New Category
	</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center">
			<Dialog.Content class="w-md space-y-2 card bg-surface-100-900 p-4 shadow-xl {animation}">
				<Dialog.Title class="text-center text-2xl font-bold">Add New Category</Dialog.Title>
				<Dialog.Description>
					<form
						class="space-y-4"
						{...categoryForm.enhance(async ({ form, submit }) => {
							try {
								await submit();
								form.reset();
								open = false;
								searchTerm.value = '';
								categoryStatus.value = '';
								activeTab.value = 'categories';
								paginatorReset.value = 1;
							} catch (error) {
								console.error('Failed to create category', error);
							}
						})}
					>
						<fieldset class="py-4">
							<label for="name" class="label">
								<span class="label-text">Category Nme</span>
								<input id="name" class="input" name="name" required />
							</label>
						</fieldset>
						<div class="flex items-center justify-center gap-8">
							<Dialog.CloseTrigger class="btn preset-tonal btn-sm">
								<XIcon size={iconSize} />
								Cancel
							</Dialog.CloseTrigger>
							<button type="submit" class="btn preset-filled-primary-500 btn-sm"
								>Add Category</button
							>
						</div>
					</form>
				</Dialog.Description>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
