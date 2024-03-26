// récupère les données envoyées par le client du formulaire de connexion de l'index.html
// et les compare avec les données de la base de données

// quand le client envoie les données du formulaire de connexion

import fs from 'fs';
import { io } from '../index.js';

export default function connexion(data, socket) {
	console.log('Données de connexion reçues', data);

	// récupère les données de l'utilisateur dans la base de données avec le login reçu
	let dataBase = fs.readFileSync('server/data/userData.json', 'utf-8');
	let dataBaseParsed = JSON.parse(dataBase);

	console.log('Database', dataBase.length);
	// parcourir database pour trouver l'utilisateur
	console.log('database', dataBaseParsed);

	let user = dataBaseParsed.find(
		user => user.login == data.login && user.password == data.password
	);
	console.log('User', user);
	if (user != undefined && user.connexion == false) {
		io.to(socket).emit('user', user.login);
		io.to(socket).emit('path', '/');
		user.connexion = true;
		// enregistre la connexion de l'utilisateur dans la base de données
		fs.writeFileSync(
			'server/data/userData.json',
			JSON.stringify(dataBaseParsed)
		);
	} else if (user != undefined && user.connexion == true) {
		io.to(socket).emit('alert', 'Utilisateur déjà connecté');
	} else {
		io.to(socket).emit('alert', 'Mot de passe ou login incorrect');
	}
}
