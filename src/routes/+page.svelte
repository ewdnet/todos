<script lang="ts">
	import Tasks from '$lib/components/Tasks.svelte';
	import Categories from '$lib/components/Categories.svelte';
	import TaskCreate from '$lib/components/TaskCreate.svelte';
	import CategoryCreate from '$lib/components/CategoryCreate.svelte';
	import TasksPageTitle from '$lib/components/TasksPageTitle.svelte';
	import CategoriesPageTitle from '$lib/components/CategoriesPageTitle.svelte';
	import TaskStatus from '$lib/components/TaskStatus.svelte';
	import CategoryStatus from '$lib/components/CategoryStatus.svelte';
	import {
		categoryStatus,
		categorySelected,
		taskStatus,
		progressOverall,
		paginatorReset,
		searchTerm,
		activeTab
	} from '$lib/stores.svelte';
	import type { CategoryItem, TaskItem } from '$lib/types';
	import { computeOverallProgress, filterCategories, filterTasks } from '$lib/utils';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import { getCategories } from '$lib/api/categories.remote';
	import { getTasks } from '$lib/api/tasks.remote';

	const queries = $derived(await Promise.all([getCategories(), getTasks()]));
	const categories = $derived<CategoryItem[]>(queries[0]);
	const tasks = $derived<TaskItem[]>(queries[1]);

	const filters = $derived.by(() => ({
		activeTab: activeTab.value,
		searchTerm: searchTerm.value,
		categoryStatus: categoryStatus.value,
		categorySelected: categorySelected.value,
		taskStatus: taskStatus.value
	}));

	const filteredCategories = $derived.by(() =>
		filterCategories(categories, {
			activeTab: filters.activeTab,
			searchTerm: filters.searchTerm,
			categoryStatus: filters.categoryStatus
		})
	);

	const filteredTasks = $derived.by(() =>
		filterTasks(tasks, {
			activeTab: filters.activeTab,
			categorySelected: filters.categorySelected,
			searchTerm: filters.searchTerm,
			taskStatus: filters.taskStatus
		})
	);

	const overallProgress = $derived.by(() => computeOverallProgress(tasks));

	$effect(() => {
		progressOverall.value = overallProgress;
	});

	$effect(() => {
		const resetInputs = [
			filters.activeTab,
			filters.searchTerm,
			filters.taskStatus,
			filters.categoryStatus,
			filters.categorySelected
		];

		if (resetInputs.length) paginatorReset.value = 1;
	});
</script>

<Tabs defaultValue="tasks" value={activeTab.value}>
	<Tabs.Content value="tasks">
		<header>
			<h1 class="pb-4 h4"><TasksPageTitle {categories} /></h1>
			<div class="flex flex-row-reverse items-center justify-between gap-4 pb-4">
				<TaskCreate {categories} />
				<TaskStatus {tasks} />
			</div>
		</header>
		<Tasks {categories} tasks={filteredTasks} />
	</Tabs.Content>
	<Tabs.Content value="categories">
		<header>
			<h1 class="pb-4 h4"><CategoriesPageTitle /></h1>
			<div class="flex flex-row-reverse items-center justify-between gap-4 pb-4">
				<CategoryCreate />
				<CategoryStatus {categories} />
			</div>
		</header>
		<Categories categories={filteredCategories} />
	</Tabs.Content>
</Tabs>
