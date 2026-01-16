import type { TooltipTriggerProps } from '@skeletonlabs/skeleton-svelte';

export type CategoryItem = {
	id: string;
	name: string;
	tasks: {
		id: string;
		progress: number;
	}[];
};
export type TaskItem = {
	id: string;
	title: string;
	content: string | null;
	progress: number;
	categoryId: string;
	createdAt: Date;
	updatedAt: Date;
};

export type TooltipTriggerAttrs = TooltipTriggerProps extends {
	element?: import('svelte').Snippet<infer A extends unknown[]>;
}
	? A[0]
	: never;

// Filter Types
export type TabValue = 'tasks' | 'categories';

export type TaskStatusFilter = '' | 'new' | 'current' | 'completed';

export type CategoryStatusFilter =
	| ''
	| 'emptycategories'
	| 'newcategories'
	| 'inprogresscategories'
	| 'completedcategories';
