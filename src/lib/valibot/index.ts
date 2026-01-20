import {
	array,
	maxLength,
	minLength,
	nonEmpty,
	number,
	object,
	optional,
	pipe,
	string,
	uuid
} from 'valibot';

export const deleteSchema = object({
	id: pipe(string(), uuid('Item ID is missing or badly formated!'))
});

export const deleteArraySchema = object({
	ids: pipe(
		array(pipe(string(), uuid('Item ID is missing or badly formated!'))),
		minLength(2, 'At least two IDs are required for bulk deletion!')
	)
});

export const categorySchema = object({
	id: pipe(string(), minLength(31, 'Category number is missing or irregular!')),
	name: pipe(
		string(),
		minLength(2, 'Name must be at least 2 characters long!'),
		maxLength(32, 'Name must be at most 32 characters long!')
	)
});

export const taskCreate = object({
	title: pipe(
		string(),
		minLength(2, 'Title must be at least 2 characters long!'),
		maxLength(32, 'Title must be at most 32 characters long!')
	),
	content: optional(string()),
	categoryId: pipe(
		string('Category is required! Please select one.'),
		uuid('Category ID is badly formated!')
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
	categoryId: pipe(string(), nonEmpty('Category is required!'))
});
