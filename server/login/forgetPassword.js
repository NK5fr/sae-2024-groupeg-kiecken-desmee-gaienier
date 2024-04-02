import { readFileSync } from 'fs';
import { io } from '../index.js';
import { readUsersData } from '../managers/connexionManager.js';

export default function forgetPassword(
	login,
	recoverySentence,
	response,
	socketId
) {
	const usersData = readUsersData();
	const user = usersData.find(
		user =>
			user.login === login &&
			user.recoverySentence === recoverySentence &&
			user.response === response
	);
	if (user) {
		io.to(socketId).emit('userResetPassword', login);
	} else {
		io.to(socketId).emit(
			'serverAlert',
			'Login, phrase de récupération ou réponse incorrecte'
		);
	}
}
