import $ from 'jquery';

export default class JoinMenu {

    constructor(element){
        this.element = element;
    }

    setGames(games){
		const table = $('table', this.element);
		let html = `<tr><th>Hôte</th><th>Participants</th></tr>`;
		games.forEach(game => {
			html += `<tr class="innerLink" href="/jeu" host="${game.host}"><td>${game.host}</td><td>${game.participants}</td></tr>`;
		});
		table.html(html);
    }
}