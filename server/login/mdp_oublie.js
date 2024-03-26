import fs from 'fs';
import { io } from '../index.js';

export default function mdp_oublie(data, socket) {
	console.log('Données de connexion reçues', data);

	// récupère les données de l'utilisateur dans la base de données avec le login reçu
	let dataBase = fs.readFileSync('server/data/userData.json', 'utf8');
	let dataBaseParsed = JSON.parse(dataBase);

	// parcourir database pour trouver l'utilisateur
	console.log('database', dataBaseParsed[0]);

	let user = dataBaseParsed.find(
		user =>
			user.login === data.login &&
			user.recovery_phrase === data.recovery_phrase &&
			user.response === data.response
	);

	console.log('User', user);

	if (user != undefined) {
		io.to(socket).emit('resetLogPass', user.login);
		io.to(socket).emit('path', '/resetPassword');
	} else {
		io.to(socket).emit(
			'alert',
			'Utilisateur non trouvé ou mauvaise question ou mauvaise réponse à la question'
		);
	}
}
