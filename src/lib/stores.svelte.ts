import type { CategoryStatusFilter, TabValue, TaskStatusFilter } from '$lib/types';

// Minimal typed refs for runes-driven state
function ref<T>(initial: T) {
	let value: T = $state(initial);

	return {
		get value() {
			return value;
		},
		set value(v: T) {
			value = v;
		}
	};
}

function refArray<T>(initial: T[]) {
	let value: T[] = $state(initial);

	return {
		get value() {
			return value;
		},
		set value(v: T[]) {
			value = v;
		}
	};
}

// STORES

// tasks overall progress
export const progressOverall = ref<number | null>(null);

// Tabs (Skeleton UI) - active tab onValueChange
export const activeTab = ref<TabValue>('tasks');

// searchTerm
export const searchTerm = ref('');

// categories status
export const categoryStatus = ref<CategoryStatusFilter>('');

// filter (category)
export const categorySelected = ref('');

// filter (status)
export const taskStatus = ref<TaskStatusFilter>('');

// Paginator Reset (skips to page 1 when filters change)
export const paginatorReset = ref<number>(1);

// Accordion (Skeleton UI) - reset accordion state
export const accordionReset = refArray<string>(['']);
