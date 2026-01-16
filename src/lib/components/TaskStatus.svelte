<script lang="ts">
	import type { TaskItem } from '$lib/types';
	import {
		categorySelected,
		activeTab,
		searchTerm,
		taskStatus,
		accordionReset
	} from '$lib/stores.svelte';
	import { Portal, Tooltip } from '@skeletonlabs/skeleton-svelte';

	let { tasks } = $props<{ tasks: TaskItem[] }>();

	const baseTasksForCounts = () => {
		let result = tasks;
		if (categorySelected.value !== '') {
			result = result.filter((task: TaskItem) => task.categoryId === categorySelected.value);
		}
		if (activeTab.value === 'tasks' && searchTerm.value.length > 0) {
			const q = searchTerm.value.toLowerCase();
			result = result.filter(
				(task: TaskItem) =>
					task.title.toLowerCase().includes(q) || task.content?.toLowerCase().includes(q)
			);
		}
		return result;
	};

	// New Tasks
	const newTasks = () => {
		return baseTasksForCounts().filter((task: TaskItem) => task.progress === 0).length;
	};
	// Tasks in Progress
	const inprogressTasks = () => {
		return baseTasksForCounts().filter((task: TaskItem) => task.progress > 0 && task.progress < 100)
			.length;
	};
	// Completed Tasks
	const completedTasks = () => {
		return baseTasksForCounts().filter((task: TaskItem) => task.progress === 100).length;
	};
</script>

{#if tasks.length}
	<ul class="flex items-center gap-2">
		<li>
			<Tooltip positioning={{ placement: 'top' }}>
				<Tooltip.Trigger
					type="button"
					onclick={() => {
						taskStatus.value = taskStatus.value === 'new' ? '' : 'new';
						accordionReset.value = [];
					}}
					disabled={newTasks() === 0}
					class="btn-icon btn btn-icon-sm rounded-full border border-error-500 bg-error-500/15"
				>
					{newTasks()}
				</Tooltip.Trigger>
				<Portal>
					<Tooltip.Positioner>
						<Tooltip.Content class="card preset-filled-error-800-200 p-2">
							<span>{taskStatus.value === 'new' ? 'Reset the Filter' : 'Show the new Tasks'}</span>
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
						taskStatus.value = taskStatus.value === 'current' ? '' : 'current';
						accordionReset.value = [];
					}}
					disabled={inprogressTasks() === 0}
					class="btn-icon btn btn-icon-sm rounded-full border border-warning-500 bg-warning-500/15"
				>
					{inprogressTasks()}
				</Tooltip.Trigger>
				<Portal>
					<Tooltip.Positioner>
						<Tooltip.Content class="card preset-filled-warning-800-200 p-2">
							<span
								>{taskStatus.value === 'current'
									? 'Reset the Filter'
									: 'Show the Tasks in Progress'}</span
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
						taskStatus.value = taskStatus.value === 'completed' ? '' : 'completed';
						accordionReset.value = [];
					}}
					disabled={completedTasks() === 0}
					class="btn-icon btn btn-icon-sm rounded-full border border-success-500 bg-success-500/15"
				>
					{completedTasks()}
				</Tooltip.Trigger>
				<Portal>
					<Tooltip.Positioner>
						<Tooltip.Content class="card preset-filled-success-800-200 p-2">
							<span
								>{taskStatus.value === 'completed'
									? 'Reset the Filter'
									: 'Show the completed Tasks'}</span
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
