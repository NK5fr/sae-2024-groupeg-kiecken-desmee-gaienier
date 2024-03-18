import $ from 'jquery';
import { socket } from './main.js';
import { canvas } from './renderGame.js';

export default class Router {
	static routes = [];
	static notFound;
	static currentRoute;

	static #setInnerLinks;

	static setInnerLinks(setInnerLinks) {
		this.#setInnerLinks = setInnerLinks;
		$('.innerLink', this.#setInnerLinks).on('click', event => {
			event.preventDefault();
			Router.navigate($(event.currentTarget).attr('href'));
		});
	}

	static navigate(path, skipPushState = false) {
		const route = this.routes.find(route => route.path === path);
		console.log('route', this.#setInnerLinks);
		if (route) {
			this.notFound.hide();
			if (this.currentRoute) {
				this.currentRoute.view.hide();
			}
			this.currentRoute = route;
			route.view.show();
			if (path === '/jeu') {
				socket.emit('gameStart', {
					width: canvas.width,
					height: canvas.height,
				});
			}
			if (path === '/join') {
				socket.emit('gameJoin');
				ss;
			}
			if (path === '/rejouer') {
				socket.emit('gameEnd', { socketId: socket.id });
			}
			if (!skipPushState) {
				window.history.pushState(null, null, path);
			}
		} else {
			this.notFound.show();
		}
	}
}
