import $ from 'jquery';

export default class LoginMenu {
	static setLogin(menu, socket) {
		$('form', menu).on('submit', event => {
			event.preventDefault();
			const login = $('input[name=login]', menu).val();
			const password = $('input[name=password]', menu).val();
			$('input[name=login]', menu).val('');
			$('input[name=password]', menu).val('');
			socket.emit('login', { login, password });
		});
	}

	static setSignin(menu, socket) {
		$('form', menu).on('submit', event => {
			event.preventDefault();
			const login = $('input[name=login]', menu).val();
			const password = $('input[name=password]', menu).val();
			const password2 = $('input[name=password2]', menu).val();
			const recovery_phrase = $('input[name=question]', menu).val();
			const reponse = $('input[name=reponse]', menu).val();

			if (password != password2) {
				alert('Les mots de passe ne correspondent pas');
				return;
			} else {
				$('input[name=login]', menu).val('');
				$('input[name=password]', menu).val('');
				$('input[name=password2]', menu).val('');
				$('input[name=question]', menu).val('');
				$('input[name=reponse]', menu).val('');
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
			const recovery_phrase = $('input[name=question]', menu).val();
			const reponse = $('input[name=reponse]', menu).val();
			$('input[name=login]', menu).val('');
			$('input[name=question]', menu).val('');
			$('input[name=reponse]', menu).val('');
			socket.emit('mdp_oublie', { login, recovery_phrase, reponse });
		});
	}
	static resetPassword(menu, socket) {
		$('form', menu).on('submit', event => {
			event.preventDefault();
			const password = $('input[name=password]', menu).val();
			const password2 = $('input[name=password2]', menu).val();
			$('input[name=password]', menu).val('');
			$('input[name=password2]', menu).val('');
			socket.emit('resetPassword', { password, password2 });
		});
	}

	static setLogout(menu, socket, user) {
		$('.deconnexion', menu).on('click', event => {
			event.preventDefault();
			socket.emit('logout' , user);
		});
	}
}
