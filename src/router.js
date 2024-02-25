export default class Router {

	static routes = [];
	static currentRoute;

	static #setInnerLinks;

	static setInnerLinks(setInnerLinks) {
		this.#setInnerLinks = setInnerLinks;
		const links = this.#setInnerLinks.querySelectorAll('.innerLink');
		links.forEach(link =>
			link.addEventListener('click', event => {
				event.preventDefault();
				const linkHref = event.currentTarget.getAttribute('href');
				Router.navigate(linkHref);
			})
		);
	}

	static navigate(path, skipPushState = false) {
		const route = this.routes.find(route => route.path === path);
		if (route) {
			if (this.currentRoute) {
				this.currentRoute.view.hide();
			}
			this.currentRoute = route;
			route.view.show();

			if (!skipPushState) {
				window.history.pushState(null, null, path);
			}
		}
	}
}
