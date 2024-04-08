import $ from 'jquery';
import Router from '../router.js';

export default class JoinMenu {
	constructor(element) {
		this.element = element;
	}

	setGames(games) {
		const table = $('table', this.element);
		let html = `<tr><th>Hôte</th><th>Participants</th></tr>`;
		games.forEach(({ hostName, participants }) => {
			html += `<tr href="/jeu" class="innerLink" host="${hostName}"><td>${hostName}</td><td>${participants}/4</td><td></tr>`;
		});
		table.html(html);
		Router.setInnerLinks($("table .innerLink", this.element));
	}
}
