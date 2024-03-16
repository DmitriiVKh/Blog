import { getSession, addSession, deleteSession } from './api';

export const sessions = {
	create(user) {
		const hash = Math.random().toFixed(50);

		addSession(hash, user);

		return hash;
	},

	async remove(hash) {
		const session = await getSession(hash);

		if (!session) {
			return;
		}
		deleteSession(session.id);
	},

	async access(hash, accessRoles) {
		const dbSession = await getSession(hash);

		if (!dbSession || !dbSession.user || !dbSession.user.roleId) {
			return false;
		}

		const userRole = dbSession.user.roleId;

		return accessRoles.includes(parseInt(userRole, 10));
		// return accessRoles.includes(userRole);
	},
};
