import $ from 'jquery';

export default class LoginMenu {
	static setLogin(menu, socket) {
		$('form', menu).on('submit', event => {
			event.preventDefault();
			const login = $('input[name=login]', menu).val();
			const password = $('input[name=password]', menu).val();
			socket.emit('login', { login, password });
		});
	}
	static setSignin(menu, socket) {
		$('form', menu).on('submit', event => {
			event.preventDefault();
			const login = $('input[name=login]', menu).val();
			const password = $('input[name=password]', menu).val();
			const password2 = $('input[name=password2]', menu).val();
			const recovery_phrase = $('select[name=recovery_phrase]', menu).val();
			const reponse = $('input[name=reponse]', menu).val();

			console.log(recovery_phrase);
			if (password != password2) {
				alert('Les mots de passe ne correspondent pas');
				return;
			} else {
				socket.emit('signin', {
					login,
					password,
					recovery_phrase,
					reponse,
				});
			}
		});
	}

	static setMdp_oublie(menu, socket) {
		$('form', menu).on('submit', event => {
			event.preventDefault();
			const login = $('input[name=login]', menu).val();
			const recovery_phrase = $('select[name=recovery_phrase2]', menu).val();
			const response = $('input[name=response]', menu).val();
			socket.emit('mdp_oublie', { login, recovery_phrase, response });
		});
	}
	static resetPassword(menu, socket, login) {
		$('form', menu).on('submit', event => {
			event.preventDefault();
			login = login;
			console.log('login', login);

			const password = $('input[name=password]', menu).val();
			const password2 = $('input[name=password2]', menu).val();
			if (password !== password2) {
				alert('Les mots de passe ne correspondent pas');
				return;
			} else if (login === null) {
				console.log(login);
				alert('Erreur lors de la réinitialisation du mot de passe');
				return;
			} else {
				console.log('resetPassword', login, password);
				socket.emit('resetPassword', { login, password });
			}
		});
	}

	static setLogout(button, socket, user) {
		// si l'utilisateur clique sur le bouton de déconnexion alors on envoie un message au serveur pour lui dire de déconnecter l'utilisateur
		button.on('click', event => {
			event.preventDefault();
			console.log("Déconnexion de l'utilisateur", user);
			socket.emit('logout', user);
		});
	}
}
