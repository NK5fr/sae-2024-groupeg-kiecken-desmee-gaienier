import $ from 'jquery';

export default class ScoreMenu {
	constructor(element) {
		this.element = element;
	}

	setTable(scores) {
		scores.sort((a, b) => this.comparator(a.score, b.score));
		const tenMost = scores.slice(0, 10);
		const table = $('table', this.element);
		let html = `<tr><th>Rang</th><th>Pseudo</th><th>Temps</th></tr>`;
		let n = 1;
		tenMost.forEach(score => {
			html += `<tr><td>${n}</td><td>${score.user}</td><td>${score.score}</td></tr>`;
			n++;
		});
		table.html(html);
	}

	comparator(time1, time2) {
		const time1Split = time1.split(`:`).map(x => parseInt(x));
		const time2Split = time2.split(`:`).map(x => parseInt(x));
		if (time1Split[0] == time2Split[0]) {
			if (time1Split[1] == time2Split[1]) {
				return time1Split[2] - time2Split[2];
			}
			return time1Split[1] - time2Split[1];
		}
		return time1Split[0] - time2Split[0];
	}
}
