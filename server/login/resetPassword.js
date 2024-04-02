import { io } from '../index.js';
import { readUsersData, writeUsersData } from '../managers/connexionManager.js';

export default function resetPassword(login, password, socketId) {
	const usersData = readUsersData();
	const user = usersData.find(user => user.login === login);
	if (user) {
		//const passwordMD5 = encryptionTool(password);
		//user.password = passwordMD5;
		user.password = password;
		writeUsersData(usersData);
		io.to(socketId).emit('changePath', '/login');
	} else {
		io.to(socketId).emit('serverAlert', 'Utilisateur non trouvé');
	}
}
