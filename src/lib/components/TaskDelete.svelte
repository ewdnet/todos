<script lang="ts">
	import type { TaskItem } from '$lib/types';
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import { activeTab, paginatorReset } from '$lib/stores.svelte';
	import { animation } from '$lib/animationCss';
	import { TrashIcon, XIcon } from '@lucide/svelte';
	import { deleteTask } from '$lib/api/tasks.remote';
	import { toaster } from '$lib/toaster';
	const iconSize = 16;

	let { task } = $props<{ task: TaskItem }>();
	let open = $state(false);
	const taskForm = $derived.by(() => deleteTask.for(task.id));

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
	<Dialog.Trigger class="btn preset-outlined-error-200-800 btn-sm">
		<TrashIcon size={iconSize} />
		Delete
	</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center">
			<Dialog.Content class="w-md space-y-2 card bg-surface-100-900 p-4 shadow-xl {animation}">
				<Dialog.Title class="text-center text-2xl font-bold">Really delete the task?</Dialog.Title>
				<Dialog.Description>
					<form
						class="space-y-4"
						{...taskForm.enhance(async ({ submit }) => {
							await submit();
							if (taskForm.result?.type === 'success') {
								open = false;
								activeTab.value = 'tasks';
								paginatorReset.value = 1;
							}
						})}
					>
						<fieldset>
							<input type="hidden" name="id" value={task.id} />
							<input type="hidden" name="title" value={task.title} />
						</fieldset>
						<div class="flex items-center justify-center gap-8">
							<Dialog.CloseTrigger class="btn preset-tonal btn-sm">
								<XIcon size={iconSize} />
								Cancel
							</Dialog.CloseTrigger>
							<button type="submit" class="btn preset-filled-error-200-800 btn-sm">
								<TrashIcon size={iconSize} />
								Delete task
							</button>
						</div>
					</form>
				</Dialog.Description>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
