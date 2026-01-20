import type { HandleValidationError } from '@sveltejs/kit';

export const handleValidationError: HandleValidationError = ({ issues }) => {
	return {
		message: issues.map((issue) => issue.message).join('\n')
	};
};
