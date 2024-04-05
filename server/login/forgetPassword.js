import { io } from '../index.js';
import { readUsersProperties } from '../managers/connexionManager.js';

export default function forgetPassword(
	login,
	recoverySentence,
	response,
	socketId
) {
	const usersProperties = readUsersProperties();
	const userProperties = usersProperties.find(
		u =>
			u.login === login &&
			u.recoverySentence === recoverySentence &&
			u.response === response
	);
	if (userProperties) {
		io.to(socketId).emit('userResetPassword', login);
	} else {
		io.to(socketId).emit(
			'serverAlert',
			'Login, phrase de récupération ou réponse incorrecte'
		);
	}
}
