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
			const question = $('input[name=question]', menu).val();
			const reponse = $('input[name=reponse]', menu).val();
			$('input[name=login]', menu).val('');
			$('input[name=password]', menu).val('');
			$('input[name=password2]', menu).val('');
			$('input[name=question]', menu).val('');
			$('input[name=reponse]', menu).val('');
			socket.emit('signin', { login, password, password2, question, reponse });
		});
	}
}
