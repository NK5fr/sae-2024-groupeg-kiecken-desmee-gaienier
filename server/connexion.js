// récupère les données envoyées par le client du formulaire de connexion de l'index.html
// et les compare avec les données de la base de données

// quand le client envoie les données du formulaire de connexion

import fs from 'fs';

export default function connexion(data) {
	console.log('Données de connexion reçues', data);

	// récupère les données de l'utilisateur dans la base de données avec le login reçu
	let dataBase = fs.readFileSync('data/DataBase.json', 'utf-8');
	let dataBaseParsed = JSON.parse(dataBase);

	console.log('Database', dataBase.length);
	// parcourir database pour trouver l'utilisateur
	console.log('database', dataBaseParsed);

	let user = dataBaseParsed.find(
		user => user.login == data.login && user.password == data.password
	);
	console.log('User', user);
	if (user != undefined) {
		console.log('Utilisateur trouvé');
		/*
        socket.emit('loginSuccess', user);
        */
	}
    // si l'utilisateur n'est pas trouvé
    else {
        console.log('Utilisateur non trouvé');
        /*
        socket.emit('loginFail');
        */
    }
}
