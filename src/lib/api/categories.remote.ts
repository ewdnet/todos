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

export const createCategory = form(categoryCreate, async ({ name }, issue) => {
	const existing = await prisma.category.findFirst({ where: { name } });

	if (existing) invalid(issue.name('Category name already exists.'));

	const category = await prisma.category.create({
		data: { id: crypto.randomUUID(), name }
	});

	return category;
});

export const deleteCategory = form(idSchema, async ({ id }) => {
	await prisma.category.delete({ where: { id } });
});

export const deleteCategories = form(idMultipleSchema, async ({ id }, issue) => {
	const ids = parseIds(id);

	if (ids.length === 0) invalid(issue.id('No categories selected.'));

	await prisma.category.deleteMany({ where: { id: { in: ids } } });
});
