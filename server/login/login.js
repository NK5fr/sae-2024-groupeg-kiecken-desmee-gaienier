import { readFileSync, writeFileSync } from 'fs';
import { io } from '../index.js';

//import encryptionTool from './encryptionTool.js';

export default function login(login, password, socketId) {
	const usersData = JSON.parse(
		readFileSync('server/data/userData.json', 'utf-8')
	);

	//const passwordMD5 = encryptionTool(password);
	const user = usersData.find(
		///user => user.login == login && user.password == passwordMD5
		user => user.login === login && user.password === password
	);
	if (user && !user.connexion) {
		user.connexion = true;
		writeFileSync('server/data/userData.json', JSON.stringify(usersData));
		io.to(socketId).emit('userLogin', user.login);
	} else if (user && user.connexion) {
		io.to(socketId).emit('serverAlert', 'Utilisateur déjà connecté');
	} else {
		io.to(socketId).emit('serverAlert', 'Mot de passe ou login incorrect');
	}
}
