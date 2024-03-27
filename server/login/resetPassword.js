import fs from 'fs';
import { io } from '../index.js';

export default function resetPassword(data, socket) {
	console.log('Données de réinitialisation de mot de passe reçues', data);

	// récupère les données de l'utilisateur dans la base de données avec le login reçu
	let dataBase = fs.readFileSync('server/data/userData.json', 'utf-8');
	let dataBaseParsed = JSON.parse(dataBase);

	// parcourir database pour trouver l'utilisateur
	console.log('database', dataBaseParsed);

	let user = dataBaseParsed.find(user => user.login == data.login);
	console.log('User', user);

	if (user != undefined) {
		user.password = data.password;
		fs.writeFileSync(
			'server/data/userData.json',
			JSON.stringify(dataBaseParsed)
		);
		io.to(socket).emit('path', '/login');
	} else {
		io.to(socket).emit('alert', 'Utilisateur non trouvé');
	}
}
