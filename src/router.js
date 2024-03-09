import $ from 'jquery';
import startGame from './game.js';

export default class Router {
	static routes = [];
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
			if (this.currentRoute) {
				this.currentRoute.view.hide();
			}
			this.currentRoute = route;
			route.view.show();
			if (path === '/jeu') startGame();
			if (!skipPushState) {
				window.history.pushState(null, null, path);
			}
		}
	}
}
