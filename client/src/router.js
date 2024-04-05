import $ from 'jquery';
import { socket, userName } from './main.js';
import { canvas, stopGameRenderer } from './game/renderGame.js';

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
			const link = $(event.currentTarget);
			if (link.attr('host')) {
				Router.navigate(
					$(event.currentTarget).attr('href'),
					false,
					link.attr('host')
				);
			} else {
				Router.navigate($(event.currentTarget).attr('href'));
			}
		});
	}

	static navigate(path, skipPushState = false, hote = null) {
		let route = this.routes.find(route => route.path === path);
		if (userName && this.connexionRoutes.includes(route?.path)) {
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
				if (hote) {
					socket.emit('user join a game', {
						hostName: hote,
						userName: window.sessionStorage.getItem('userName'),
					});
				} else {
					socket.emit('user start a game', {
						userName: window.sessionStorage.getItem('userName'),
						width: canvas.width,
						height: canvas.height,
						diff: $('.diff .active').val(),
					});
				}
			} else {
				stopGameRenderer();
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
