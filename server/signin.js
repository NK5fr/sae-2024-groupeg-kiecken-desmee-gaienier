import fs from 'fs';

export default function signin(data) {
	console.log('Données de connexion reçues', data);

	// récupère les données de l'utilisateur dans la base de données avec le login reçu
	let dataBase = fs.readFileSync('data/DataBase.json', 'utf-8');
	let dataBaseParsed = JSON.parse(dataBase);

	// parcourir database pour trouver l'utilisateur
	console.log('database', dataBaseParsed);

	let user = dataBaseParsed.find(user => user.login == data.login);
	console.log('User', user);
	if (user != undefined) {
		console.log('cette utilisateur existe déjà');
	}
	// si l'utilisateur n'est pas trouvé
	else {
		console.log('Utilisateur non trouvé');
		dataBaseParsed.push(data);
		fs.writeFileSync('data/DataBase.json', JSON.stringify(dataBaseParsed));
	}
}
