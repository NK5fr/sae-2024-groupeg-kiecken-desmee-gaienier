import $ from 'jquery';

export default class LoginMenu {
	static setMenu(menu, socket) {
		$('form', menu).on('submit', event => {
			event.preventDefault();
			const login = $('input[name=login]', menu).val();
			const password = $('input[name=password]', menu).val();
			$('input[name=login]', menu).val('');
			$('input[name=password]', menu).val('');
			socket.emit('login', { login, password });
		});
	}
}
