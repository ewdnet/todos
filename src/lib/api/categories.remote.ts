import { form, query } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { safeParse } from 'valibot';
import { prisma } from '$lib/prisma';
import { categorySchema, idMultipleSchema } from '$lib/valibot';

const parseIds = (raw: string) => {
	return raw
		.split(',')
		.map((id) => id.trim())
		.filter(Boolean);
};

export const getCategories = query(async () => {
	const categories = await prisma.category.findMany({
		include: { tasks: { select: { id: true, progress: true } } },
		orderBy: { name: 'asc' }
	});

	return categories;
});

export const createCategory = form('unchecked', async ({ name }) => {
	name = Array.isArray(name) ? name[0] : name;
	if (typeof name !== 'string') {
		return {
			type: 'error',
			title: 'Creating the category failed',
			description: 'Category name must be a string.'
		};
	}
	const result = safeParse(categorySchema, { id: crypto.randomUUID(), name });
	if (!result.success) {
		const issues = result.issues.map((issue) => issue.message).join('\n');
		return {
			type: 'error',
			title: 'Failed to create category',
			description: issues
		};
	}

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

export const deleteCategory = form(categorySchema, async ({ id, name }) => {
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
		description: `Category ${name} deleted successfully.`
	};
});

export const deleteCategories = form(idMultipleSchema, async ({ id }, issue) => {
	const ids = parseIds(id);

	if (ids.length === 0) invalid(issue.id('No categories selected.'));

	await prisma.category.deleteMany({ where: { id: { in: ids } } });
});
