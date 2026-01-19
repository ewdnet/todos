import { maxLength, minLength, nonEmpty, number, object, optional, pipe, string } from 'valibot';

export const idMultipleSchema = object({
	id: pipe(string(), minLength(2, 'At least one ID is required'))
});

export const categorySchema = object({
	id: pipe(string(), minLength(31, 'Category number is missing or irregular!')),
	name: pipe(
		string(),
		minLength(2, 'Name must be at least 2 characters long!'),
		maxLength(32, 'Name must be at most 32 characters long!')
	)
});

export const taskSchema = object({
	id: string(),
	title: pipe(
		string(),
		minLength(2, 'Title must be at least 2 characters long!'),
		maxLength(32, 'Title must be at most 32 characters long!')
	),
	content: optional(string()),
	progress: optional(number()),
	categoryId: string()
});

export const taskCreate = object({
	title: pipe(
		string(),
		minLength(2, 'Title must be at least 2 characters long!'),
		maxLength(32, 'Title must be at most 32 characters long!')
	),
	content: optional(string()),
	categoryId: pipe(string(), nonEmpty('Category is required!'))
});

export const taskUpdate = object({
	id: string(),
	title: pipe(
		string(),
		minLength(2, 'Title must be at least 2 characters long!'),
		maxLength(32, 'Title must be at most 32 characters long!')
	),
	progress: optional(number()),
	content: optional(string()),
	categoryId: pipe(string(), nonEmpty('Category is required!'))
});
