import $ from 'jquery';
import { socket } from '../main.js';

export default class LoginMenu {
	static setLogin(menu) {
		$('form', menu).on('submit', event => {
			event.preventDefault();
			const login = $('input[name=login]', menu).val();
			const password = $('input[name=password]', menu).val();
			socket.emit('userLogin', { userLogin: login, password });
		});
	}

	static setSignin(menu) {
		$('form', menu).on('submit', event => {
			event.preventDefault();
			const login = $('input[name=login]', menu).val();
			const password = $('input[name=password]', menu).val();
			const password2 = $('input[name=password2]', menu).val();
			const recoverySentence = $('select[name=recovery_phrase]', menu).val();
			const response = $('input[name=reponse]', menu).val();

			if (password != password2) {
				alert('Les mots de passe ne correspondent pas');
				return;
			} else {
				socket.emit('userSignin', {
					login,
					password,
					recoverySentence,
					response,
				});
			}
		});
	}

	static setForgetPassword(menu) {
		$('form', menu).on('submit', event => {
			event.preventDefault();
			const login = $('input[name=login]', menu).val();
			const recoverySentence = $('select[name=recovery_phrase2]', menu).val();
			const response = $('input[name=response]', menu).val();
			socket.emit('userForgetPassword', { login, recoverySentence, response });
		});
	}

	static setResetPassword(menu, login) {
		$('form', menu).on('submit', event => {
			event.preventDefault();
			const password = $('input[name=password]', menu).val();
			const password2 = $('input[name=password2]', menu).val();
			if (password !== password2) {
				alert('Les mots de passe ne correspondent pas');
			} else if (login === null) {
				alert('Erreur lors de la réinitialisation du mot de passe');
			} else {
				socket.emit('userResetPassword', { login, password });
			}
		});
	}

	static setLogout(button) {
		button.on('click', event => {
			event.preventDefault();
			const login = window.sessionStorage.getItem('user');
			window.sessionStorage.removeItem('user');
			console.log(login);
			socket.emit('userLogout', login);
		});
	}
}
