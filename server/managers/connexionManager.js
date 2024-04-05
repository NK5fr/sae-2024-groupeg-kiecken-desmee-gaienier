import login from '../login/login.js';
import signin from '../login/signin.js';
import forgetPassword from '../login/forgetPassword.js';
import resetPassword from '../login/resetPassword.js';
import logout from '../login/logout.js';
import { readFileSync, writeFileSync } from 'fs';

export default function connexionManager(socket) {
	socket.on('userLogin', ({ userLogin, password }) => {
		login(userLogin, password, socket.id);
	});
	socket.on('userLogout', login => {
		logout(login, socket.id);
	});
	socket.on('userSignin', ({ login, password, recoverySentence, response }) => {
		signin(login, password, recoverySentence, response, socket.id);
	});
	socket.on('userForgetPassword', ({ login, recoverySentence, response }) => {
		forgetPassword(login, recoverySentence, response, socket.id);
	});
	socket.on('userResetPassword', ({ login, password }) => {
		resetPassword(login, password, socket.id);
	});
	socket.on('close', username => {
		const usersProperties = readUsersProperties();
		const userProperties = usersProperties.find(u => u.login === username);
		setConnexion(userProperties, false, usersProperties);
	});
	socket.on('open', username => {
		const usersProperties = readUsersProperties();
		const userProperties = usersProperties.find(u => u.login === username);
		setConnexion(userProperties, true, usersProperties);
	});
}

function setConnexion(user, value, usersProperties) {
	user.connexion = value;
	writeUsersProperties(usersProperties);
}

export function readUsersProperties() {
	return JSON.parse(readFileSync('server/data/usersProperties.json', 'utf8'));
}

export function writeUsersProperties(usersProperties) {
	writeFileSync(
		'server/data/usersProperties.json',
		JSON.stringify(usersProperties)
	);
}
