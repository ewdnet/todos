<script lang="ts">
	import type { CategoryItem, TaskItem } from '$lib/types';
	import { Dialog, Portal, Slider } from '@skeletonlabs/skeleton-svelte';
	import { activeTab, paginatorReset } from '$lib/stores.svelte';
	import { animation } from '$lib/animationCss';
	import { CheckIcon, PencilIcon, XIcon } from '@lucide/svelte';
	import { updateTask } from '$lib/api/tasks.remote';
	import { toaster } from '$lib/toaster';
	const iconSize = 16;

	let { categories, task } = $props<{ categories: CategoryItem[]; task: TaskItem }>();

	let title = $state('');
	let progress = $state(0);
	let content = $state<string | null>(null);
	let categoryId = $state('');
	const taskForm = $derived.by(() => updateTask.for(task.id));

	$effect(() => {
		void task.id;
		title = task.title;
		progress = task.progress;
		content = task.content;
		categoryId = task.categoryId;
	});
	let open = $state(false);
	const bgColorClass = (progress: number) => {
		if (progress > 0 && progress <= 25) return 'bg-error-500/50';
		if (progress > 25 && progress <= 75) return 'bg-warning-500/50';
		if (progress > 75 && progress <= 100) return 'bg-success-500/50';
		return '';
	};

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
		<PencilIcon size={iconSize} />
		Edit
	</Dialog.Trigger>
	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center">
			<Dialog.Content class="w-md space-y-2 card bg-surface-100-900 p-4 shadow-xl {animation}">
				<Dialog.Title class="text-2xl font-bold">Edit Task</Dialog.Title>
				<Dialog.Description>
					<form
						class="space-y-4 card preset-filled-surface-300-700 p-4"
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
							<label class="label" for="title">
								<span class="label-text">Title</span>
								<input
									type="text"
									id="title"
									name="title"
									class="input w-full"
									bind:value={title}
									required
								/>
							</label>
							<Slider
								onValueChange={(details: { value: number[] }) => (progress = details.value[0])}
								min={0}
								max={100}
								step={25}
								value={[progress]}
								class="my-4"
							>
								<Slider.Label><span class="text-label">Progress {progress}%</span></Slider.Label>
								<Slider.Control>
									<Slider.Track>
										<Slider.Range class={bgColorClass(progress)} />
									</Slider.Track>
									<Slider.Thumb index={0}>
										<Slider.HiddenInput name="n:progress" value={[progress]} />
									</Slider.Thumb>
								</Slider.Control>
								<Slider.MarkerGroup>
									<Slider.Marker value={25} />
									<Slider.Marker value={50} />
									<Slider.Marker value={75} />
								</Slider.MarkerGroup>
								<Slider.ValueText />
							</Slider>
							<label class="label" for="content">
								<span class="label-text">Content</span>
								<textarea
									id="content"
									name="content"
									class="input h-32 w-full"
									value={content ?? ''}
									oninput={(event) => {
										const v = (event.currentTarget as HTMLTextAreaElement).value;
										content = v === '' ? null : v;
									}}
								></textarea>
							</label>
							<label class="label" for="categoryId">
								<span class="label-text">Category</span>
								<select id="categoryId" name="categoryId" class="select" bind:value={categoryId}>
									<option value={task.categoryId}
										>{categories.find((c: CategoryItem) => c.id === task.categoryId)?.name}</option
									>
									{#each categories as category (category.id)}
										{#if category.id !== task.categoryId}
											<option value={category.id}>{category.name}</option>
										{/if}
									{/each}
								</select>
							</label>
						</fieldset>
						<div class="flex items-center justify-center gap-8">
							<Dialog.CloseTrigger class="btn preset-tonal btn-sm">
								<XIcon size={iconSize} />
								Cancel
							</Dialog.CloseTrigger>
							<button type="submit" class="btn preset-filled-success-500 btn-sm">
								<CheckIcon size={iconSize} />
								Save Task
							</button>
						</div>
					</form>
				</Dialog.Description>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
