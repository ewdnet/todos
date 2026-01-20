import { form, query } from '$app/server';
import { safeParse } from 'valibot';
import { prisma } from '$lib/prisma';
import { deleteArraySchema, deleteSchema, taskCreate, taskSchema } from '$lib/valibot';
import type { TaskItem } from '$lib/types';

function parseIds(raw: string) {
	return raw
		.split(',')
		.map((id) => id.trim())
		.filter(Boolean);
}

export const getTasks = query(async () => {
	const result = await prisma.task.findMany({
		orderBy: { updatedAt: 'desc' }
	});
	const tasks: TaskItem[] = result.map((result) => ({
		...result,
		createdAt: new Date(result.createdAt),
		updatedAt: new Date(result.updatedAt)
	}));
	return tasks;
});

export const createTask = form(
	'unchecked',
	async ({
		title,
		content,
		categoryId
	}: {
		title: string;
		content: string;
		categoryId: string;
	}) => {
		const result = safeParse(taskCreate, { title, content, categoryId });
		if (!result.success) {
			const issues = result.issues.map((issue) => issue.message).join('\n');
			return {
				type: 'error',
				title: 'Failed to create category',
				description: issues
			};
		}

		const existing = await prisma.task.findFirst({ where: { title } });
		if (existing)
			return {
				type: 'error',
				title: 'Create Task',
				description: `Task "${title}" already exists.`
			};

		const now = Date.now();

		try {
			await prisma.task.create({
				data: {
					id: crypto.randomUUID(),
					title,
					content: content ?? null,
					categoryId,
					createdAt: now,
					updatedAt: now
				}
			});
		} catch (error) {
			console.error(error);
			return {
				type: 'error',
				title: 'Creating the task failed',
				description: 'Failed to create task.'
			};
		}

		return {
			type: 'success',
			title: 'Create Task',
			description: `Task "${title}" created successfully.`
		};
	}
);

export const updateTask = form(
	'unchecked',
	async ({
		id,
		title,
		content,
		progress,
		categoryId
	}: {
		id: string;
		title: string;
		content: string;
		progress: number;
		categoryId: string;
	}) => {
		const result = safeParse(taskSchema, {
			id,
			title,
			content,
			progress,
			categoryId
		});
		if (!result.success) {
			const issues = result.issues.map((issue) => issue.message).join('\n');
			return {
				type: 'error',
				title: 'Failed to update task',
				description: issues
			};
		}

		const existing = await prisma.task.findFirst({ where: { title, NOT: { id } } });
		if (existing)
			return {
				type: 'error',
				title: 'Create Task',
				description: `Task "${title}" already exists.`
			};

		const updatedAt = Date.now();

		try {
			await prisma.task.update({
				where: { id: id },
				data: {
					title: title,
					content: content ?? null,
					progress: progress ?? 0,
					categoryId: categoryId,
					updatedAt
				}
			});
		} catch (error) {
			console.error(error);
			return {
				type: 'error',
				title: 'Updating the task failed',
				description: 'Failed to update task.'
			};
		}

		return {
			type: 'success',
			title: 'Update Task',
			description: `Task "${title}" updated successfully.`
		};
	}
);

export const deleteTask = form(
	'unchecked',
	async ({ id, title }: { id: string; title: string }) => {
		const result = safeParse(deleteSchema, { id });
		if (!result.success) {
			const issues = result.issues.map((issue) => issue.message).join('\n');
			return {
				type: 'error',
				title: 'Failed to delete task',
				description: issues
			};
		}

		try {
			await prisma.task.delete({ where: { id } });
		} catch (error) {
			console.error(error);
			return {
				type: 'error',
				title: 'Deleting the task failed',
				description: 'Failed to delete task.'
			};
		}

		return {
			type: 'success',
			title: 'Delete Task',
			description: `Task "${title}" deleted successfully.`
		};
	}
);

export const deleteTasks = form('unchecked', async ({ id }: { id: string }) => {
	const ids = parseIds(id);

	const result = safeParse(deleteArraySchema, { ids });
	if (!result.success) {
		const issues = result.issues.map((issue) => issue.message).join('\n');
		return {
			type: 'error',
			title: 'Failed to delete multiple tasks',
			description: issues
		};
	}

	try {
		await prisma.task.deleteMany({ where: { id: { in: ids } } });
	} catch (error) {
		console.error(error);
		return {
			type: 'error',
			title: 'Deleting multiple tasks failed',
			description: 'Failed to delete the filtered tasks.'
		};
	}

	return {
		type: 'success',
		title: 'Delete multiple tasks',
		description: 'Selected tasks deleted successfully.'
	};
});
