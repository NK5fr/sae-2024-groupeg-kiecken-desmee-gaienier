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
		const usersData = readUsersData();
		const user = usersData.find(u => u.login === username);
		setConnexion(user, false, usersData);
	});
	socket.on('open', username => {
		const usersData = readUsersData();
		const user = usersData.find(u => u.login === username);
		setConnexion(user, true, usersData);
	});
}

function setConnexion(user, value, usersData) {
	user.connexion = value;
	writeUsersData(usersData);
}

export function readUsersData() {
	return JSON.parse(readFileSync('server/data/userData.json', 'utf8'));
}

export function writeUsersData(usersData) {
	writeFileSync('server/data/userData.json', JSON.stringify(usersData));
}
