import fs from 'fs';

export default function mdp_oublie(data) {
	console.log('Données de connexion reçues', data);

	// récupère les données de l'utilisateur dans la base de données avec le login reçu
	let dataBase = fs.readFileSync('server/data/userData.json', 'utf8');
	let dataBaseParsed = JSON.parse(dataBase);

	// parcourir database pour trouver l'utilisateur
	console.log('database', dataBaseParsed);

	let user = dataBaseParsed.find(
		user =>
			user.login == data.login &&
			user.question == data.question &&
			user.reponse == data.reponse
	);

	console.log('User', user);
	if (user != undefined) {
		//chemin vers la page de réinitialisation du mot de passe
		console.log('réinitialisation du mot de passe');

		//socket.emit('resetPassword', { login: user.login });
	} else {
		console.log(
			'Utilisateur non trouvé ou mauvaise réponse à la question secrète'
		);
	}
}
