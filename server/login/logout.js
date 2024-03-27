import fs from 'fs';
import { io } from '../index.js';

export default function logout(data, socket) {
	// récupère les données de l'utilisateur dans la base de données avec le login reçu
	let dataBase = fs.readFileSync('server/data/userData.json', 'utf-8');
	let dataBaseParsed = JSON.parse(dataBase);

	console.log(data);

	let user = dataBaseParsed.find(user => user.login == data);
	console.log('User', user);
	if (user != undefined && user.connexion == true) {
		io.to(socket).emit('path', '/login');
		user.connexion = false;
		fs.writeFileSync(
			'server/data/userData.json',
			JSON.stringify(dataBaseParsed)
		);
	} else if (user != undefined && user.connexion == false) {
		io.to(socket).emit('alert', 'Utilisateur déjà déconnecté');
	} else {
		io.to(socket).emit('alert', 'Utilisateur non trouvé');
	}
}
