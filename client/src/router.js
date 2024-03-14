import $ from 'jquery';
import { socket } from './main.js';

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
		if (route) {
			this.notFound.hide();
			if (this.currentRoute) {
				this.currentRoute.view.hide();
			}
			this.currentRoute = route;
			route.view.show();
			if (path === '/jeu') {
				socket.emit('gameStart', data => {
					canvas.width = canvas.clientWidth;
					canvas.height = canvas.clientHeight;
				});
			}
			if (path === '/join') {
				socket.emit('gameJoin', { socketId: socket.id });
				socket.on('gameJoin', data => {
					console.log(
						`user ${socket.id} joined the game of user ${data.socketId}`
					);
					console.log(data.game);
					data.game.player.push(new Player(100, 100, playerProperties));
				});
			}
			if (path === '/rejouer') {
				socket.emit('gameStop', { socketId: socket.id });
			}
			if (!skipPushState) {
				window.history.pushState(null, null, path);
			}
		} else {
			this.notFound.show();
		}
	}
}
