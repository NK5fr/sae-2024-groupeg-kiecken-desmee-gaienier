import $ from 'jquery';

export default class ScoreMenu {
	static setTable(element, scores) {
		scores.sort((a, b) => a.value - b.value);
		const tenMost = scores.slice(0, 10);
		const table = $('table', element);
		let html = table.html();
		let n = 1;
		tenMost.forEach(score => {
			html += `<tr><td>${n}</td><td>${score.name}</td><td>${score.value} secondes</td></tr>`;
			n++;
		});
		table.html(html);
	}
}
