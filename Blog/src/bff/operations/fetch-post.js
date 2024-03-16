import { getComments, getPost, getUsers } from '../api';

export const fetchPost = async (postId) => {
	let post;
	let error;

	try {
		post = await getPost(postId);
	} catch (postError) {
		error = postError;
	}

	if (error) {
		return {
			error,
			res: null,
		};
	}

	const comments = await getComments(postId);

	const users = await getUsers();

	const commentsWithAuthor = comments
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

	return {
		error: null,
		res: {
			...post,
			comments: commentsWithAuthor,
		},
	};
};
