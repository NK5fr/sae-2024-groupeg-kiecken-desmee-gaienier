import login from '../login/login.js';
import signin from '../login/signin.js';
import forgetPassword from '../login/forgetPassword.js';
import resetPassword from '../login/resetPassword.js';
import logout from '../login/logout.js';
import { setConnexion } from '../index.js';

export default function connexionManager(socket, usersData) {
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
		setConnexion(
			usersData.find(u => u.login === username),
			false
		);
	});

	socket.on('open', username => {
		setConnexion(
			usersData.find(u => u.login === username),
			true
		);
	});
}
