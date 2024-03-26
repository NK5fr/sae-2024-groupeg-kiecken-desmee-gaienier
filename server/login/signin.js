import fs from 'fs';
import { io } from '../index.js';

export default function signin(data, socket) {
	console.log('Données de connexion reçues', data);

	// récupère les données de l'utilisateur dans la base de données avec le login reçu
	let dataBase = fs.readFileSync('server/data/userData.json', 'utf-8');
	let dataBaseParsed = JSON.parse(dataBase);

	// parcourir database pour trouver l'utilisateur
	console.log('database', dataBaseParsed);

	let user = dataBaseParsed.find(user => user.login == data.login);
	console.log('User', user);
	if (user != undefined) {
		io.to(socket).emit('alert', 'Utilisateur déjà existant');
	}
	// si l'utilisateur n'est pas trouvé donc on l'ajoute à la base de données et on le connecte
	else {
		data.connexion = 1;
		console.log(data);
		dataBaseParsed.push(data);
		fs.writeFileSync(
			'server/data/userData.json',
			JSON.stringify(dataBaseParsed)
		);
		const players = JSON.parse(fs.readFileSync('server/data/playerData.json'));
		const newPlayer = Object.assign(
			{},
			players.find(player => player.user == 'default')
		);
		newPlayer.user = data.login;
		players.push(newPlayer);
		fs.writeFileSync('server/data/playerData.json', JSON.stringify(players));
		console.log('Utilisateur ajouté');

		io.to(socket).emit('path', '/');
		io.to(socket).emit('user', data.login);
	}
}
