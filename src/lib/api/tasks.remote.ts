import { form, query } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { idMultipleSchema, idSchema, taskCreate, taskSchema } from '$lib/valibot';

const toTaskItem = (task: {
	id: string;
	title: string;
	content: string | null;
	progress: number;
	categoryId: string;
	createdAt: number;
	updatedAt: number;
}) => ({
	...task,
	createdAt: new Date(task.createdAt),
	updatedAt: new Date(task.updatedAt)
});

function parseIds(raw: string) {
	return raw
		.split(',')
		.map((id) => id.trim())
		.filter(Boolean);
}

export const getTasks = query(async () => {
	const tasks = await prisma.task.findMany({
		orderBy: { updatedAt: 'desc' }
	});

	return tasks.map(toTaskItem);
});

export const createTask = form(taskCreate, async ({ title, content, categoryId }, issue) => {
	const existingTitle = await prisma.task.findFirst({ where: { title } });

	if (existingTitle) invalid(issue.title('Task title already exists.'));

	const now = Date.now();

	const task = await prisma.task.create({
		data: {
			id: crypto.randomUUID(),
			title,
			content: content ?? null,
			categoryId,
			createdAt: now,
			updatedAt: now
		}
	});

	return toTaskItem(task);
});

export const updateTask = form(taskSchema, async (data, issue) => {
	const existingTitle = await prisma.task.findFirst({
		where: { title: data.title, NOT: { id: data.id } }
	});

	if (existingTitle) invalid(issue.title('Task title already exists.'));

	const updatedAt = Date.now();

	const task = await prisma.task.update({
		where: { id: data.id },
		data: {
			title: data.title,
			content: data.content ?? null,
			progress: data.progress ?? 0,
			categoryId: data.categoryId,
			updatedAt
		}
	});

	return toTaskItem(task);
});

export const deleteTask = form(idSchema, async ({ id }) => {
	await prisma.task.delete({ where: { id } });
});

export const deleteTasks = form(idMultipleSchema, async ({ id }, issue) => {
	const ids = parseIds(id);

	if (ids.length === 0) invalid(issue.id('No tasks selected.'));

	await prisma.task.deleteMany({ where: { id: { in: ids } } });
});
