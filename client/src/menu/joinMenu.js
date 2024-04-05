import $ from 'jquery';

export default class JoinMenu {
	constructor(element) {
		this.element = element;
	}

	setGames(games) {
		const table = $('table', this.element);
		let html = `<tr><th>Hôte</th><th>Participants</th><th></th></tr>`;
		games.forEach(({ hostName, participants }) => {
			html += `<tr><td>${hostName}</td><td>${participants}/4</td><td><a href="/jeu" class="innerLink" host="${hostName}">Rejoindre</a></tr>`;
		});
		table.html(html);
	}
}
