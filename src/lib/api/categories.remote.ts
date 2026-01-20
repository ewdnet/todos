import { form, query } from '$app/server';
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

export const createCategory = form('unchecked', async ({ name }: { name: string }) => {
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

export const deleteCategory = form(
	'unchecked',
	async ({ id, name }: { id: string; name: string }) => {
		const result = safeParse(categorySchema, { id, name });
		if (!result.success) {
			const issues = result.issues.map((issue) => issue.message).join('\n');
			return {
				type: 'error',
				title: 'Failed to delete category',
				description: issues
			};
		}
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
			description: `Category "${name}" deleted successfully.`
		};
	}
);

export const deleteCategories = form('unchecked', async ({ id }: { id: string }) => {
	const result = safeParse(idMultipleSchema, { id });
	if (!result.success) {
		const issues = result.issues.map((issue) => issue.message).join('\n');
		return {
			type: 'error',
			title: 'Failed to delete multiple categories',
			description: issues
		};
	}

	const ids = parseIds(id);

	try {
		await prisma.category.deleteMany({ where: { id: { in: ids } } });
	} catch (error) {
		console.error(error);
		return {
			type: 'error',
			title: 'Deleting multiple categories failed',
			description: 'Failed to delete the filtered categories and their tasks.'
		};
	}

	return {
		type: 'success',
		title: 'Delete multiple categories',
		description: 'The filtered categories and their tasks have been deleted.'
	};
});
