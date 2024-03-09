export const sanitizeContent = (content) =>
	content
		// .replaceAll(/\s+/g, '')
		.replaceAll('<div><br></div>', '\n')
		.replaceAll('<div>', '\n')
		.replaceAll('</div>', '');
