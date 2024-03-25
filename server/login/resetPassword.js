import fs from 'fs';

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
		// Supprime l'utilisateur de la base de données
		dataBaseParsed = dataBaseParsed.filter(user => user.login != data.login);
		// Ajoute l'utilisateur modifié à la base de données
		dataBaseParsed.push(user);
		fs.writeFileSync('data/DataBase.json', JSON.stringify(dataBaseParsed));
		console.log('Mot de passe réinitialisé');
		//socket.emit('loginSuccess', user);
	} else {
		console.log('Utilisateur non trouvé');
		//socket.emit('loginFail');
	}
}
