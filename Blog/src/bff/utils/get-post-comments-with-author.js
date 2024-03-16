import { getComments, getUsers } from '../api';

export const getPostCommentsWithAuthor = async (postId) => {
	const comments = await getComments(postId);

	const users = await getUsers();

	return comments
		.map((comment) => {
			if (!comment || comment.authorId === undefined) {
				return null;
			}

			const user = users.find(({ id }) => id === comment.authorId);
			return {
				...comment,
				author: user?.login,
			};
		})
		.filter((comment) => comment !== null);
};
