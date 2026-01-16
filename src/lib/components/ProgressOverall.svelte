<script lang="ts">
	import { progressOverall } from '$lib/stores.svelte';
	import { Portal, Progress, Tooltip } from '@skeletonlabs/skeleton-svelte';

	let value = $derived(progressOverall.value);

	let rangeClass: string = $state('');
	$effect(() => {
		if (value === null || value <= 33) {
			rangeClass = 'stroke-error-500/60';
		} else if (value > 33 && value <= 66) {
			rangeClass = 'stroke-warning-500/60';
		} else if (value > 66) {
			rangeClass = 'stroke-success-500/60';
		}
	});
</script>

<Tooltip positioning={{ placement: 'right' }}>
	<Tooltip.Trigger>
		<Progress class="relative w-fit" {value} defaultValue={null}>
			<div class="absolute inset-0 flex items-center justify-center">
				<Progress.ValueText />
			</div>
			<Progress.Circle>
				<Progress.CircleTrack />
				<Progress.CircleRange class={rangeClass} />
			</Progress.Circle>
		</Progress>
	</Tooltip.Trigger>
	<Portal>
		<Tooltip.Positioner>
			<Tooltip.Content class="card bg-surface-50-950 p-2 shadow-xl">
				<span>Overall Progress {value}%</span>
				<Tooltip.Arrow
					class="[--arrow-background:var(--color-surface-50-950)] [--arrow-size:--spacing(2)]"
				>
					<Tooltip.ArrowTip />
				</Tooltip.Arrow>
			</Tooltip.Content>
		</Tooltip.Positioner>
	</Portal>
</Tooltip>
