<script lang="ts">
	import type { TaskItem, TooltipTriggerAttrs } from '$lib/types';
	import { Dialog, Portal, Tooltip } from '@skeletonlabs/skeleton-svelte';
	import {
		activeTab,
		categorySelected,
		paginatorReset,
		searchTerm,
		taskStatus
	} from '$lib/stores.svelte';
	import { animation } from '$lib/animationCss';
	import { TrashIcon, XIcon } from '@lucide/svelte';
	import { deleteTasks } from '$lib/api/tasks.remote';
	const iconSize = 16;

	let { tasks } = $props<{ tasks: TaskItem[] }>();

	let taskItems: string[] = $derived(tasks.map((task: TaskItem) => task.id));

	let open = $state(false);
	const deleteTasksFormKey = $state(`delete-tasks-bulk-${crypto.randomUUID()}`);
	const deleteTasksForm = $derived.by(() => deleteTasks.for(deleteTasksFormKey));
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
						>Delete {searchTerm.value || taskStatus.value || categorySelected.value
							? 'Filtered '
							: 'All'} tasks.</span
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
					>Realy delete the {searchTerm.value || taskStatus.value || categorySelected.value
						? `${tasks.length} filtered `
						: 'all'} Tasks?</Dialog.Title
				>
				<Dialog.Description>
					<p class="pb-8 text-center">
						All {searchTerm.value || taskStatus.value || categorySelected.value ? 'filtered' : ''} tasks
						are deleted.
					</p>
					<form
						{...deleteTasksForm.enhance(async ({ submit }) => {
							try {
								await submit();
								open = false;
								searchTerm.value = '';
								taskStatus.value = '';
								categorySelected.value = '';
								activeTab.value = 'tasks';
								paginatorReset.value = 1;
							} catch (error) {
								console.error('Failed to delete tasks', error);
							}
						})}
					>
						<input type="hidden" name="id" value={taskItems.join(',')} />
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
