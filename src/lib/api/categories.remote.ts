import { form, query } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { categoryCreate, idMultipleSchema, idSchema } from '$lib/valibot';

function parseIds(raw: string) {
	return raw
		.split(',')
		.map((id) => id.trim())
		.filter(Boolean);
}

export const getCategories = query(async () => {
	const categories = await prisma.category.findMany({
		include: { tasks: { select: { id: true, progress: true } } },
		orderBy: { name: 'asc' }
	});

	return categories;
});

export const createCategory = form(categoryCreate, async ({ name }) => {
	const existing = await prisma.category.findFirst({ where: { name } });

	if (existing)
		return {
			type: 'error',
			title: 'Create Category',
			description: `Category "${name}" already exists.`
		};

	try {
		await prisma.category.create({ data: { id: crypto.randomUUID(), name } });
	} catch (error) {
		console.error(error);
		return {
			type: 'error',
			title: 'Creating the category failed',
			description: 'Failed to create category.'
		};
	}

	return {
		type: 'success',
		title: 'Create Category',
		description: `Category "${name}" created successfully.`
	};
});

export const deleteCategory = form(idSchema, async ({ id }) => {
	try {
		await prisma.category.delete({ where: { id } });
	} catch (error) {
		console.error(error);
		return {
			type: 'error',
			title: 'Deleting the category failed',
			description: 'Failed to delete category.'
		};
	}
	return {
		type: 'success',
		title: 'Category Deleting',
		description: 'Category deleted successfully.'
	};
});

export const deleteCategories = form(idMultipleSchema, async ({ id }, issue) => {
	const ids = parseIds(id);

	if (ids.length === 0) invalid(issue.id('No categories selected.'));

	await prisma.category.deleteMany({ where: { id: { in: ids } } });
});
