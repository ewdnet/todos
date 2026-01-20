<script lang="ts">
	import type { CategoryItem } from '$lib/types';
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import {
		activeTab,
		categorySelected,
		paginatorReset,
		searchTerm,
		taskStatus
	} from '$lib/stores.svelte';
	import { createTask } from '$lib/api/tasks.remote';
	import { animation } from '$lib/animationCss';
	import { ListFilterPlusIcon, XIcon } from '@lucide/svelte';
	import { toaster } from '$lib/toaster';
	const iconSize = 16;

	let { categories } = $props<{ categories: CategoryItem[] }>();
	let open = $state(false);
	const taskFormKey = $state(`create-task-${crypto.randomUUID()}`);
	const taskForm = $derived.by(() => createTask.for(taskFormKey));

	$effect(() => {
		if (!taskForm.result) return;
		const { type } = taskForm.result;
		const message = {
			title: taskForm.result.title,
			description: taskForm.result.description
		};
		if (type === 'error') toaster.error(message);
		if (type === 'success') toaster.success(message);
	});
</script>

<Dialog {open} onOpenChange={(details: { open: boolean }) => (open = details.open)}>
	<Dialog.Trigger class="btn preset-tonal btn-sm" disabled={categories.length === 0}>
		<ListFilterPlusIcon size={iconSize} />
		New Task
	</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center">
			<Dialog.Content class="w-md space-y-2 card bg-surface-100-900 p-4 shadow-xl {animation}">
				<Dialog.Title class="text-2xl font-bold">Add New Task</Dialog.Title>
				<Dialog.Description>
					<form
						class="space-y-4 card preset-filled-surface-300-700 p-4"
						{...taskForm.enhance(async ({ form, submit }) => {
							await submit();
							if (taskForm.result?.type === 'success') {
								form.reset();
								open = false;
								searchTerm.value = '';
								categorySelected.value = '';
								taskStatus.value = '';
								activeTab.value = 'tasks';
								paginatorReset.value = 1;
							}
						})}
					>
						<fieldset>
							<label for="categoryId" class="label">
								<span class="label-text">Category</span>
								<select id="categoryId" class="select" name="categoryId">
									<option value="" disabled selected>Select a category</option>
									{#each categories as category (category.id)}
										<option value={category.id}>{category.name}</option>
									{/each}
								</select>
							</label>
							<label for="title" class="label">
								<span class="label-text">Title</span>
								<input id="title" class="input" name="title" />
							</label>
							<label for="content" class="label">
								<span class="label-text">Content</span>
								<textarea id="content" class="textarea" name="content"></textarea>
							</label>
						</fieldset>
						<div class="flex items-center justify-center gap-8">
							<Dialog.CloseTrigger class="btn preset-tonal btn-sm">
								<XIcon size={iconSize} />
								Cancel
							</Dialog.CloseTrigger>
							<button type="submit" class="btn preset-filled-primary-500 btn-sm">Add Task</button>
						</div>
					</form>
				</Dialog.Description>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
