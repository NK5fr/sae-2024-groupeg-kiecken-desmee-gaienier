import $ from 'jquery';
import { socket, user } from './main.js';
import { canvas } from './game/renderGame.js';

export default class Router {
	static routes = [];
	static notFound;
	static currentRoute;
	static connexionRoutes = [];

	static #setInnerLinks;

	static setInnerLinks(setInnerLinks) {
		this.#setInnerLinks = setInnerLinks;
		$('.innerLink', this.#setInnerLinks).on('click', event => {
			event.preventDefault();
			Router.navigate($(event.currentTarget).attr('href'));
		});
	}

	static navigate(path, skipPushState = false) {
		let route = this.routes.find(route => route.path === path);
		if (user && this.connexionRoutes.includes(route?.path)) {
			route = this.routes.find(route => route.path === '/');
		}
		if (route) {
			this.notFound.hide();
			if (this.currentRoute) {
				this.currentRoute.view.hide();
			}
			this.currentRoute = route;
			route.view.show();
			if (route.path === '/jeu') {
				socket.emit('gameStart', {
					width: canvas.width,
					height: canvas.height,
					user: window.sessionStorage.getItem('user'),
				});
			} else if (route.path === '/rejoindre') {
				socket.emit('gameStop');
				socket.emit('gameJoin', { host: 'raph', user: user });
			} else {
				socket.emit('gameStop');
			}
			if (!skipPushState) {
				window.history.pushState(null, null, route.path);
			}
		} else {
			this.notFound.show();
		}
	}
}
