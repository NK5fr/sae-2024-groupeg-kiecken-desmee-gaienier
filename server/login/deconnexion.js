import fs from 'fs';
import { io } from '../index.js';

export default function deconnexion(data, socket) {
	// récupère les données de l'utilisateur dans la base de données avec le login reçu
	let dataBase = fs.readFileSync('server/data/userData.json', 'utf-8');
	let dataBaseParsed = JSON.parse(dataBase);

	console.log('Database', dataBase.length);
	console.log('database', dataBaseParsed);

	let user = dataBaseParsed.find(user => user.login == data.login);
	console.log('User', user);
	if (user != undefined && user.connexion == 1) {
		io.to(socket).emit('user', user.login);
		io.to(socket).emit('path', '/');
		user.connexion = 0;
		fs.writeFileSync(
			'server/data/userData.json',
			JSON.stringify(dataBaseParsed)
		);
	} else if (user != undefined && user.connexion == 0) {
		io.to(socket).emit('alert', 'Utilisateur déjà déconnecté');
	} else {
		io.to(socket).emit('alert', 'Utilisateur non trouvé');
	}
}
