import type {
	CategoryItem,
	CategoryStatusFilter,
	TabValue,
	TaskItem,
	TaskStatusFilter
} from '$lib/types';
type FilterState = {
	activeTab: TabValue;
	searchTerm: string;
	categoryStatus: CategoryStatusFilter;
	categorySelected: string;
	taskStatus: TaskStatusFilter;
};

export function computeOverallProgress(tasks: TaskItem[]): number | null {
	const total = tasks.length;
	if (!total) return null;

	const sum = tasks.reduce((acc, task) => acc + task.progress, 0);
	return Math.round(sum / total);
}

export function filterCategories(
	categories: CategoryItem[],
	filters: Pick<FilterState, 'activeTab' | 'searchTerm' | 'categoryStatus'>
): CategoryItem[] {
	const search = filters.searchTerm.trim().toLowerCase();
	let result = categories;

	if (filters.activeTab === 'categories' && search) {
		result = result.filter((category) => category.name.toLowerCase().includes(search));
	}

	switch (filters.categoryStatus) {
		case 'emptycategories':
			result = result.filter((category) => category.tasks.length === 0);
			break;
		case 'newcategories':
			result = result.filter(
				(category) =>
					category.tasks.length > 0 && category.tasks.every((task) => task.progress === 0)
			);
			break;
		case 'inprogresscategories':
			result = result.filter(
				(category) =>
					category.tasks.length > 0 &&
					category.tasks.some((task) => task.progress > 0 && task.progress < 100)
			);
			break;
		case 'completedcategories':
			result = result.filter(
				(category) =>
					category.tasks.length > 0 && category.tasks.every((task) => task.progress === 100)
			);
			break;
		default:
			break;
	}

	return result;
}

export function filterTasks(
	tasks: TaskItem[],
	filters: Pick<FilterState, 'activeTab' | 'categorySelected' | 'searchTerm' | 'taskStatus'>
): TaskItem[] {
	const search = filters.searchTerm.trim().toLowerCase();
	let result = tasks;

	if (filters.categorySelected) {
		result = result.filter((task) => task.categoryId === filters.categorySelected);
	}

	if (filters.activeTab === 'tasks' && search) {
		result = result.filter(
			(task) =>
				task.title.toLowerCase().includes(search) || task.content?.toLowerCase().includes(search)
		);
	}

	switch (filters.taskStatus) {
		case 'new':
			result = result.filter((task) => task.progress === 0);
			break;
		case 'current':
			result = result.filter((task) => task.progress > 0 && task.progress < 100);
			break;
		case 'completed':
			result = result.filter((task) => task.progress === 100);
			break;
		default:
			break;
	}

	return result;
}
