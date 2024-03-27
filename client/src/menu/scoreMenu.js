import $ from 'jquery';

export default class ScoreMenu {
	static setTable(element, scores) {
		scores.sort((a, b) => a.value - b.value);
		const tenMost = scores.slice(0, 10);
		const table = $('table', element);
		let html = table.html();
		tenMost.forEach(score => {
			html += `<tr><td>${score.name}</td><td>${score.value} secondes</td></tr>`;
		});
		table.html(html);
	}
}
